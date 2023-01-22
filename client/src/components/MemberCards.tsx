import React from 'react';
import { useMembers } from "../contexts/store";

const MemberCards = () => {
    const { members, showLoading } = useMembers();
    return (
        <div>
            {showLoading ? <h1>LOADING ...</h1> : <></>}
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-3">
                {members.map((m) => (
                    <li key={m.name} className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
                        <div className="flex-1 flex flex-col p-8">
                            <img
                                className="w-32 h-32 flex-shrink-0 mx-auto bg-black rounded-full"
                                src={``}
                                alt={`${m.name}`}
                            />
                            <h3 className="mt-6 text-gray-900 text-sm font-medium">
                                {m.name}
                            </h3>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MemberCards;