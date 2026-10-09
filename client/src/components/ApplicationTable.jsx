import React from 'react';
import { Eye, Edit2, Trash2, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { formatDate, getStatusBadgeStyle, getWorkModeBadgeStyle, isOverdue } from '../utils/formatters.js';

export const ApplicationTable = ({
  applications,
  onViewDetails,
  onEdit,
  onDelete,
  onQuickStatusChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Company & Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Work Mode & Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Applied Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Key Dates
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((app) => {
              const overdueFollowUp = isOverdue(app.followUpDate, app.status);

              return (
                <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                  {/* Company & Role */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="text-sm font-bold text-gray-900 flex items-center space-x-1.5">
                          <span>{app.company}</span>
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
                        <div className="text-sm text-gray-600">{app.jobTitle}</div>
                        {app.employmentType && (
                          <span className="inline-block mt-0.5 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            {app.employmentType}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Status Dropdown Quick Change */}
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  </td>

                  {/* Work Mode & Location */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-block px-2 py-0.5 text-xs rounded-md font-medium ${getWorkModeBadgeStyle(app.workMode)}`}>
                        {app.workMode}
                      </span>
                      {app.location && (
                        <div className="text-xs text-gray-500 flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>{app.location}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Applied Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(app.applicationDate)}
                  </td>

                  {/* Key Dates (Interview & Follow-up) */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs space-y-1">
                    {app.interviewDate && (
                      <div className="flex items-center text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                        <Calendar className="w-3 h-3 mr-1 text-amber-600" />
                        <span>Interview: {formatDate(app.interviewDate)}</span>
                      </div>
                    )}
                    {app.followUpDate && (
                      <div
                        className={`flex items-center px-2 py-0.5 rounded font-medium ${
                          overdueFollowUp ? 'bg-rose-100 text-rose-800 font-bold' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span>Follow-up: {formatDate(app.followUpDate)}</span>
                        {overdueFollowUp && <span className="ml-1 text-[10px] uppercase bg-rose-600 text-white px-1 rounded">Overdue</span>}
                      </div>
                    )}
                    {!app.interviewDate && !app.followUpDate && <span className="text-gray-400">—</span>}
                  </td>

                  {/* Action Buttons */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onViewDetails(app)}
                        className="p-1.5 text-gray-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(app)}
                        className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit Application"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(app)}
                        className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
