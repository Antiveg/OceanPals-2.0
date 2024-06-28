import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../pages/admin/AdminSidebar'; // Adjust the path according to your project structure

const MainLayout: React.FC = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-auto pl-10 mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%] p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
