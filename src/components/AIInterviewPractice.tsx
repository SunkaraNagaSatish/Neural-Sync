import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle,
  Star,
  TrendingUp,
  Clock,
  Target,
  Award,
  Zap,
  BarChart3
} from 'lucide-react';
import { generateInterviewQuestion, evaluateAnswer } from '../services/aiInterviewService';

const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level'];
const TECHNOLOGIES = [
  'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 
  'Machine Learning', 'Data Science', 'DevOps', 'Cloud Computing',
  'Mobile Development', 'System Design', 'Database Design'
];

interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: string;
}

interface Evaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export const AIInterviewPractice: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    questionsAnswered: 0,
    averageScore: 0,
    totalScore: 0,
    sessionTime: 0
  });
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStartTime) {
      interval = setInterval(() => {
        setSessionStats(prev => ({
          ...prev,
          sessionTime: Math.floor((Date.now() - sessionStartTime.getTime()) / 1000)
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStartPractice = async () => {
    if (!selectedTech || !selectedLevel) {
      showNotification('error', 'Please select both technology and experience level');
      return;
    }

    setIsGeneratingQuestion(true);
    setSessionStartTime(new Date());
    
    try {
      const question = await generateInterviewQuestion(selectedTech, selectedLevel);
      setCurrentQuestion(question);
      showNotification('success', 'Interview question generated! Start answering when ready.');
    } catch (error) {
      showNotification('error', 'Failed to generate question. Please try again.');
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !currentQuestion) {
      showNotification('error', 'Please provide an answer before submitting');
      return;
    }

    setIsEvaluating(true);
    
    try {
      const result = await evaluateAnswer(currentQuestion, userAnswer, selectedTech, selectedLevel);
      setEvaluation(result);
      
      // Update session stats
      setSessionStats(prev => {
        const newQuestionsAnswered = prev.questionsAnswered + 1;
        const newTotalScore = prev.totalScore + result.score;
        const newAverageScore = newTotalScore / newQuestionsAnswered;
        
        return {
          ...prev,
          questionsAnswered: newQuestionsAnswered,
          totalScore: newTotalScore,
          averageScore: Math.round(newAverageScore * 10) / 10
        };
      });
      
      showNotification('success', `Answer evaluated! Score: ${result.score}/10`);
    } catch (error) {
      showNotification('error', 'Failed to evaluate answer. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = async () => {
    setIsGeneratingQuestion(true);
    setUserAnswer('');
    setEvaluation(null);
    
    try {
      const question = await generateInterviewQuestion(selectedTech, selectedLevel);
      setCurrentQuestion(question);
    } catch (error) {
      showNotification('error', 'Failed to generate next question. Please try again.');
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const handleResetSession = () => {
    setCurrentQuestion(null);
    setUserAnswer('');
    setEvaluation(null);
    setSessionStats({
      questionsAnswered: 0,
      averageScore: 0,
      totalScore: 0,
      sessionTime: 0
    });
    setSessionStartTime(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 9) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 7) return { text: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (score >= 5) return { text: 'Average', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Needs Work', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
            AI Interview Practice
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Practice with our AI interviewer and get instant feedback on your answers
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Setup & Stats */}
          <div className="space-y-6">
            {/* Setup Panel */}
            <div className="p-6 bg-white shadow-lg rounded-2xl">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <Target className="w-5 h-5 mr-2 text-indigo-600" />
                Practice Setup
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Technology/Domain
                  </label>
                  <select
                    value={selectedTech}
                    onChange={(e) => setSelectedTech(e.target.value)}
                    className="w-full px-3 py-2 transition-colors border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    disabled={currentQuestion !== null}
                  >
                    <option value="">Select Technology</option>
                    {TECHNOLOGIES.map(tech => (
                      <option key={tech} value={tech}>{tech}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Experience Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-3 py-2 transition-colors border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    disabled={currentQuestion !== null}
                  >
                    <option value="">Select Level</option>
                    {EXPERIENCE_LEVELS.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleStartPractice}
                  disabled={isGeneratingQuestion || !selectedTech || !selectedLevel || currentQuestion !== null}
                  className="flex items-center justify-center w-full px-4 py-3 space-x-2 font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingQuestion ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Start Practice</span>
                    </>
                  )}
                </button>

                {currentQuestion && (
                  <button
                    onClick={handleResetSession}
                    className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Session</span>
                  </button>
                )}
              </div>
            </div>

            {/* Session Stats */}
            <div className="p-6 bg-white shadow-lg rounded-2xl">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Session Stats
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{sessionStats.questionsAnswered}</div>
                  <div className="text-xs text-gray-600">Questions</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(sessionStats.averageScore)}`}>
                    {sessionStats.averageScore || 0}
                  </div>
                  <div className="text-xs text-gray-600">Avg Score</div>
                </div>
                <div className="col-span-2 text-center">
                  <div className="text-lg font-bold text-emerald-600">
                    {formatTime(sessionStats.sessionTime)}
                  </div>
                  <div className="text-xs text-gray-600">Session Time</div>
                </div>
              </div>

              {sessionStats.averageScore > 0 && (
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreBadge(sessionStats.averageScore).color}`}>
                    <Award className="w-4 h-4 mr-1" />
                    {getScoreBadge(sessionStats.averageScore).text}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Question & Answer */}
          <div className="space-y-6 lg:col-span-2">
            {/* Current Question */}
            {currentQuestion && (
              <div className="p-6 bg-white shadow-lg rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="flex items-center text-lg font-semibold text-gray-900">
                    <Brain className="w-5 h-5 mr-2 text-indigo-600" />
                    Interview Question
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full">
                      {currentQuestion.category}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded-full">
                      {currentQuestion.difficulty}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                  <p className="text-lg leading-relaxed text-gray-900">
                    {currentQuestion.text}
                  </p>
                </div>
              </div>
            )}

            {/* Answer Input */}
            {currentQuestion && !evaluation && (
              <div className="p-6 bg-white shadow-lg rounded-2xl">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Your Answer
                </h3>
                
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 transition-colors border border-gray-300 resize-none rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="Type your answer here... Be detailed and provide specific examples where possible."
                />
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-500">
                    {userAnswer.length} characters
                  </span>
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isEvaluating || !userAnswer.trim()}
                    className="flex items-center px-6 py-3 space-x-2 font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEvaluating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Submit Answer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Evaluation Results */}
            {evaluation && (
              <div className="p-6 bg-white shadow-lg rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="flex items-center text-lg font-semibold text-gray-900">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    AI Evaluation
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(evaluation.score)}`}>
                        {evaluation.score}/10
                      </div>
                      <div className="text-xs text-gray-600">Score</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Overall Feedback */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="mb-2 font-medium text-gray-900">Overall Feedback</h4>
                    <p className="leading-relaxed text-gray-700">{evaluation.feedback}</p>
                  </div>

                  {/* Strengths */}
                  {evaluation.strengths.length > 0 && (
                    <div>
                      <h4 className="flex items-center mb-3 font-medium text-gray-900">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Strengths
                      </h4>
                      <div className="space-y-2">
                        {evaluation.strengths.map((strength, index) => (
                          <div key={index} className="p-3 border-l-4 border-green-400 rounded-lg bg-green-50">
                            <p className="text-sm text-green-800">{strength}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Areas for Improvement */}
                  {evaluation.improvements.length > 0 && (
                    <div>
                      <h4 className="flex items-center mb-3 font-medium text-gray-900">
                        <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                        Areas for Improvement
                      </h4>
                      <div className="space-y-2">
                        {evaluation.improvements.map((improvement, index) => (
                          <div key={index} className="p-3 border-l-4 border-blue-400 rounded-lg bg-blue-50">
                            <p className="text-sm text-blue-800">{improvement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleNextQuestion}
                    disabled={isGeneratingQuestion}
                    className="flex items-center px-6 py-3 space-x-2 font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingQuestion ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Next Question</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Welcome Message */}
            {!currentQuestion && (
              <div className="p-12 text-center bg-white shadow-lg rounded-2xl">
                <Brain className="w-16 h-16 mx-auto mb-6 text-indigo-400" />
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  Ready to Practice?
                </h3>
                <p className="max-w-md mx-auto mb-6 text-gray-600">
                  Select your technology and experience level to start practicing with our AI interviewer. 
                  Get instant feedback and improve your interview skills!
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Instant Feedback</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Personalized Questions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Progress Tracking</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center space-x-2 max-w-md ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="flex-shrink-0 w-5 h-5" />
          ) : (
            <AlertCircle className="flex-shrink-0 w-5 h-5" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}
    </div>
  );
};