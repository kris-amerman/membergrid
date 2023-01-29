import React from 'react';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MembersProvider } from '../contexts/store';
import logo from '../assets/LogoBlackVerticalx2.png';

import MemberCards from '../components/MemberCards';
import SearchBox from '../components/SearchBox';

const queryClient = new QueryClient();

export default function MembersPage() {
    return (
        <div>
            <div>
                <QueryClientProvider client={queryClient}>
                    <MembersProvider>
                        <div>
                            <img src={logo} className='h-20 w-32' />
                        </div>
                        <div className="mx-auto max-w-6xl">
                            <SearchBox />
                            <MemberCards />
                        </div>
                    </MembersProvider>
                </QueryClientProvider>
            </div>
        </div>
    );
};
