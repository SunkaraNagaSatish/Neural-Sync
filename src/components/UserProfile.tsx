import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  BarChart3, 
  Settings, 
  Crown,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');

  const handleSave = () => {
    // In a real app, this would update the user profile
    setIsEditing(false);
  };

  const stats = [
    { label: 'Interviews Completed', value: '12', icon: BarChart3, color: 'text-blue-600' },
    { label: 'Average Score', value: '8.5/10', icon: Award, color: 'text-green-600' },
    { label: 'Practice Sessions', value: '24', icon: Calendar, color: 'text-purple-600' },
    { label: 'Success Rate', value: '85%', icon: Crown, color: 'text-amber-600' }
  ];

  const recentActivity = [
    { date: '2024-01-15', activity: 'Completed Technical Interview Practice', score: '9/10' },
    { date: '2024-01-14', activity: 'AI Meeting Assistant Session', duration: '45 min' },
    { date: '2024-01-13', activity: 'Behavioral Interview Practice', score: '8/10' },
    { date: '2024-01-12', activity: 'System Design Practice', score: '7/10' }
  ];

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
            User Profile
          </h1>
          <p className="text-gray-600">Manage your account and track your progress</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Profile Info */}
          <div className="space-y-6 lg:col-span-1">
            {/* Profile Card */}
            <div className="p-6 bg-white shadow-lg rounded-2xl">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                    alt={user?.name}
                    className="w-24 h-24 border-4 border-white rounded-full shadow-lg"
                  />
                  {isPremium && (
                    <div className="absolute flex items-center justify-center w-8 h-8 rounded-full -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="w-full px-3 py-2 text-center transition-colors border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      />
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={handleSave}
                          className="flex items-center px-3 py-1 space-x-1 text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex items-center px-3 py-1 space-x-1 text-white transition-colors bg-gray-500 rounded-lg hover:bg-gray-600"
                        >
                          <X className="w-3 h-3" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-center mb-2 space-x-2">
                        <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="p-1 text-gray-400 transition-colors hover:text-gray-600"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{user?.email}</span>
                      </div>
                    </div>
                  )}
                </div>

                {isPremium ? (
                  <div className="inline-flex items-center px-4 py-2 space-x-2 text-sm font-medium rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700">
                    <Crown className="w-4 h-4" />
                    <span>Premium Member</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center px-4 py-2 space-x-2 text-sm text-gray-600 bg-gray-100 rounded-full">
                    <User className="w-4 h-4" />
                    <span>Free Plan</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-white shadow-lg rounded-2xl">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <Settings className="w-5 h-5 mr-2" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 text-left text-indigo-700 transition-colors rounded-lg bg-indigo-50 hover:bg-indigo-100">
                  Update Profile Picture
                </button>
                <button className="w-full px-4 py-3 text-left text-purple-700 transition-colors rounded-lg bg-purple-50 hover:bg-purple-100">
                  Change Password
                </button>
                <button className="w-full px-4 py-3 text-left text-green-700 transition-colors rounded-lg bg-green-50 hover:bg-green-100">
                  Export Data
                </button>
                {!isPremium && (
                  <button className="w-full px-4 py-3 font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    Upgrade to Premium
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="space-y-6 lg:col-span-2">
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="p-6 bg-white shadow-lg rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="mb-1 text-sm text-gray-600">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="p-6 bg-white shadow-lg rounded-2xl">
              <h3 className="flex items-center mb-6 text-lg font-semibold text-gray-900">
                <BarChart3 className="w-5 h-5 mr-2" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.activity}</p>
                      <p className="text-sm text-gray-600">{activity.date}</p>
                    </div>
                    <div className="text-right">
                      {activity.score && (
                        <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                          {activity.score}
                        </span>
                      )}
                      {activity.duration && (
                        <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                          {activity.duration}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="p-6 bg-white shadow-lg rounded-2xl">
              <h3 className="flex items-center mb-6 text-lg font-semibold text-gray-900">
                <Award className="w-5 h-5 mr-2" />
                Achievements
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="p-4 text-center border border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-yellow-400 rounded-full">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs font-medium text-yellow-800">First Interview</p>
                </div>
                <div className="p-4 text-center border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-blue-400 rounded-full">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs font-medium text-blue-800">10 Sessions</p>
                </div>
                <div className="p-4 text-center border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-green-400 rounded-full">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs font-medium text-green-800">High Scorer</p>
                </div>
                <div className="p-4 text-center border border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-purple-400 rounded-full">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs font-medium text-purple-800">Consistent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};