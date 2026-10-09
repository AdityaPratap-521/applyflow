import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, application: app, isDeleting = false }) => {
  if (!isOpen || !app) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900">Delete Job Application?</h3>
          <p className="text-sm text-gray-600 mt-2">
            Are you sure you want to delete the job application for{' '}
            <span className="font-bold text-gray-900">{app.jobTitle}</span> at{' '}
            <span className="font-bold text-gray-900">{app.company}</span>? This action cannot be undone.
          </p>
        </div>

        <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(app._id)}
            disabled={isDeleting}
            className="px-4 py-2 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 focus:outline-none flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Deleting...' : 'Delete Application'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
