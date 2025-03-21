import { assets } from "@/assets/assets";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";


const ClientHeader = () => {
    const [visible, setVisible] = useState(false);

  return (
        <div className="flex items-center justify-around py-5 font-medium bg-transparent h-14 sm:h-28">
            <Link to='/client/home'><img src={assets.logo} alt="Logo" className="w-36" /></Link>
                    
            <ul className="hidden sm:flex gap-5 text-5m text-white">
                <NavLink to='/client/home' className="flex flex-col items-center gap-1">
                    <p className="text-base">HOME</p>
                    <hr className="w-2/4 border-none bg-gray-700 h-[1.5px] hidden" />
                </NavLink>
                <NavLink to='/client/blog' className="flex flex-col items-center gap-1">
                    <p className="text-base">BLOGS</p>
                    <hr className="w-2/4 border-none bg-gray-700 h-[1.5px] hidden" />
                </NavLink>
                <NavLink to='/client/gifts' className="flex flex-col items-center gap-1">
                    <p className="text-base">GIFTS</p>
                    <hr className="w-2/4 border-none bg-gray-700 h-[1.5px] hidden" />
                </NavLink>
                <NavLink to='/client/contact' className="flex flex-col items-center gap-1">
                    <p className="text-base">CONTACT</p>
                    <hr className="w-2/4 border-none bg-gray-700 h-[1.5px] hidden" />
                </NavLink>
                <NavLink to='/client/about' className="flex flex-col items-center gap-1">
                    <p className="text-base">ABOUT</p>
                    <hr className="w-2/4 border-none bg-gray-700 h-[1.5px] hidden" />
                </NavLink>
            </ul>

            {/* code for right side icon */}
            <div className='flex items-center gap-6'>
                <div className='group relative'>
                    <img src={assets.profile_icon} className='w-14 cursor-pointer' alt="" />
                    <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                        <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                            <p className='cursor-pointer hover:text-black'>Profile</p>
                            <p className='cursor-pointer hover:text-black'>Orders</p>
                            <p className='cursor-pointer hover:text-black'>Logout</p>
                        </div>
                    </div>
                </div>
            </div>

            <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />        {/* only visible to phone*/ }    


            {/* sidebar menu for small screens */}
            <div className={`absolute top-0 right-0 bottom-0 bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col overflow-hidden text-white'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer bg-gray-400'>
                        <img src={assets.dropdown_icon} className='h-4 rotate-180' alt="dropdown" />
                        <p>Back</p>
                    </div>

                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border bg-gray-400' to='/client/home'>HOME</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border bg-gray-400' to='/client/blog'>BLOG</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border bg-gray-400' to='/client/gifts'>GIFTS</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border bg-gray-400' to='/client/contact'>CONTACT</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border bg-gray-400' to='/client/about'>ABOUT</NavLink>
                </div>
            </div>
        </div>
  )
}

export default ClientHeader