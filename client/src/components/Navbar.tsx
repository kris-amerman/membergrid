import { useContext } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

import logo from '../assets/MembergridTextLogo.svg';
import menuIcon from '../assets/Menu.svg';

import { UserContext } from '../contexts/UserContext';

const Navbar = () => {

    const signInWithGoogle = () => {
        window.open('http://localhost:4000/auth/google', '_self')
    }

    // On logout, should refresh the page or send back to sign in page 
    const logout = () => {
        axios.get('http://localhost:4000/logout', { withCredentials: true })
            .then(res => {
                console.log(res)
                if (res.data) {
                    window.location.href = '/';
                }
            });
    };

    const user: any = useContext(UserContext);

    return (
        <div className='flex h-[86px]'>
            <div className='flex flex-row w-full my-auto 
            md:mx-32'>
                <Link to='/' className="md:w-full md:h-full">
                    <img className='-translate-x-4 scale-[70%] md:transform-none' src={logo} />
                </Link>
                <img className='translate-x-8 scale-110 md:hidden md:transform-none' src={menuIcon} />

                <div className='hidden flex-row gap-8 w-full justify-end
                font-inter font-medium text-[#5D5A88]   
                md:flex'>
                    {user ? <Link to='/members' className='my-auto hover:text-[#9795B5]'>Members</Link> : <></>}
                    <Link to='/about' className='my-auto hover:text-[#9795B5]'>About</Link>
                    <Link to='/contact' className='my-auto hover:text-[#9795B5]'>Contact</Link>
                    <button onClick={user ? logout : signInWithGoogle} className='h-8 rounded-3xl px-5 my-auto -ml-3 
                    border-[1.5px] border-[#D4D2E3] 
                    hover:bg-[#F9F9FF] hover:text-[#9795B5]'>
                        {user ? <>Logout</> : <>Login</>}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Navbar