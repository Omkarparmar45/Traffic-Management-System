import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, TrafficCone, MapPin } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Vehicles', path: '/vehicles', icon: <Car size={20} /> },
    { name: 'Signals', path: '/signals', icon: <TrafficCone size={20} /> },
    { name: 'Roads', path: '/roads', icon: <MapPin size={20} /> },
  ];

  return (
    <div className="w-64 bg-[#0a0f18] h-screen border-r border-gray-800 flex flex-col justify-between text-gray-400 font-sans">
      <div>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 rounded-lg p-2 text-white">
            <TrafficCone size={24} />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl leading-tight">TrafficOS</h1>
            <p className="text-xs text-gray-500">Management Suite</p>
          </div>
        </div>

        <div className="px-4 mt-4">
          <p className="text-xs uppercase tracking-wider text-gray-600 font-semibold mb-4 px-2">Navigation</p>
          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-blue-600 text-white font-medium'
                    : 'hover:bg-gray-800 hover:text-gray-200'
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-[#111827] rounded-xl p-4 mb-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-green-500 font-medium text-sm">System Online</span>
          </div>
          <p className="text-xs text-green-500/70">All systems operational</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
