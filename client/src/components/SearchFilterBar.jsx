import React from 'react';
import { Search, X, Filter, ArrowUpDown, LayoutGrid, List } from 'lucide-react';

export const SearchFilterBar = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  workModeFilter,
  onWorkModeChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderToggle,
  viewMode,
  onViewModeChange,
  onResetFilters,
  totalResults,
}) => {
  const isFiltered = searchQuery || statusFilter !== 'All' || workModeFilter !== 'All';

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 space-y-3">
      {/* Top row: Search input & View options */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by company, job title, location, or notes..."
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* View Mode Toggle & Sort Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onSortOrderToggle}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            title={`Sort Order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
            <span>{sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}</span>
          </button>

          <div className="bg-gray-100 p-1 rounded-lg flex items-center space-x-1">
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'table' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Options Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span className="flex items-center text-gray-500 font-medium">
            <Filter className="w-3.5 h-3.5 mr-1" /> Filters:
          </span>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-800 text-xs sm:text-sm rounded-lg px-2.5 py-1.5 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Work Mode Filter */}
          <select
            value={workModeFilter}
            onChange={(e) => onWorkModeChange(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-800 text-xs sm:text-sm rounded-lg px-2.5 py-1.5 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="All">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="In-office">In-office</option>
          </select>

          {/* Sort By Field */}
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-800 text-xs sm:text-sm rounded-lg px-2.5 py-1.5 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="applicationDate">Sort by Applied Date</option>
            <option value="followUpDate">Sort by Follow-up Date</option>
            <option value="company">Sort by Company</option>
            <option value="status">Sort by Status</option>
          </select>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="text-xs text-sky-600 hover:text-sky-800 font-medium underline px-1"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Showing <span className="font-bold text-gray-800">{totalResults}</span> application(s)
        </div>
      </div>
    </div>
  );
};
