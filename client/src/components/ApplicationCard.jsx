import React from 'react';
import { ExternalLink, Calendar, MapPin, Mail, User, Eye, Edit2, Trash2 } from 'lucide-react';
import { formatDate, getStatusBadgeStyle, getWorkModeBadgeStyle, isOverdue } from '../utils/formatters.js';

export const ApplicationCard = ({ application: app, onViewDetails, onEdit, onDelete, onQuickStatusChange }) => {
  const overdueFollowUp = isOverdue(app.followUpDate, app.status);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Header: Company & Status */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-base font-bold text-gray-900">{app.company}</h3>
              {app.jobUrl && (
                <a
                  href={app.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-sky-600 inline-flex"
                  title="View original job post"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            <p className="text-sm font-medium text-gray-700">{app.jobTitle}</p>
          </div>

          {/* Quick status dropdown */}
          <select
            value={app.status}
            onChange={(e) => onQuickStatusChange(app._id, e.target.value)}
            className={`text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 ${getStatusBadgeStyle(
              app.status
            )}`}
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Tags row: Work Mode, Employment Type, Location */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs">
          <span className={`px-2 py-0.5 rounded-md font-medium ${getWorkModeBadgeStyle(app.workMode)}`}>{app.workMode}</span>
          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">{app.employmentType}</span>
          {app.location && (
            <span className="flex items-center text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md">
              <MapPin className="w-3 h-3 mr-1 text-gray-400" />
              {app.location}
            </span>
          )}
        </div>

        {/* Dates Info */}
        <div className="space-y-1.5 text-xs text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between">
            <span className="text-gray-500">Applied Date:</span>
            <span className="font-medium">{formatDate(app.applicationDate)}</span>
          </div>

          {app.interviewDate && (
            <div className="flex justify-between text-amber-800 font-medium">
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1 text-amber-600" /> Interview:
              </span>
              <span>{formatDate(app.interviewDate)}</span>
            </div>
          )}

          {app.followUpDate && (
            <div className={`flex justify-between ${overdueFollowUp ? 'text-rose-700 font-bold' : 'text-gray-600'}`}>
              <span>Follow-up:</span>
              <span className="flex items-center">
                {formatDate(app.followUpDate)}
                {overdueFollowUp && <span className="ml-1 text-[10px] bg-rose-600 text-white px-1 rounded">Overdue</span>}
              </span>
            </div>
          )}
        </div>

        {/* Recruiter info if available */}
        {(app.recruiterName || app.recruiterEmail) && (
          <div className="text-xs text-gray-500 mb-4 space-y-1">
            {app.recruiterName && (
              <div className="flex items-center">
                <User className="w-3 h-3 mr-1.5 text-gray-400" />
                <span>{app.recruiterName}</span>
              </div>
            )}
            {app.recruiterEmail && (
              <div className="flex items-center">
                <Mail className="w-3 h-3 mr-1.5 text-gray-400" />
                <a href={`mailto:${app.recruiterEmail}`} className="text-sky-600 hover:underline">
                  {app.recruiterEmail}
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <button
          onClick={() => onViewDetails(app)}
          className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center"
        >
          <Eye className="w-3.5 h-3.5 mr-1" /> View Full Details
        </button>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(app)}
            className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(app)}
            className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
