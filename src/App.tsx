import { useState } from 'react';
import { MemberProvider } from './store';
import { Member, ViewMode } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MembersList from './components/MembersList';
import MemberForm from './components/MemberForm';
import Configuration from './components/Configuration';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'list':
        return 'Members Management';
      case 'add':
        return 'Add New Member';
      case 'edit':
        return 'Edit Member';
      case 'config':
        return 'Configuration';
      default:
        return 'Dashboard';
    }
  };

  const handleSetCurrentView = (view: ViewMode) => {
    setCurrentView(view);
    setSidebarOpen(false);
    if (view === 'add') {
      setEditingMember(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={handleSetCurrentView}
        sidebarOpen={sidebarOpen}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          title={getTitle()}
        />

        <main className="p-4 lg:p-6">
          {currentView === 'dashboard' && (
            <Dashboard setCurrentView={handleSetCurrentView} />
          )}
          {currentView === 'list' && (
            <MembersList
              setCurrentView={handleSetCurrentView}
              setEditingMember={setEditingMember}
            />
          )}
          {(currentView === 'add' || currentView === 'edit') && (
            <MemberForm
              mode={currentView}
              editingMember={editingMember}
              setCurrentView={handleSetCurrentView}
              setEditingMember={setEditingMember}
            />
          )}
          {currentView === 'config' && <Configuration />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <MemberProvider>
      <AppContent />
    </MemberProvider>
  );
}
