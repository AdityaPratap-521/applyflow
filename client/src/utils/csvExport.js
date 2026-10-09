import { formatDate } from './formatters.js';

export const escapeCSVField = (field) => {
  if (field === null || field === undefined) return '""';
  const stringField = String(field);
  // Replace double quotes with pair of double quotes and wrap in quotes if contains comma, quote, or newline
  const escaped = stringField.replace(/"/g, '""');
  if (escaped.includes(',') || escaped.includes('"') || escaped.includes('\n') || escaped.includes('\r')) {
    return `"${escaped}"`;
  }
  return `"${escaped}"`;
};

export const exportApplicationsToCSV = (applications, filename = 'applyflow_job_applications.csv') => {
  if (!applications || applications.length === 0) {
    return false;
  }

  const headers = [
    'Company',
    'Job Title',
    'Status',
    'Work Mode',
    'Employment Type',
    'Location',
    'Application Date',
    'Deadline',
    'Interview Date',
    'Follow-Up Date',
    'Recruiter Name',
    'Recruiter Email',
    'Job URL',
    'Notes',
  ];

  const rows = applications.map((app) => [
    escapeCSVField(app.company),
    escapeCSVField(app.jobTitle),
    escapeCSVField(app.status),
    escapeCSVField(app.workMode),
    escapeCSVField(app.employmentType),
    escapeCSVField(app.location),
    escapeCSVField(formatDate(app.applicationDate)),
    escapeCSVField(formatDate(app.deadline)),
    escapeCSVField(formatDate(app.interviewDate)),
    escapeCSVField(formatDate(app.followUpDate)),
    escapeCSVField(app.recruiterName),
    escapeCSVField(app.recruiterEmail),
    escapeCSVField(app.jobUrl),
    escapeCSVField(app.notes),
  ]);

  const csvContent = [headers.map((h) => `"${h}"`).join(','), ...rows.map((row) => row.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
};
