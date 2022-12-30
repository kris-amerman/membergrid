import { useEffect, useState } from 'react';
import React from 'react';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemberProvider, useMembers } from "./store";

const queryClient = new QueryClient();

function SearchBox() {
  const { search, setSearch } = useMembers();
  return (
    <input
      className="mt-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-800 focus:ring-indigo-800 sm:text-lg p-2"
      placeholder="Search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

const MemberCards = () => {
  const { members } = useMembers();
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-3">
      {members.map((m) => (
        <li key={m.Name} className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
          <div className="flex-1 flex flex-col p-8">
            <img
              className="w-32 h-32 flex-shrink-0 mx-auto bg-black rounded-full"
              src={``}
              alt={`${m.Name}`}
            />
            <h3 className="mt-6 text-gray-900 text-sm font-medium">
              {m.Name}
            </h3>
          </div>
        </li>
      ))}
    </ul>
  );
};

function App() {

  const SignOut = () => {
    // auth.currentUser &&
    return (
      <button onClick={() => {}}>Sign out</button>
    )
  } 

  const signInWithGoogle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    // ...
  }

  // const [user, loading, error] = useAuthState(auth);
  const [members, setMembers] = useState<{ id: string; }[]>([]);

  const fetchMembers = async () => {

  }

  return (
    <div>
      {/* {user ? <h1>USER</h1> : <h1>NO USER</h1>} */}
      <button onClick={signInWithGoogle}>Login</button>
      <SignOut />
      <div>
        {JSON.stringify(members)}
      </div>
      <div>
        <button
          onClick={() => {
            fetch('http://localhost:8000/')
              .then((response) => response.json())
              .then((payload) => {
                console.log(payload)
              });
          }}
        >
          Fetch data
        </button>
      </div>
      <div>
        <QueryClientProvider client={queryClient}>
          <MemberProvider>
            <div className="mx-auto max-w-3xl">
              <SearchBox />
              <MemberCards />
            </div>
          </MemberProvider>
        </QueryClientProvider>
      </div>
    </div>
  )
}

export default App
