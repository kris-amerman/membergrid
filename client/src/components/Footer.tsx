import React from 'react';
import logo from '../assets/LogoNoText.svg'
import insta from '../assets/Insta.svg'
import linkedin from '../assets/LinkedIn.svg'

const Footer = () => {
  return (
    <div className='bg-[#F9F9FF]'>
          <div className='flex flex-row mx-28 h-64'>
            <div className='w-2/5  flex flex-col my-auto gap-5'>
                  <div className='font-dmsans font-medium text-xl text-[#5D5A88]'>About Membergrid</div>
                  <div className='font-inter text-[#B2B2BF] w-10/12'>
                    Membergrid abstracts the organization lookup process to 
                    provide a seamless networking experience.
                </div>
            </div>
            <img className='scale-[35%]' src={logo} />
            <div className='w-2/5 flex flex-col my-auto gap-5 '>
                <div className='font-dmsans font-medium text-xl text-[#5D5A88] text-end '>
                    Follow me on social media!
                </div>
                <div className='flex flex-row gap-8 justify-end'>
                    <a href="https://www.instagram.com/krisamerman/"
                    target="_blank" rel="noopener noreferrer"><img src={insta} /></a>
                    <a target="_blank" rel="noopener noreferrer"
                    href="https://www.linkedin.com/in/kris-amerman/"><img src={linkedin} /></a>
                </div>
                <div className='font-inter text-[#B2B2BF] text-end'>
                    Copyright © 2023 Kristoffer Amerman | All Rights Reserved 
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer