import React from 'react';
import { Briefcase, Plus, AlertTriangle, RefreshCw } from 'lucide-react';

export const LoadingState = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-4 shadow-sm animate-pulse">
      <div className="w-12 h-12 bg-sky-100 text-sky-500 rounded-full mx-auto flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
        <div className="h-3 bg-gray-100 rounded w-1/3 mx-auto"></div>
      </div>
      <div className="space-y-3 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg w-full"></div>
        ))}
      </div>
    </div>
  );
};

export const EmptyState = ({ onOpenAddModal, hasFilters, onResetFilters }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
      <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 mx-auto mb-4 border border-sky-100">
        <Briefcase className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">
        {hasFilters ? 'No matching job applications' : 'No job applications recorded yet'}
      </h3>
      <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
        {hasFilters
          ? 'Try adjusting your search terms or clearing active filters to see more results.'
          : 'Start tracking your job search applications, interview dates, recruiter contacts, and status updates in one place.'}
      </p>

      {hasFilters ? (
        <button
          onClick={onResetFilters}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          Reset All Filters
        </button>
      ) : (
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center px-5 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 focus:outline-none shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add First Job Application
        </button>
      )}
    </div>
  );
};

export const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-8 text-center space-y-4">
      <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full mx-auto flex items-center justify-center">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-base font-bold text-rose-900">Failed to load job applications</h3>
        <p className="text-sm text-rose-700 mt-1">{message || 'Could not connect to the API server.'}</p>
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 focus:outline-none"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Retry Connection
      </button>
    </div>
  );
};
