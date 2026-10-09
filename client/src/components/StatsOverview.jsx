import React from 'react';
import { Layers, Send, Calendar, Award, XCircle, AlertCircle } from 'lucide-react';

export const StatsOverview = ({ stats, activeStatusFilter, onSelectStatusFilter }) => {
  if (!stats) return null;

  const { total = 0, byStatus = {}, upcomingInterviews = 0, overdueFollowUps = 0 } = stats;

  const statCards = [
    {
      id: 'All',
      title: 'Total Applications',
      value: total,
      icon: Layers,
      color: 'bg-blue-500 text-white',
      borderColor: activeStatusFilter === 'All' ? 'ring-2 ring-blue-500' : '',
    },
    {
      id: 'Applied',
      title: 'Applied',
      value: byStatus.Applied || 0,
      icon: Send,
      color: 'bg-sky-500 text-white',
      borderColor: activeStatusFilter === 'Applied' ? 'ring-2 ring-sky-500' : '',
    },
    {
      id: 'Interview',
      title: 'Interviews',
      value: byStatus.Interview || 0,
      subtext: `${upcomingInterviews} upcoming`,
      icon: Calendar,
      color: 'bg-amber-500 text-white',
      borderColor: activeStatusFilter === 'Interview' ? 'ring-2 ring-amber-500' : '',
    },
    {
      id: 'Offer',
      title: 'Offers Received',
      value: byStatus.Offer || 0,
      icon: Award,
      color: 'bg-emerald-500 text-white',
      borderColor: activeStatusFilter === 'Offer' ? 'ring-2 ring-emerald-500' : '',
    },
    {
      id: 'Rejected',
      title: 'Rejected',
      value: byStatus.Rejected || 0,
      icon: XCircle,
      color: 'bg-rose-500 text-white',
      borderColor: activeStatusFilter === 'Rejected' ? 'ring-2 ring-rose-500' : '',
    },
  ];

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <button
              key={card.id}
              onClick={() => onSelectStatusFilter(card.id)}
              className={`p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all text-left flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-sky-500 ${card.borderColor}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.title}</span>
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                {card.subtext && <div className="text-xs text-amber-700 font-medium mt-0.5">{card.subtext}</div>}
              </div>
            </button>
          );
        })}
      </div>

      {overdueFollowUps > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center space-x-3 text-amber-800 text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <span className="font-semibold">Attention Needed:</span> You have{' '}
            <span className="font-bold underline">{overdueFollowUps}</span> application(s) with overdue follow-up dates.
          </div>
        </div>
      )}
    </div>
  );
};
