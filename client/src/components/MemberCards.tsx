import React from 'react';
import { useMembers } from "../contexts/store";
import CardBadge from './CardBadge';
import LoadingSpinner from './LoadingSpinner';

const MemberCards = () => {
    const { members, showLoading } = useMembers();
    return (
        <div className='my-6 overflow-y-scroll h-[75vh] overflow-x-hidden py-3'>
            {showLoading ? <LoadingSpinner /> : <></>}
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {members.map((m) => (
                    <li key={m.name} 
                        className={`mx-auto w-full max-w-[20rem] min-w-[15rem] col-span-1 flex flex-col text-center bg-white 
                            rounded-lg shadow divide-y divide-gray-200
                            hover:shadow-lg`
                        }
                    >
                        <div className="hover:cursor-pointer flex-1 flex flex-col p-8">
                            <img
                                className="w-40 h-40 object-cover flex-shrink-0 mx-auto bg-black rounded-full"
                                src={m.picture}
                                alt={`${m.name}`}
                            />
                            <h3 className="truncate mt-6 text-gray-900 text-sm font-medium">
                                {m.name}
                            </h3>
                            <p className="text-gray-500 text-xs">
                                {/* TODO !! have role in future? no everyone in track */}
                                {m.trackInvolvement ? m.trackInvolvement : 'n/a'} 
                            </p>
                            <span className='mt-3'>
                                {isFreeToChat(m.tamidChatsStatus) ? 
                                <CardBadge color='green'>Free to chat!</CardBadge> : 
                                <CardBadge color='red'>No chats</CardBadge>}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

function isFreeToChat(status: string): boolean {
    return status === "Yes I'm free to chat this semester"; 
}

export default MemberCards;