export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

export const isOverdue = (dateString, status) => {
  if (!dateString || status === 'Offer' || status === 'Rejected') return false;
  const date = new Date(dateString);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return date < now;
};

export const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'Applied':
      return 'bg-blue-100 text-blue-800 border border-blue-300';
    case 'Interview':
      return 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold';
    case 'Offer':
      return 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold';
    case 'Rejected':
      return 'bg-rose-100 text-rose-800 border border-rose-300';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
};

export const getWorkModeBadgeStyle = (workMode) => {
  switch (workMode) {
    case 'Remote':
      return 'bg-purple-100 text-purple-800';
    case 'Hybrid':
      return 'bg-teal-100 text-teal-800';
    case 'In-office':
      return 'bg-slate-100 text-slate-800';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};
