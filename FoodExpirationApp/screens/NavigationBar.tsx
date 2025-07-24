import React from "react";
import { Home, Eye, Package, ChefHat, Bell, Users } from "lucide-react";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: any[];
}

const tabs = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'detection', icon: Eye, label: 'Detect' },
  { id: 'storage', icon: Package, label: 'Storage' },
  { id: 'recipes', icon: ChefHat, label: 'Recipes' },
  { id: 'notifications', icon: Bell, label: 'Alerts' },
  { id: 'family', icon: Users, label: 'Family' },
];

const NavigationBar: React.FC<Props> = ({ activeTab, setActiveTab, notifications }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
    <div className="flex justify-around items-center py-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg transform scale-110' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Icon className={`w-5 h-5 mb-1 ${isActive ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-medium">{tab.label}</span>
            {tab.id === 'notifications' && notifications.filter(n => n.priority === 'high').length > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

export default NavigationBar;
