import { FcGoogle } from 'react-icons/fc';

const SignInGoogle = () => {

    const signInWithGoogle = () => {
        window.open('http://localhost:4000/auth/google', '_self')
    }

    return (
        <div>
            <button
                type="button"
                className="text-sm border-[0.5px] drop-shadow-sm inline-flex items-center gap-3 
                py-2.5 px-4 bg-white rounded-3xl w-fit text-left text-gray-500 
                hover:bg-gray-50 hover:scale-105 duration-300"
                onClick={signInWithGoogle}
            >
                <FcGoogle size={22} />
                Sign in with Google
            </button>
        </div>
    )
}

export default SignInGoogle