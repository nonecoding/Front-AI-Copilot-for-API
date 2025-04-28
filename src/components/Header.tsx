import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Star, 
  Share2, 
  Download, 
  Layout, 
  Search, 
  User, 
  Bell, 
  Settings
} from 'lucide-react';

const Header = () => {
  return (
    <header className="flex items-center justify-between h-12 px-4 bg-[#1C2333] border-b border-[#2B3245]">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <button className="p-1 rounded hover:bg-[#2B3245]">
            <ChevronLeft size={16} />
          </button>
          <button className="p-1 rounded hover:bg-[#2B3245]">
            <ChevronRight size={16} />
          </button>
          <button className="p-1 rounded hover:bg-[#2B3245]">
            <RefreshCw size={16} />
          </button>
        </div>
        
        <div className="flex items-center text-sm text-gray-400 max-w-lg overflow-hidden">
          <span className="truncate">replit.com/filebrowser/RestTemplateHelper/src/main/java/com/util/rest/Application.java</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="p-1 rounded hover:bg-[#2B3245]">
          <Search size={16} />
        </button>
        <button className="p-1 rounded hover:bg-[#2B3245]">
          <Star size={16} />
        </button>
        <button className="p-1 rounded hover:bg-[#2B3245]">
          <Share2 size={16} />
        </button>
        <button className="p-1 rounded hover:bg-[#2B3245]">
          <Download size={16} />
        </button>
        <button className="p-1 rounded hover:bg-[#2B3245]">
          <Layout size={16} />
        </button>
        <button className="p-1 rounded hover:bg-[#2B3245]">
          <User size={16} />
        </button>
        <button className="p-1 rounded hover:bg-[#2B3245]">
          <Bell size={16} />
        </button>
        <button className="p-1 rounded hover:bg-[#2B3245]">
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
};

export default Header;