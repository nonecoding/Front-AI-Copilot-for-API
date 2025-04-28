import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  path: string[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ path }) => {
  return (
    <div className="flex items-center text-xs text-gray-400 overflow-x-auto">
      {path.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight size={12} className="mx-1" />}
          <span 
            className={`cursor-pointer hover:text-white ${index === path.length - 1 ? 'text-white' : ''}`}
          >
            {item}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;