import React, { useState } from 'react';
import { 
  Folder, 
  File, 
  ChevronDown, 
  ChevronRight, 
  FileCode,
  Settings,
  Package,
  Server,
  ChevronLeft,
  Search
} from 'lucide-react';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  expanded?: boolean;
  icon?: React.ReactNode;
}

interface SidebarProps {
  toggleSidebar: () => void;
}

const initialFiles: FileItem[] = [
  {
    name: 'src',
    type: 'folder',
    expanded: true,
    children: [
      {
        name: 'main',
        type: 'folder',
        expanded: true,
        children: [
          {
            name: 'java',
            type: 'folder',
            expanded: true,
            children: [
              {
                name: 'com',
                type: 'folder',
                expanded: true,
                children: [
                  {
                    name: 'util',
                    type: 'folder',
                    expanded: true,
                    children: [
                      {
                        name: 'rest',
                        type: 'folder',
                        expanded: true,
                        children: [
                          { name: 'config', type: 'folder', children: [
                            { name: 'RestTemplateConfig.java', type: 'file', icon: <FileCode size={16} className="text-blue-400" /> },
                            { name: 'SecurityConfig.java', type: 'file', icon: <FileCode size={16} className="text-blue-400" /> },
                            { name: 'WebConfig.java', type: 'file', icon: <FileCode size={16} className="text-blue-400" /> }
                          ] },
                          { name: 'controller', type: 'folder', children: [
                            { name: 'HealthCheckController.java', type: 'file', icon: <FileCode size={16} className="text-blue-400" /> }
                          ] },
                          { name: 'exception', type: 'folder', children: [
                            { name: 'RestClientException.java', type: 'file', icon: <FileCode size={16} className="text-blue-400" /> }
                          ] },
                          { name: 'interceptor', type: 'folder', children: [
                            { name: 'TokenAuthInterceptor.java', type: 'file', icon: <FileCode size={16} className="text-blue-400" /> }
                          ] },
                          { name: 'model', type: 'folder', children: [
                            { name: 'ResponseModel.java', type: 'file', icon: <FileCode size={16} className="text-blue-400" /> }
                          ] },
                          { name: 'properties', type: 'folder', children: [
                            { name: 'RestClientProperties.java', type: 'file', icon: <FileCode size={16} className="text-blue-400" /> }
                          ] },
                          { name: 'Application.java', type: 'file', icon: <FileCode size={16} className="text-blue-400" /> },
                          { name: 'RestTemplateHelper.java', type: 'file', icon: <FileCode size={16} className="text-blue-400" /> }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'resources',
    type: 'folder',
    children: [
      { name: 'application.properties', type: 'file', icon: <Settings size={16} className="text-gray-400" /> }
    ]
  },
  { name: 'generated-icon.png', type: 'file', icon: <File size={16} className="text-yellow-400" /> },
  {
    name: 'Package files',
    type: 'folder',
    children: [
      { name: 'target', type: 'folder' },
      { name: 'pom.xml', type: 'file', icon: <Package size={16} className="text-orange-400" /> }
    ]
  },
  {
    name: 'Config files',
    type: 'folder',
    children: [
      { name: '.replit', type: 'file', icon: <Server size={16} className="text-purple-400" /> },
      { name: 'replit.nix', type: 'file', icon: <Server size={16} className="text-purple-400" /> }
    ]
  }
];

const FileExplorer: React.FC<{ files: FileItem[], level?: number }> = ({ files, level = 0 }) => {
  const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>({});

  const toggleExpand = (name: string) => {
    setExpandedFiles(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <div className="pl-2">
      {files.map((file, index) => {
        const isExpanded = expandedFiles[file.name] || file.expanded;
        
        return (
          <div key={`${file.name}-${index}`}>
            <div 
              className={`flex items-center py-1 px-1 hover:bg-[#1C2333] rounded cursor-pointer ${level === 0 ? 'mt-1' : ''}`}
              onClick={() => file.type === 'folder' && toggleExpand(file.name)}
            >
              {file.type === 'folder' ? (
                <span className="mr-1">
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
              ) : (
                <span className="ml-3 mr-1"></span>
              )}
              
              <span className="mr-1">
                {file.icon || (file.type === 'folder' ? <Folder size={16} className="text-blue-300" /> : <File size={16} className="text-gray-300" />)}
              </span>
              
              <span className="text-sm truncate" style={{ paddingLeft: file.type === 'file' ? '0' : '0' }}>
                {file.name}
              </span>
            </div>
            
            {file.type === 'folder' && isExpanded && file.children && (
              <FileExplorer files={file.children} level={level + 1} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
  return (
    <div className="w-64 h-full bg-[#0E1525] border-r border-[#2B3245] overflow-y-auto">
      <div className="p-2 border-b border-[#2B3245]">
        <div className="flex items-center justify-between">
          <span className="font-medium">RestTemplateHelper</span>
          <button 
            className="p-1 rounded hover:bg-[#2B3245]"
            onClick={toggleSidebar}
          >
            <ChevronLeft size={16} />
          </button>
        </div>
        
        <div className="mt-4 flex space-x-2">
          <button className="px-2 py-1 text-xs bg-[#1C2333] rounded hover:bg-[#2B3245]">
            Files
          </button>
          <button className="px-2 py-1 text-xs text-gray-400 rounded hover:bg-[#1C2333]">
            Agent
          </button>
        </div>
      </div>
      
      <div className="px-2 py-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#1C2333] text-sm text-gray-200 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search size={14} className="absolute right-2 top-1.5 text-gray-400" />
        </div>
      </div>
      
      <FileExplorer files={initialFiles} />
    </div>
  );
};

export default Sidebar;