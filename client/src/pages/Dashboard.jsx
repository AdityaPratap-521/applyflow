import React, { useState } from 'react';
import { Navbar } from '../components/Navbar.jsx';
import { StatsOverview } from '../components/StatsOverview.jsx';
import { SearchFilterBar } from '../components/SearchFilterBar.jsx';
import { ApplicationTable } from '../components/ApplicationTable.jsx';
import { ApplicationCard } from '../components/ApplicationCard.jsx';
import { ApplicationFormModal } from '../components/ApplicationFormModal.jsx';
import { ApplicationDetailModal } from '../components/ApplicationDetailModal.jsx';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal.jsx';
import { Toast } from '../components/Toast.jsx';
import { LoadingState, EmptyState, ErrorState } from '../components/StateViews.jsx';
import { useApplications } from '../hooks/useApplications.js';
import { exportApplicationsToCSV } from '../utils/csvExport.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Dashboard = () => {
  const {
    applications,
    stats,
    loading,
    refreshing,
    error,
    searchQuery,
    statusFilter,
    workModeFilter,
    sortBy,
    sortOrder,
    page,
    pagination,
    viewMode,
    toast,
    setPage,
    setViewMode,
    handleSearchChange,
    handleStatusChange,
    handleWorkModeChange,
    handleSortByChange,
    handleSortOrderToggle,
    resetFilters,
    fetchData,
    addApplication,
    editApplication,
    quickUpdateStatus,
    removeApplication,
    clearToast,
    showToast,
  } = useApplications();

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailApplication, setDetailApplication] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetApplication, setDeleteTargetApplication] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal Action Handlers
  const handleOpenAddModal = () => {
    setSelectedApplication(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (app) => {
    setSelectedApplication(app);
    setIsAddEditModalOpen(true);
  };

  const handleOpenDetailModal = (app) => {
    setDetailApplication(app);
    setIsDetailModalOpen(true);
  };

  const handleOpenDeleteModal = (app) => {
    setDeleteTargetApplication(app);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    let success = false;
    if (selectedApplication) {
      success = await editApplication(selectedApplication._id, formData);
    } else {
      success = await addApplication(formData);
    }
    setIsSubmitting(false);
    if (success) {
      setIsAddEditModalOpen(false);
      setSelectedApplication(null);
    }
  };

  const handleDeleteConfirm = async (id) => {
    setIsSubmitting(true);
    const success = await removeApplication(id);
    setIsSubmitting(false);
    if (success) {
      setIsDeleteModalOpen(false);
      setDeleteTargetApplication(null);
    }
  };

  const handleExportCSV = () => {
    if (applications.length === 0) {
      showToast('No applications available to export', 'error');
      return;
    }
    const success = exportApplicationsToCSV(applications);
    if (success) {
      showToast(`Exported ${applications.length} applications to CSV!`, 'success');
    } else {
      showToast('Export failed', 'error');
    }
  };

  const hasFilters = searchQuery || statusFilter !== 'All' || workModeFilter !== 'All';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        onOpenAddModal={handleOpenAddModal}
        onExportCSV={handleExportCSV}
        onRefresh={() => fetchData(true)}
        isExportDisabled={applications.length === 0}
        isRefreshing={refreshing}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metric Cards Summary */}
        <StatsOverview
          stats={stats}
          activeStatusFilter={statusFilter}
          onSelectStatusFilter={handleStatusChange}
        />

        {/* Search, Filter & View Controls */}
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          workModeFilter={workModeFilter}
          onWorkModeChange={handleWorkModeChange}
          sortBy={sortBy}
          onSortByChange={handleSortByChange}
          sortOrder={sortOrder}
          onSortOrderToggle={handleSortOrderToggle}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onResetFilters={resetFilters}
          totalResults={pagination.total}
        />

        {/* Application List Content Area */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchData()} />
        ) : applications.length === 0 ? (
          <EmptyState
            onOpenAddModal={handleOpenAddModal}
            hasFilters={hasFilters}
            onResetFilters={resetFilters}
          />
        ) : (
          <div className="space-y-6">
            {viewMode === 'table' ? (
              <ApplicationTable
                applications={applications}
                onViewDetails={handleOpenDetailModal}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                onQuickStatusChange={quickUpdateStatus}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {applications.map((app) => (
                  <ApplicationCard
                    key={app._id}
                    application={app}
                    onViewDetails={handleOpenDetailModal}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteModal}
                    onQuickStatusChange={quickUpdateStatus}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="bg-white px-4 py-3 border border-gray-200 rounded-xl flex items-center justify-between">
                <div className="text-xs text-gray-500 font-medium">
                  Page <span className="font-bold text-gray-900">{page}</span> of{' '}
                  <span className="font-bold text-gray-900">{pagination.totalPages}</span> ({pagination.total} total items)
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!pagination.hasPrevPage}
                    className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={!pagination.hasNextPage}
                    className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        ApplyFlow &copy; {new Date().getFullYear()} — MERN Job Application Tracker. Designed for software engineering portfolios.
      </footer>

      {/* Modals & Toast */}
      <ApplicationFormModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setSelectedApplication(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedApplication}
        isSubmitting={isSubmitting}
      />

      <ApplicationDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setDetailApplication(null);
        }}
        application={detailApplication}
        onEdit={handleOpenEditModal}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTargetApplication(null);
        }}
        onConfirm={handleDeleteConfirm}
        application={deleteTargetApplication}
        isDeleting={isSubmitting}
      />

      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
};
