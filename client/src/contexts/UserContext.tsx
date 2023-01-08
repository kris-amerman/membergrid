import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';

const BACKEND_ENDPOINT = 'http://localhost:4000/getuser'

type Props = {
    children: JSX.Element,
}

export const UserContext = createContext({});

export default function UserContextProvider({ children }: Props) {
    const [isReady, setIsReady] = useState(false);
    const [userObject, setUserObject] = useState<any>();

    useEffect(() => {
        console.log('Fetching user...')
        axios.get(BACKEND_ENDPOINT, { withCredentials: true })
            .then(res => {
                if (res.data) {
                    setUserObject(res.data);
                }
                console.log('Ready to render');
                setIsReady(true);
            });
    }, []);

    return (
        <UserContext.Provider value={userObject}>
            {isReady ? children : null}
        </UserContext.Provider>
    )
};
