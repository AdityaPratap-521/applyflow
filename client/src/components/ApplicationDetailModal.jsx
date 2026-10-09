import React from 'react';
import { X, ExternalLink, MapPin, User, Mail, FileText, Clock, Edit2 } from 'lucide-react';
import { formatDate, getStatusBadgeStyle, getWorkModeBadgeStyle, isOverdue } from '../utils/formatters.js';

export const ApplicationDetailModal = ({ isOpen, onClose, application: app, onEdit }) => {
  if (!isOpen || !app) return null;

  const overdueFollowUp = isOverdue(app.followUpDate, app.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-start bg-gray-50">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${getStatusBadgeStyle(app.status)}`}>
                {app.status}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getWorkModeBadgeStyle(app.workMode)}`}>
                {app.workMode}
              </span>
              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{app.employmentType}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-2">{app.company}</h2>
            <p className="text-base text-gray-700 font-medium">{app.jobTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* External Job Link */}
          {app.jobUrl && (
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sky-900 font-medium">
                <ExternalLink className="w-4 h-4 text-sky-600" />
                <span>Original Job Post</span>
              </div>
              <a
                href={app.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-sky-600 text-white px-3 py-1.5 rounded-lg hover:bg-sky-700 font-medium transition-colors"
              >
                Visit Link
              </a>
            </div>
          )}

          {/* Location & Metadata */}
          {app.location && (
            <div className="flex items-center text-gray-700 font-medium">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span>{app.location}</span>
            </div>
          )}

          {/* Key Timelines */}
          <div className="bg-gray-50 p-4 rounded-xl space-y-3">
            <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center">
              <Clock className="w-4 h-4 mr-1.5 text-gray-400" /> Application Timeline
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-500 block">Applied Date:</span>
                <span className="font-semibold text-gray-800">{formatDate(app.applicationDate)}</span>
              </div>

              {app.deadline && (
                <div>
                  <span className="text-gray-500 block">Application Deadline:</span>
                  <span className="font-semibold text-gray-800">{formatDate(app.deadline)}</span>
                </div>
              )}

              {app.interviewDate && (
                <div>
                  <span className="text-gray-500 block">Interview Scheduled:</span>
                  <span className="font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded inline-block">
                    {formatDate(app.interviewDate)}
                  </span>
                </div>
              )}

              {app.followUpDate && (
                <div>
                  <span className="text-gray-500 block">Follow-Up Date:</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded inline-block ${
                      overdueFollowUp ? 'bg-rose-100 text-rose-800 font-bold' : 'text-gray-800'
                    }`}
                  >
                    {formatDate(app.followUpDate)} {overdueFollowUp && '(Overdue)'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Recruiter Details */}
          {(app.recruiterName || app.recruiterEmail) && (
            <div className="border border-gray-200 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider">Recruiter Contact Information</h3>
              {app.recruiterName && (
                <div className="flex items-center text-gray-800">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">{app.recruiterName}</span>
                </div>
              )}
              {app.recruiterEmail && (
                <div className="flex items-center text-sky-600">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <a href={`mailto:${app.recruiterEmail}`} className="hover:underline font-medium">
                    {app.recruiterEmail}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {app.notes ? (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center">
                <FileText className="w-4 h-4 mr-1.5 text-gray-400" /> Notes & Context
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-700 whitespace-pre-wrap">
                {app.notes}
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No notes added for this application.</p>
          )}

          {/* Metadata */}
          <div className="text-[11px] text-gray-400 pt-2 border-t border-gray-100 flex justify-between">
            <span>Created: {formatDate(app.createdAt)}</span>
            <span>Last Updated: {formatDate(app.updatedAt)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
          <button
            onClick={() => {
              onClose();
              onEdit(app);
            }}
            className="inline-flex items-center px-4 py-2 bg-amber-50 text-amber-800 border border-amber-300 rounded-lg hover:bg-amber-100 font-medium transition-colors"
          >
            <Edit2 className="w-4 h-4 mr-1.5" /> Edit Application
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
