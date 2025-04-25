import React from "react";
import Sidebar from "../common/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row min-h-screen py-16">
          {/* Left Sidebar */}
          <div className="w-64 flex-shrink-0 mr-6">
            <Sidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1">
            <div className="rounded-lg bg-white min-h-[calc(100vh-theme(spacing.32))]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
