import { useQuery } from "@tanstack/react-query"
import { 
  useState, 
  useEffect, 
  createContext, 
  useContext, 
  useReducer,
  useCallback,
  useMemo
} from 'react'

interface Member {
  Name: string
}

function useMembersSource(): {
  members: Member[]
  search: string
  setSearch: (search: string) => void
} {
  // useQuery to retrieve data -- sorts data on first load instead of w/ useMemo
  const { data: members } = useQuery<Member[]>(
    ["members"],
    () => fetch("/membercards.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("SORT")
        return data.sort((a: Member, b: Member) => a.Name.localeCompare(b.Name))
      }),
    { initialData: [] } // does not eliminate T | undefined in TS
  )
  type MemberState = {
    search: string
  }
  type MemberAction = {
    type: "setSearch"
    payload: string
  }

  // Member data and search string
  const [{ search }, dispatch] = useReducer(
    (state: MemberState, action: MemberAction) => {
      switch(action.type) {
        case "setSearch":
          return { ...state, search: action.payload }
      }
  }, {
    search: ""
  })

  // We're not exposing dispatch outside of useMembersSource, so we need a way
  // to offer setSearch beyond this component (e.g., in onChange for SearchBox)
  // should always use useCallback in custom hooks when you're defining a 
  // function that you're returning
  const setSearch = useCallback((search: string) => {
    dispatch({
      type: "setSearch",
      payload: search
    })
  }, []) 

  // uses non-null assertion operator (!) because TypeScript doesn't allow scope narrowing with useQuery destructuring
  const filteredMembers = useMemo(() => {
    return members!.filter((m) => m.Name.toLowerCase().includes(search.toLowerCase())).slice(0, 20)
  }, [members, search])

  // Should we just sort on first load instead? 
  // const sortedMembers = useMemo(() => {
  //   console.log("SORT")
  //   return [...filteredMember].sort((a, b) => a.name.localeCompare(b.name))
  // }, [filteredMember])

  // Return filteredMember as Member (for object destructuring)
  return { members: filteredMembers, search, setSearch }
}

const MemberContext = createContext<
  ReturnType<typeof useMembersSource> | undefined
>(undefined)

// Returns the context value for the calling component, in our case, MemberList.
// MemberList is nested inside of a MemberProvider, which has a context value of
// useMembersSource(). The context itself does not hold the information, 
// it only represents the kind of information you can provide or read from components.

// Simple terms: useMembers is a custom useContext, 
// useContext returns the value from the context provider,
// the context provider offers a value prop that can be accessed by descendents 
export function useMembers() {
  return useContext(MemberContext)!
}

export function MemberProvider({
    children
}: {
    children: React.ReactNode
}) {
    return (
      <MemberContext.Provider value={(useMembersSource())}>
          {children}
      </MemberContext.Provider>
    )
}