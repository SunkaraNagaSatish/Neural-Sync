import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Clock, 
  Award, 
  TrendingUp, 
  Calendar,
  FileText,
  Download,
  Share2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';

interface InterviewSession {
  id: string;
  date: Date;
  jobTitle: string;
  companyName: string;
  duration: number;
  questionsAnswered: number;
  aiResponsesUsed: number;
  averageResponseTime: number;
  status: 'completed' | 'in-progress' | 'cancelled';
}

export const InterviewSummary: React.FC = () => {
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockSessions: InterviewSession[] = [
      {
        id: '1',
        date: new Date('2024-01-15'),
        jobTitle: 'Senior Software Engineer',
        companyName: 'Google',
        duration: 45,
        questionsAnswered: 12,
        aiResponsesUsed: 8,
        averageResponseTime: 650,
        status: 'completed'
      },
      {
        id: '2',
        date: new Date('2024-01-12'),
        jobTitle: 'Product Manager',
        companyName: 'Microsoft',
        duration: 38,
        questionsAnswered: 10,
        aiResponsesUsed: 6,
        averageResponseTime: 720,
        status: 'completed'
      },
      {
        id: '3',
        date: new Date('2024-01-10'),
        jobTitle: 'Data Scientist',
        companyName: 'Amazon',
        duration: 52,
        questionsAnswered: 15,
        aiResponsesUsed: 12,
        averageResponseTime: 580,
        status: 'completed'
      }
    ];
    setSessions(mockSessions);
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDownloadReport = (sessionId: string) => {
    if (!isPremium) {
      showNotification('error', 'Premium feature required. Please upgrade to download reports.');
      return;
    }
    showNotification('success', 'Report downloaded successfully!');
  };

  const handleShareSession = (sessionId: string) => {
    showNotification('success', 'Session link copied to clipboard!');
  };

  const totalSessions = sessions.length;
  const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
  const totalQuestions = sessions.reduce((sum, session) => sum + session.questionsAnswered, 0);
  const totalAIResponses = sessions.reduce((sum, session) => sum + session.aiResponsesUsed, 0);
  const averageResponseTime = sessions.length > 0 
    ? Math.round(sessions.reduce((sum, session) => sum + session.averageResponseTime, 0) / sessions.length)
    : 0;

  const stats = [
    { label: 'Total Sessions', value: totalSessions, icon: Calendar, color: 'text-blue-600' },
    { label: 'Total Duration', value: `${totalDuration} min`, icon: Clock, color: 'text-green-600' },
    { label: 'Questions Answered', value: totalQuestions, icon: BarChart3, color: 'text-purple-600' },
    { label: 'AI Responses Used', value: totalAIResponses, icon: TrendingUp, color: 'text-amber-600' },
  ];

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Interview Summary
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Upgrade to Premium to access detailed interview analytics and summaries
            </p>
            <Link
              to="/premium"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 inline-flex items-center space-x-2 font-semibold"
            >
              <Award className="w-5 h-5" />
              <span>Upgrade to Premium</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Interview Summary
          </h1>
          <p className="text-xl text-gray-600">
            Track your interview performance and AI assistance usage
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-indigo-600" />
            Performance Overview
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">{averageResponseTime}ms</div>
              <div className="text-sm text-green-800">Average Response Time</div>
              <div className="text-xs text-green-600 mt-1">Excellent performance</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {totalQuestions > 0 ? Math.round((totalAIResponses / totalQuestions) * 100) : 0}%
              </div>
              <div className="text-sm text-blue-800">AI Assistance Rate</div>
              <div className="text-xs text-blue-600 mt-1">Questions with AI help</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0}
              </div>
              <div className="text-sm text-purple-800">Avg Session Duration</div>
              <div className="text-xs text-purple-600 mt-1">Minutes per interview</div>
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-indigo-600" />
              Recent Interview Sessions
            </h2>
          </div>

          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{session.jobTitle}</h3>
                    <p className="text-gray-600">{session.companyName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      session.status === 'completed' ? 'bg-green-100 text-green-800' :
                      session.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {session.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {session.date.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-indigo-600">{session.duration}m</div>
                    <div className="text-xs text-gray-600">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{session.questionsAnswered}</div>
                    <div className="text-xs text-gray-600">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-amber-600">{session.aiResponsesUsed}</div>
                    <div className="text-xs text-gray-600">AI Responses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{session.averageResponseTime}ms</div>
                    <div className="text-xs text-gray-600">Avg Response</div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleShareSession(session.id)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={() => handleDownloadReport(session.id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Report</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {sessions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No interview sessions yet</p>
              <p className="text-sm">Start your first interview session to see analytics here</p>
            </div>
          )}
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center space-x-2 max-w-md ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}
    </div>
  );
};