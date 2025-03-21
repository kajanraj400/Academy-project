import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { assets } from "@/assets/assets";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleEvent, setVisibleEvent] = useState(false);
  
  useEffect(() => {
    if (!isOpen) {
      setVisibleEvent(false);
    }
  }, [isOpen]);
  
  return (
    <div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger 
                className="cursor-pointer absolute top-4 left-3"
                onClick={() => setIsOpen(true)}
            >
                <img src={assets.admin_menu_icon} alt="" className="h-[45px]"/>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
                <SheetHeader>
                <div className="flex items-center mb-7">
                    <img src={assets.adminImg} alt="logo" className="w-16 h-auto" />
                    <span className="text-2xl font-bold">ProShots</span>
                </div>
                    <SheetTitle className="text-xl"></SheetTitle>
                </SheetHeader>
                
                    <div className="flex items-center gap-2 hover:bg-gray-100 py-1 hover:cursor-pointer" onClick={() => setVisibleEvent(!visibleEvent)}>
                        <span className="text-2xl mr-6">Photography</span>
                        <img src={assets.adminDropdown} alt="" className={`w-6 h-auto transition-transform duration-300 ${visibleEvent ? "rotate-90" : ""}`}/>
                    </div>
                    
                    { visibleEvent ? 
                        <nav className="mt-2 flex flex-col gap-3">
                            <Link to="/admin/dashboard" className="text-xl text-black px-4 py-1 hover:bg-gray-200 hover:underline rounded-md" onClick={() => setIsOpen(false)}>
                                <span className="text-2xl font-extrabold">↳ </span> Dash Board
                            </Link>
                            <Link to="/admin/upcomingEvents" className="text-xl text-black px-4 py-1 hover:bg-gray-200 rounded-md hover:underline" onClick={() => setIsOpen(false)}>
                                <span className="text-2xl font-extrabold">↳ </span> Upcoming Events
                            </Link>
                            <Link to="/admin/oldEvents" className="text-xl text-black px-4 py-1 hover:bg-gray-200 rounded-md hover:underline" onClick={() => setIsOpen(false)}>
                                <span className="text-2xl font-extrabold">↳ </span> Blog
                            </Link>
                            <Link to="/admin/oldEventUpload" className="text-xl text-black px-4 py-1 hover:bg-gray-200 rounded-md hover:underline" onClick={() => setIsOpen(false)}>
                                <span className="text-2xl font-extrabold">↳ </span> Past Event Upload
                            </Link>
                        </nav> : null 
                    }
            </SheetContent>
        </Sheet>
    </div>
  );
};

export default SideBar;
