import React from 'https://aistudiocdn.com/react@^19.1.1';
import BottomNav from './BottomNav.tsx';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto p-4 pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;