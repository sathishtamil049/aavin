import { useMembers } from '../store';
import { ViewMode } from '../types';
import {
  Users,
  UserPlus,
  TrendingUp,
  Leaf,
  Calendar,
  MapPin,
  ArrowUpRight,
  Activity,
  CreditCard,
} from 'lucide-react';

interface DashboardProps {
  setCurrentView: (view: ViewMode) => void;
}

export default function Dashboard({ setCurrentView }: DashboardProps) {
  const { members } = useMembers();

  const totalMembers = members.length;
  const cowCount = members.filter((m) => m.animalType === 'Cow').length;
  const buffaloCount = members.filter((m) => m.animalType === 'Buffalo').length;
  const goatCount = members.filter((m) => m.animalType === 'Goat').length;
  const maleCount = members.filter((m) => m.gender === 'Male').length;
  const femaleCount = members.filter((m) => m.gender === 'Female').length;

  // Get unique banks
  const uniqueBanks = [...new Set(members.map((m) => m.bankName))];

  // Recent members (last 5)
  const recentMembers = [...members]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Monthly registration stats
  const monthlyStats = getMonthlyStats(members);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Welcome to Aavin PMS</h2>
            <p className="text-blue-200 mt-1">Producer Management System - Know Your Customer</p>
            <p className="text-blue-300 text-sm mt-2">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
              <Activity className="w-10 h-10 text-white/80" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Total Members"
          value={totalMembers}
          color="blue"
          trend="+12%"
        />
        <StatCard
          icon={<Leaf className="w-6 h-6" />}
          label="Total Animals"
          value={cowCount + buffaloCount + goatCount}
          color="green"
          trend="+8%"
        />
        <StatCard
          icon={<CreditCard className="w-6 h-6" />}
          label="Bank Accounts"
          value={uniqueBanks.length}
          color="purple"
          trend="+5%"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6" />}
          label="This Month"
          value={monthlyStats.currentMonth}
          color="orange"
          trend="+3%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Animal Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-blue-600" />
            Animal Type Distribution
          </h3>
          <div className="space-y-4">
            <ProgressBar label="Cow" value={cowCount} total={totalMembers} color="bg-green-500" />
            <ProgressBar label="Buffalo" value={buffaloCount} total={totalMembers} color="bg-purple-500" />
            <ProgressBar label="Goat" value={goatCount} total={totalMembers} color="bg-orange-500" />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Animals Registered</span>
              <span className="font-bold text-gray-800">{cowCount + buffaloCount + goatCount}</span>
            </div>
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            Gender Distribution
          </h3>
          <div className="flex items-center justify-center py-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  strokeDasharray={`${(maleCount / (totalMembers || 1)) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="12"
                  strokeDasharray={`${(femaleCount / (totalMembers || 1)) * 251.2} 251.2`}
                  strokeDashoffset={`-${(maleCount / (totalMembers || 1)) * 251.2}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">{totalMembers}</p>
                  <p className="text-xs text-gray-500">Members</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Male ({maleCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <span className="text-sm text-gray-600">Female ({femaleCount})</span>
            </div>
          </div>
        </div>

        {/* Bank Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            Bank Distribution
          </h3>
          <div className="space-y-3">
            {uniqueBanks.slice(0, 5).map((bank) => {
              const count = members.filter((m) => m.bankName === bank).length;
              return (
                <div key={bank} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate max-w-[150px]">{bank}</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {count}
                  </span>
                </div>
              );
            })}
            {uniqueBanks.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Registration Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Monthly Registrations
        </h3>
        <div className="flex items-end gap-2 h-40">
          {monthlyStats.months.map((month) => (
            <div key={month.label} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-blue-500 rounded-t-md min-h-[4px] transition-all duration-500"
                style={{ height: `${(month.count / (monthlyStats.max || 1)) * 100}%` }}
              ></div>
              <span className="text-xs text-gray-500">{month.label}</span>
              <span className="text-xs font-medium text-gray-700">{month.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Members & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-600" />
            Recent Members
          </h3>
          <div className="space-y-3">
            {recentMembers.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No members yet</p>
            ) : (
              recentMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                    {member.firstName.charAt(0)}{member.surname.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {member.firstName} {member.surname}
                    </p>
                    <p className="text-xs text-gray-500">{member.memberCode} • {member.animalType}</p>
                  </div>
                  <span className="text-xs text-gray-400">{member.registrationDate}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCurrentView('add')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <UserPlus className="w-8 h-8 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Add Member</span>
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <Users className="w-8 h-8 text-green-600" />
              <span className="text-sm font-medium text-gray-700">View All</span>
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <ArrowUpRight className="w-8 h-8 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Export Data</span>
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
            >
              <Calendar className="w-8 h-8 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  trend: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
          {trend}
        </span>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function ProgressBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-medium text-gray-800">
          {value} ({percentage.toFixed(0)}%)
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

function getMonthlyStats(members: { createdAt: string }[]) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthCounts = months.map((label, index) => {
    const count = members.filter((m) => {
      const date = new Date(m.createdAt);
      return date.getMonth() === index && date.getFullYear() === currentYear;
    }).length;
    return { label, count };
  });

  const max = Math.max(...monthCounts.map((m) => m.count), 1);

  return {
    months: monthCounts,
    max,
    currentMonth: monthCounts[currentMonth]?.count || 0,
  };
}
