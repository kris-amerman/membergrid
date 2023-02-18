import React, { useState } from 'react';
import "./Gradient.css"; 
import Chevron from '../assets/Chevron.svg';

const FAQDropDown = (props: {
    title: string
    info: string
}) => {

    const { title, info } = props;

    const [open, setOpen] = useState(false);
    const closedStyle = `flex flex-row bg-white mx-auto p-10 
    border-[1.5px] border-[#5D5A88] w-full rounded-xl`
    const openStyle = `flex flex-row bg-white mx-auto p-10 pb-4 
    border-[1.5px] border-[#5D5A88] w-full rounded-t-xl border-b-0`

    return (
        <div>
            <div className='flex flex-col'>
                <div className={open ? openStyle : closedStyle}>
                    <div className='w-full text-[#5D5A88] font-[500] text-2xl font-dmsans'>{title}</div>
                    <img
                        onClick={() => {setOpen(!open)}} 
                        className={open ? 'p-2 hover:cursor-pointer' : 'p-2 hover:cursor-pointer -rotate-90'} 
                        src={Chevron} />
                </div>
                { open ? 
                    <div className='bg-white rounded-b-xl mx-auto p-10 pt-0 
                    border-[1.5px] border-[#5D5A88] border-t-0 w-full'>
                        <div className='w-9/12 font-inter text-[15px] text-[#9795B5] font-[300]'>{info}</div>
                    </div> 
                    : <></> 
                }
            </div>
        </div>
    )
}

const FAQSection = () => {
  return (
    <div>
        <div className='gradient flex flex-col'>
            <div className='text-center text-[#5D5A88] font-[600] text-4xl font-dmsans
            tracking-[.02em] mt-32 mb-24'>
                FAQs about Membergrid
            </div>
            <div className='flex flex-col gap-6 mx-72 mb-52'>
                <FAQDropDown 
                    title="What is Membergrid?" 
                    info="Membergrid brings an accessible user interface to your 
                    organization's member database. Instead of crawling through 
                    an overwhelming spreadsheet, Membergrid makes it easy to search 
                    and visualize your team's data. " />
                <FAQDropDown 
                    title="Who is Membergrid for?" 
                    info="Anyone with a small-to-medium-sized organization! 
                    If you're tired of fiddling with messy spreadsheets or 
                    you're looking to start a new organization, Membergrid is 
                    the perfect choice :)" />
                <FAQDropDown 
                    title="Why is Membergrid only serving TAMID @ Northeastern?" 
                    info="This is a proof-of-concept! As we continue to add new 
                    features, Membergrid is acting as an extension of TAMID @ 
                    Northeastern's internal networking platform. " />
                <FAQDropDown
                    title="What's the future of Membergrid? "
                    info="Based on the success of our POC, we're looking to add 
                    user profiles and a single point of control for member database 
                    management. There are a lot of ideas in the air, so stay tuned!" />
            </div>
        </div>
    </div>
  )
}

export default FAQSection