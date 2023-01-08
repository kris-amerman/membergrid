import React from 'react';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MembersProvider } from '../contexts/store';

import MemberCards from '../components/MemberCards';
import SearchBox from '../components/SearchBox';

const queryClient = new QueryClient();

export default function MembersPage() {
    return (
        <div>
            <div>
                <QueryClientProvider client={queryClient}>
                    <MembersProvider>
                        <div className="mx-auto max-w-3xl">
                            <SearchBox />
                            <MemberCards />
                        </div>
                    </MembersProvider>
                </QueryClientProvider>
            </div>
        </div>
    );
};
