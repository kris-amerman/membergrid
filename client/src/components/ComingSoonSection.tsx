import React from 'react';
import FirstPic from '../assets/IPhone.svg';
import SecondPic from '../assets/MessageAndUsers.svg';
import ThirdPic from '../assets/GoogleSheets.svg';


const ComingSoonItem = (props: {
    title: string
    description: string
    imageURL: string
}) => {

    const { title, description, imageURL } = props;

    return (
        <div>
            <div className='flex flex-row justify-center'>
                <div className='flex justify-center my-auto w-1/2 h-full'>
                    <div className='flex flex-col '>
                        <div className='text-center font-dmsans text-[#8D8BA7] 
                        font-[500] text-[20px] tracking-[.1em]'>
                            COMING SOON
                        </div>
                        <div className='flex mx-auto text-center w-9/12 font-dmsans 
                        font-[600] text-[35px] leading-[2.75rem] text-[#5D5A88] mt-6
                        tracking-[.02em]'>
                            {title}
                        </div>
                        <div className='flex mx-auto text-center w-4/6 text-[#9795B5]
                        mt-8 font-light text-lg tracking-[.03em]'>
                            {description}
                        </div>
                    </div>
                </div>
                <div className='flex justify-center my-auto w-1/2 h-full'>
                    <img className='' src={imageURL} />
                </div>
            </div>
        </div>
    )
}

const ComingSoonSection = () => {
    return (
        <div>
            <div className='flex flex-col mx-20 gap-44 mt-20 mb-20'>
                <ComingSoonItem
                    title="Schedule coffee chats with the mobile app"
                    description="Our long-term goal is to make it easier to 
                    connect with peers IRL in an increasingly digital world."
                    imageURL={FirstPic}
                />
                <ComingSoonItem
                    title="User profiles, messaging, and recruitment"
                    description="We're working to offer a single point of control 
                    for all things member-related."
                    imageURL={SecondPic}
                />
                <ComingSoonItem
                    title="Google sheets integration and much more!"
                    description="Membergrid is working to be extensible to other 
                    organizations and a variety of data formats. "
                    imageURL={ThirdPic}
                />
            </div>
        </div>
    )
}

export default ComingSoonSection