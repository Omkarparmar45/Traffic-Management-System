import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

const Topbar = () => {
  return (
    <div className="bg-[#0a0f18] border-b border-gray-800 h-16 flex items-center justify-between px-6">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input type="text" placeholder="Search vehicles, signals, roads..." className="w-full bg-[#111827] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
      </div>
      {/* <div className="flex items-center gap-4 text-gray-400">
        <button className="hover:text-white transition-colors"><Settings size={20} /></button>
        <button className="relative hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">2</span>
        </button>
      </div> */}
    </div>
  );
};

export default Topbar;

