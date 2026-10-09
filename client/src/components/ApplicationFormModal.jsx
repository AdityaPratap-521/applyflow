import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { formatDateForInput } from '../utils/formatters.js';

export const ApplicationFormModal = ({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    company: '',
    jobTitle: '',
    jobUrl: '',
    location: '',
    workMode: 'Remote',
    employmentType: 'Full-time',
    status: 'Applied',
    applicationDate: formatDateForInput(new Date()),
    deadline: '',
    interviewDate: '',
    followUpDate: '',
    recruiterName: '',
    recruiterEmail: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || '',
        jobTitle: initialData.jobTitle || '',
        jobUrl: initialData.jobUrl || '',
        location: initialData.location || '',
        workMode: initialData.workMode || 'Remote',
        employmentType: initialData.employmentType || 'Full-time',
        status: initialData.status || 'Applied',
        applicationDate: formatDateForInput(initialData.applicationDate || new Date()),
        deadline: formatDateForInput(initialData.deadline),
        interviewDate: formatDateForInput(initialData.interviewDate),
        followUpDate: formatDateForInput(initialData.followUpDate),
        recruiterName: initialData.recruiterName || '',
        recruiterEmail: initialData.recruiterEmail || '',
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        company: '',
        jobTitle: '',
        jobUrl: '',
        location: '',
        workMode: 'Remote',
        employmentType: 'Full-time',
        status: 'Applied',
        applicationDate: formatDateForInput(new Date()),
        deadline: '',
        interviewDate: '',
        followUpDate: '',
        recruiterName: '',
        recruiterEmail: '',
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    if (formData.jobUrl && !/^https?:\/\/.+/.test(formData.jobUrl)) {
      newErrors.jobUrl = 'URL must start with http:// or https://';
    }
    if (formData.recruiterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.recruiterEmail)) {
      newErrors.recruiterEmail = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const isEdit = !!initialData;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? 'Edit Job Application' : 'Add New Job Application'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
          {/* Row 1: Company & Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Acme Corp"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none ${
                  errors.company ? 'border-rose-500 bg-rose-50' : 'border-gray-300'
                }`}
              />
              {errors.company && (
                <p className="text-xs text-rose-600 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" /> {errors.company}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Engineer"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none ${
                  errors.jobTitle ? 'border-rose-500 bg-rose-50' : 'border-gray-300'
                }`}
              />
              {errors.jobTitle && (
                <p className="text-xs text-rose-600 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" /> {errors.jobTitle}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Status, Work Mode, Employment Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Work Mode</label>
              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="In-office">In-office</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Employment Type</label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Row 3: Job URL & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Job Post URL</label>
              <input
                type="text"
                name="jobUrl"
                value={formData.jobUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/jobs/..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none ${
                  errors.jobUrl ? 'border-rose-500 bg-rose-50' : 'border-gray-300'
                }`}
              />
              {errors.jobUrl && <p className="text-xs text-rose-600 mt-1">{errors.jobUrl}</p>}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. San Francisco, CA or Remote"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 4: Key Dates */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Application Date</label>
              <input
                type="date"
                name="applicationDate"
                value={formData.applicationDate}
                onChange={handleChange}
                className="w-full px-2.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-2.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Interview Date</label>
              <input
                type="date"
                name="interviewDate"
                value={formData.interviewDate}
                onChange={handleChange}
                className="w-full px-2.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Follow-Up Date</label>
              <input
                type="date"
                name="followUpDate"
                value={formData.followUpDate}
                onChange={handleChange}
                className="w-full px-2.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Row 5: Recruiter Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Recruiter Name</label>
              <input
                type="text"
                name="recruiterName"
                value={formData.recruiterName}
                onChange={handleChange}
                placeholder="e.g. Jane Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Recruiter Email</label>
              <input
                type="email"
                name="recruiterEmail"
                value={formData.recruiterEmail}
                onChange={handleChange}
                placeholder="jane.doe@company.com"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none ${
                  errors.recruiterEmail ? 'border-rose-500 bg-rose-50' : 'border-gray-300'
                }`}
              />
              {errors.recruiterEmail && <p className="text-xs text-rose-600 mt-1">{errors.recruiterEmail}</p>}
            </div>
          </div>

          {/* Row 6: Notes */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Notes & Application Details</label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Referral contacts, preparation notes, interview rounds..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : isEdit ? 'Update Application' : 'Save Application'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
