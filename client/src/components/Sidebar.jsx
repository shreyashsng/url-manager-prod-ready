import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {Home, LayoutDashboard} from 'lucide-react'

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    {path: "/", label: "Home", icon: <Home size={16}/>},
    {path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16}/>},
  ]

  return(
    <aside className='w-64 text-gray-600 min-h-screen flex flex-col w-64'>
        <div className='p-6 tracking-wide text-2xl border-b color-black'>
            URL Manager
        </div>

        <nav className='flex-1 p-4'>
            <ul className='space-y-2'>
                {navItems.map((item) => (
                    <li key={item.path}>
                        <Link to={item.path} className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${location.pathname === item.path ? "bg-gray-700 text-white" : "hover:bg-gray-700 text-gray-300"}`}>
                            {item.icon}
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>

        <div className='p-4 border-t border-gray-800'>
            <button onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }} className='flex items-center gap-3 w-full px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 transiton-colors'>Logout</button>
        </div>
    </aside>
  )
}

export default Sidebar