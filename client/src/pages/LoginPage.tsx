import React from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
    
    const signInWithGoogle = () => {
        window.open('http://localhost:4000/auth/google', '_self')
    }

    return (
        <div>
            <h1>LoginPage</h1>
            <div>
                <button 
                    type="button" 
                    className="text-sm drop-shadow-xl inline-flex items-center gap-3 m-4 py-2 px-4 bg-white rounded-lg w-fit text-left text-gray-500 hover:bg-gray-50"
                    onClick={signInWithGoogle}
                >
                    <FcGoogle size={18} />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};
