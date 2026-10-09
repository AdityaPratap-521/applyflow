import React from 'react';
import { Briefcase, Plus, Download, RefreshCw } from 'lucide-react';

export const Navbar = ({ onOpenAddModal, onExportCSV, onRefresh, isExportDisabled, isRefreshing }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">ApplyFlow</h1>
                <span className="bg-sky-100 text-sky-800 text-xs font-semibold px-2 py-0.5 rounded">v1.0</span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">Job Application Tracker & Pipeline Dashboard</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh applications list"
              className="p-2 text-gray-600 hover:text-sky-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-sky-600' : ''}`} />
            </button>

            <button
              onClick={onExportCSV}
              disabled={isExportDisabled}
              className="hidden sm:inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4 mr-2 text-gray-500" />
              Export CSV
            </button>

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Add Application</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
