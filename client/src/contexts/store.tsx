// TODO: how to deal with larger amounts of data? 

import { useQuery } from "@tanstack/react-query";
import React from 'react';
import axios from 'axios';
import { 
  createContext, 
  useContext, 
  useReducer,
  useCallback,
  useMemo
} from 'react';

// Where to fetch the data from (e.g. file path or proxy URL)
const DATA_SOURCE: string = 'http://localhost:4000/getmembers';

// Member entry from Notion database
interface Member {
  name: string
  // ... 
}

// Custom hook to fetch and filter data from Notion.
// Returns an array of Member, the current search string, 
// and a setSearch callback.
function useMembersSource(): {
  members: Member[]
  search: string
  setSearch: (search: string) => void
} {
  // Use useQuery to retrieve data. Checks cache to see if all the requested 
  // data is already available locally. If all data is available locally, 
  // useQuery returns that data and doesn't query the DB. 
  // (Note: sorts data on first load/update instead of with useMemo).
  const { data: members } = useQuery<Member[]>(
    ["members"],
    () => axios.get(DATA_SOURCE, { withCredentials: true }) 
      .then((res) => {
        console.log("SORT")
        return res.data.sort((a: Member, b: Member) => a.name.localeCompare(b.name))
      }),
    { initialData: [] } // does not eliminate <T | undefined> in TS
  )
  // The state of the members is defined by the current search string.
  type MembersState = {
    search: string
  }
  // An action that allows the modification of the search string. 
  type MembersAction = {
    type: "setSearch"
    payload: string
  }

  // Facilitate search input via reducer (allows us to pass dispatch down
  // instead of callbacks)
  const [{ search }, dispatch] = useReducer(
    (state: MembersState, action: MembersAction) => {
      switch(action.type) {
        case "setSearch":
          // Take current search string (state) and update it 
          return { ...state, search: action.payload }
      }
  }, {
    search: ""
  });

  // We're not exposing dispatch outside of useMembersSource, so we need a way
  // to offer setSearch beyond this component (e.g., in onChange for SearchBox).
  // (Sidenote: you should always use useCallback in custom hooks when you're 
  // defining a function that you're returning)
  const setSearch = useCallback((search: string) => {
    // Take the search string and call the reducer dispatch to update the 
    // search string state
    dispatch({
      type: "setSearch",
      payload: search
    });
  }, []);

  // Filter members based on search and only present the first 20 results. 
  // (Note: we could also offer sorting in this useMemo, but it was decided that
  // sorting could be done on a first load instead).
  // (Also note: uses non-null assertion operator `!` because TypeScript doesn't 
  // allow scope narrowing with useQuery destructuring).
  const filteredMembers = useMemo(() => {
    return members!.filter(
      (m) => m.name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 20);
  }, [members, search]);

  // Return `members` as `filteredMembers`, the current `search` string, and the
  // `setSearch` callback
  return { members: filteredMembers, search, setSearch };
};

// Create a custom members Context object with a default value of `undefined`.
// Context value is either `typeof useMembersSource` or `undefined`. 
const MembersContext = createContext<
  ReturnType<typeof useMembersSource> | undefined
>(undefined);

// Export a custom useContext hook to obtain the context 
// value of `MembersContext`. 
export function useMembers() {
  // Accepts a MembersContext object and returns the current context value for
  // that context. Also, asserts that useContext will not return `undefined`.
  return useContext(MembersContext)!
};

// Export a `MembersContext` provider that allows consuming 
// children components to subscribe to `MembersContex` changes.
// Offers the value of `useMembersSource` to children.   
export function MembersProvider({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <MembersContext.Provider value={(useMembersSource())}>
      {children}
    </MembersContext.Provider>
  )
};