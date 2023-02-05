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
import MiniSearch, { MatchInfo, SearchResult } from "minisearch";
import { Search } from "react-router-dom";

// Where to fetch the data from (e.g. file path or proxy URL)
const GET_MEMBERS_ENDPOINT: string = 'http://localhost:4000/getmembers';
// Number of members to display
const DISPLAY_COUNT: number = 20;

// Member entry from Notion database
interface Member {
  id: any;
  name: string;
  isActive: string;
  tamidClass: string;
  majors: string[];
  minors: string[];
  graduationYear: string;
  hometown: string;
  instagram: string;
  linkedin: string;
  mbtiPersonality: string[];
  birthday: string;
  mentorshipStatus: string;
  northeasternEmail: string;
  phoneNumber: string;
  picture: string;
  trackInvolvement: string;
  tamidChatsStatus: string;
  isGraduated: boolean;
}

// Custom hook to fetch and filter data from Notion.
// Returns an array of Member, the current search string, 
// and a setSearch callback.
function useMembersSource(): {
  members: SearchResult[] | Member[]
  search: string
  setSearch: (search: string) => void
  showLoading: boolean
} {
  // Use useQuery to retrieve data. Checks cache to see if all the requested 
  // data is already available locally. If all data is available locally, 
  // useQuery returns that data and doesn't query the DB. 
  // (Note: sorts data on first load/update instead of with useMemo).
  const { data: members, isFetching } = useQuery<Member[]>(
    ["members"],
    () => axios.get(GET_MEMBERS_ENDPOINT, { withCredentials: true }) 
      .then((res) => {
        console.log("SORT")
        return res.data.sort((a: Member, b: Member) => a.name.localeCompare(b.name))
      }),
    { 
      initialData: [], // does not eliminate <T | undefined> in TS
      refetchOnWindowFocus: false, // must reload page to receive updates 
    } 
  )
  // Indicate that data is loading when fetching (not isLoading); no refetch
  // on window focus, so "loading" won't get displayed when switching tabs
  const showLoading: boolean = isFetching;

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
  // instead of callbacks) --> String search, (X -> X) 
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



  // Add document ids to each member (TODO do this on load)
  let idMembers: Member[] = members.map((m, index) => ({ ...m, id: index }));
  // MiniSearch search engine
  const searchIndex = new MiniSearch({
    // fields to index for full-text search
    fields: ["name", "tamidClass", "majors", "minors", "hometown", "trackInvolvement"],
    // return all fields with search results
    storeFields: [
      "name",
      "isActive",
      "tamidClass",
      "majors",
      "minors",
      "graduationYear",
      "hometown",
      "instagram",
      "linkedin",
      "mbtiPersonality",
      "birthday",
      "mentorshipStatus",
      "northeasternEmail",
      "phoneNumber",
      "picture",
      "trackInvolvement",
      "tamidChatsStatus",
      "isGraduated",       
    ],
    searchOptions: {
      // boost weights of the fields in data
      boost: { trackInvolvement: 5 },
      // prefix search (so 'te' will match 'tech')
      prefix: true,
      // how flexible to be with misspellings: higher number => more lenient
      fuzzy: 0.25,
    }
  });
  // Add all member data to search index
  searchIndex.addAll(idMembers);
  // const searchResults = searchIndex.search(search).length ? searchIndex.search(search) : idMembers;
  const searchResults = searchIndex.search(search);

  // filter out match scores that are much lower (right now, function is just if it's less than X of highest score)
  // can come up with a better mathematical model later TODO !!
  const maxScore = Math.max(...searchResults.map(res => res.score));
  const THRESH_COEFFICIENT = 0.0; // TODO !! maybe have an algorithm that prioritizes longer exact match 
  let filteredMembers: Member[] | SearchResult[] = searchResults.filter(res => res.score > (maxScore * THRESH_COEFFICIENT));
  
  if (filteredMembers.length === 0 && search.length === 0) {
    filteredMembers = idMembers;
  }


  // ================== DEPRECATED EXACT MATCH =============================

  // Filter members based on search and only present the first DISPLAY_COUNT results.
  // (Note: we could also offer sorting in this useMemo, but it was decided that
  // sorting could be done on a first load instead).
  // (Also note: uses non-null assertion operator `!` because TypeScript doesn't 
  // allow scope narrowing with useQuery destructuring).
  // const filteredMembers = useMemo(() => {
  //   return members!.filter(
  //     (member) => 
  //       Object.values(member).some(
  //         value =>
  //           typeof value === "string" &&
  //           value.toLowerCase().includes(search.toLowerCase()) 
  //       )
  //       //m.name.toLowerCase().includes(search.toLowerCase()) // TODO !! also allow searching by other attributes 
  //   ).slice(0, DISPLAY_COUNT); 
  // }, [members, search]);
  // TODO ^^ introduce a filter factory for future filters (e.g. filter by tamid_chats, major, class, etc.)
  
  // Return `members` as `filteredMembers`, the current `search` string, and the
  // `setSearch` callback
  return { members: filteredMembers, search, setSearch, showLoading };
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