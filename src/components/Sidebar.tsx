import { 
  Users, 
  UserPlus, 
  LayoutDashboard, 
  ClipboardList, 
  Settings,
  Milk
} from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  sidebarOpen: boolean;
}

export default function Sidebar({ currentView, setCurrentView, sidebarOpen }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'list' as const, label: 'Members', icon: Users },
    { id: 'add' as const, label: 'Add New Member', icon: UserPlus },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-blue-700">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <Milk className="w-6 h-6 text-blue-800" />
        </div>
        <div>
          <h1 className="text-lg font-bold">AAVIN</h1>
          <p className="text-xs text-blue-200">Producer Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <p className="px-3 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3">
          Members Management
        </p>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setCurrentView(item.id === 'dashboard' ? 'list' : item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-white/15 text-white shadow-lg'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-8 px-3">
          <p className="px-3 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3">
            Settings
          </p>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white transition-all duration-200">
            <Settings className="w-5 h-5" />
            Configuration
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-blue-700">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-blue-300" />
          <span className="text-xs text-blue-300">KYC Information System</span>
        </div>
        <p className="text-xs text-blue-400 mt-1">v1.0.0</p>
      </div>
    </aside>
  );
}
