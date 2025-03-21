import { assets } from "@/assets/assets";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import SideBar from "./SideBar";


const AdminLayout = () => {
    const [visible, setVisible] = useState(false);

  return (
    <div>
        <div className="w-full bg-blue-950 h-auto">
            <header>
                <h1 className="text-center text-white text-5xl p-4">ProShots Photography Studio</h1>
                <SideBar />
                <div className="absolute top-1 right-4"><img src={assets.logout} alt="" className="h-[70px]" /></div>
            </header>
        </div>
        
        <div>
            <main>
                <Outlet />
            </main>
        </div>
        <div className="w-full bg-black h-24">
            <footer>
                <h1 className="text-center text-white text-4xl">Proshots</h1>
            </footer>
        </div>

    </div>
  )
}

export default AdminLayout;