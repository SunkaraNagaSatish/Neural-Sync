import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  MessageSquare, 
  BarChart3, 
  Award, 
  ArrowRight, 
  CheckCircle,
  Star,
  Zap,
  Target,
  TrendingUp,
  Clock
} from 'lucide-react';

export const AIInterviewPreview: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Questions',
      description: 'Get personalized interview questions based on your technology stack and experience level'
    },
    {
      icon: BarChart3,
      title: 'Instant Scoring',
      description: 'Receive immediate feedback with detailed scoring from 1-10 on your answers'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Track your progress over time and identify areas for improvement'
    },
    {
      icon: Target,
      title: 'Targeted Practice',
      description: 'Focus on specific technologies and difficulty levels that match your goals'
    }
  ];

  const technologies = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++',
    'Machine Learning', 'Data Science', 'DevOps', 'Cloud Computing',
    'Mobile Development', 'System Design'
  ];

  const sampleQuestions = [
    {
      level: 'Entry Level',
      tech: 'JavaScript',
      question: 'Can you explain the difference between let, const, and var in JavaScript?',
      difficulty: 'Easy'
    },
    {
      level: 'Mid Level',
      tech: 'React',
      question: 'How would you optimize the performance of a React application with many components?',
      difficulty: 'Medium'
    },
    {
      level: 'Senior Level',
      tech: 'System Design',
      question: 'Design a scalable chat application that can handle millions of concurrent users.',
      difficulty: 'Hard'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Interview Practice
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Practice with our AI interviewer that adapts to your experience level and provides instant feedback. 
            Perfect your answers before the real interview.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            How AI Interview Practice Works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Choose Your Focus</h3>
              <p className="text-gray-600">Select your technology stack and experience level for personalized questions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Answer Questions</h3>
              <p className="text-gray-600">Practice with AI-generated questions tailored to your profile</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Get Feedback</h3>
              <p className="text-gray-600">Receive instant scoring and detailed feedback to improve your answers</p>
            </div>
          </div>
        </div>

        {/* Technologies Supported */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 sm:p-8 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
            Technologies We Cover
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-white rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-center shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm sm:text-base font-medium text-gray-700">{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Questions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Sample Interview Questions
          </h2>
          <div className="space-y-6">
            {sampleQuestions.map((sample, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition-colors">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    {sample.level}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {sample.tech}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    sample.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    sample.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {sample.difficulty}
                  </span>
                </div>
                <p className="text-gray-900 text-lg">{sample.question}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <Clock className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Practice Anytime</h3>
            <p className="text-gray-600">Available 24/7 for unlimited practice sessions at your convenience</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <Zap className="w-8 h-8 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Feedback</h3>
            <p className="text-gray-600">Get immediate scoring and suggestions to improve your interview performance</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <Award className="w-8 h-8 text-amber-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Progress</h3>
            <p className="text-gray-600">Monitor your improvement over time with detailed analytics and insights</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Practice with AI?
          </h2>
          <p className="text-lg sm:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have improved their interview skills with our AI-powered practice sessions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Start Practicing Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="flex items-center justify-center mt-6 space-x-6 text-sm text-indigo-200">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>No setup required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Instant feedback</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};