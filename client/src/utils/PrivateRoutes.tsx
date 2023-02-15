import { useContext, useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';

const PrivateRoutes = ( props: any ) => {
    // TODO add JWT and CSRF
    const user: any = useContext(UserContext);
    console.log(user)

    return (
        user ? <Outlet /> : <Navigate to="/" />
    );
};

export default PrivateRoutes;