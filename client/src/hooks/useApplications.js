import { useState, useEffect, useCallback } from 'react';
import {
  getApplications,
  getStats,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../lib/api.js';

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [workModeFilter, setWorkModeFilter] = useState('All');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('applicationDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [viewMode, setViewMode] = useState('table');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const clearToast = () => setToast(null);

  // Fetch Stats & Applications
  const fetchData = useCallback(
    async (isBackground = false) => {
      if (!isBackground) setLoading(true);
      setRefreshing(true);
      setError(null);

      try {
        const [appRes, statsRes] = await Promise.all([
          getApplications({
            page,
            limit,
            q: searchQuery,
            status: statusFilter,
            workMode: workModeFilter,
            employmentType: employmentTypeFilter,
            sortBy,
            sortOrder,
          }),
          getStats(),
        ]);

        if (appRes.success) {
          setApplications(appRes.data);
          setPagination(appRes.pagination);
        }

        if (statsRes.success) {
          setStats(statsRes.data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to connect to backend server');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, limit, searchQuery, statusFilter, workModeFilter, employmentTypeFilter, sortBy, sortOrder]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page when search or filters change
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleWorkModeChange = (mode) => {
    setWorkModeFilter(mode);
    setPage(1);
  };

  const handleSortByChange = (field) => {
    setSortBy(field);
    setPage(1);
  };

  const handleSortOrderToggle = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPage(1);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setWorkModeFilter('All');
    setEmploymentTypeFilter('All');
    setSortBy('applicationDate');
    setSortOrder('desc');
    setPage(1);
  };

  // CRUD Methods
  const addApplication = async (formData) => {
    try {
      const res = await createApplication(formData);
      if (res.success) {
        showToast('Application created successfully!', 'success');
        await fetchData(true);
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Failed to create application', 'error');
      return false;
    }
  };

  const editApplication = async (id, formData) => {
    try {
      const res = await updateApplication(id, formData);
      if (res.success) {
        showToast('Application updated successfully!', 'success');
        await fetchData(true);
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Failed to update application', 'error');
      return false;
    }
  };

  const quickUpdateStatus = async (id, newStatus) => {
    try {
      const res = await updateApplication(id, { status: newStatus });
      if (res.success) {
        showToast(`Status updated to '${newStatus}'`, 'success');
        await fetchData(true);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const removeApplication = async (id) => {
    try {
      const res = await deleteApplication(id);
      if (res.success) {
        showToast('Application deleted successfully!', 'success');
        await fetchData(true);
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete application', 'error');
      return false;
    }
  };

  return {
    applications,
    stats,
    loading,
    refreshing,
    error,
    searchQuery,
    statusFilter,
    workModeFilter,
    employmentTypeFilter,
    sortBy,
    sortOrder,
    page,
    limit,
    pagination,
    viewMode,
    toast,
    setPage,
    setLimit,
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
  };
};
