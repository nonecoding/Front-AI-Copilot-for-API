import React from 'react';
import { 
  Database, 
  Cloud, 
  FileCode, 
  Clock, 
  ArrowUp, 
  Info, 
  Server, 
  Star, 
  DollarSign 
} from 'lucide-react';

const DeploymentDashboard = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="mb-4">
          <Server size={48} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-1">Deploy to production</h1>
        <p className="text-gray-400 mb-4 max-w-lg">
          Publish a live, stable, public version of your App, unaffected by the changes you make in the workspace.
          <a href="#" className="text-blue-400 ml-1 hover:underline">Learn more</a>
        </p>
        
        <div className="flex items-center bg-[#1C2333] px-3 py-1.5 rounded-full text-xs mb-4">
          <Info size={14} className="mr-1.5 text-gray-400" />
          <span>Choosing the right deployment type</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DeploymentCard 
          title="Reserved VM" 
          description="Always On Servers"
          icon={<Database size={24} className="text-blue-400" />}
          isRecommended={true}
          bgColor="bg-gradient-to-br from-blue-900/50 to-blue-800/30"
        />
        
        <DeploymentCard 
          title="Autoscale" 
          description="Most dynamic elasticity"
          icon={<Cloud size={24} className="text-gray-400" />}
          bgColor="bg-[#1C2333]"
        />
        
        <DeploymentCard 
          title="Static pages" 
          description="Simple HTML websites"
          icon={<FileCode size={24} className="text-gray-400" />}
          bgColor="bg-[#1C2333]"
        />
        
        <DeploymentCard 
          title="Scheduled" 
          description="Time-based job scheduler"
          icon={<Clock size={24} className="text-gray-400" />}
          bgColor="bg-[#1C2333]"
        />
      </div>
      
      <div className="text-center mb-8">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center mx-auto">
          <ArrowUp size={16} className="mr-2" />
          Upgrade your plan to deploy
        </button>
      </div>
      
      <div className="bg-[#1C2333] rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Reserved VMs are for long-running jobs and apps</h2>
        
        <div className="space-y-4">
          <InfoRow 
            icon={<Server size={20} className="text-blue-400" />}
            text="Reserved VMs ensure high uptime, minimizing disruptions for apps requiring persistent session data."
          />
          
          <InfoRow 
            icon={<DollarSign size={20} className="text-blue-400" />}
            text="Reserved VMs are billed hourly starting at $0.03/hour."
          />
          
          <InfoRow 
            icon={<Star size={20} className="text-blue-400" />}
            text="Suitable for bots, stateful APIs, webscraping, and long-running jobs."
          />
        </div>
      </div>
    </div>
  );
};

interface DeploymentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isRecommended?: boolean;
  bgColor: string;
}

const DeploymentCard: React.FC<DeploymentCardProps> = ({ 
  title, 
  description, 
  icon, 
  isRecommended = false,
  bgColor
}) => {
  return (
    <div className={`${bgColor} rounded-lg p-6 flex flex-col items-center text-center transition-transform duration-200 hover:scale-105 cursor-pointer relative border border-[#2B3245] hover:border-blue-500`}>
      {isRecommended && (
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-sm">
            Recommended
          </span>
        </div>
      )}
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
};

interface InfoRowProps {
  icon: React.ReactNode;
  text: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, text }) => {
  return (
    <div className="flex items-start">
      <div className="mr-4 mt-1">
        {icon}
      </div>
      <p className="text-sm text-gray-300">{text}</p>
    </div>
  );
};

export default DeploymentDashboard;