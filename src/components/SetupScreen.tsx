import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Briefcase, Building2, Calendar, ArrowRight, AlertCircle, CheckCircle, Loader, Info, Zap, Brain, Target } from 'lucide-react';
import { parsePDF, validatePDFFile, extractTextFromPDFAlternative, testPDFJSAvailability } from '../services/pdfParser';
import { MeetingContext } from '../types';
import { usePremium } from '../contexts/PremiumContext';

const MEETING_TYPES = [
  'Initial Screening',
  'Technical Interview',
  'Behavioral Interview',
  'Panel Interview',
  'Final Round',
  'HR Discussion',
  'Culture Fit Interview'
];

// Predefined data for premium users
const PREMIUM_USER_DATA = {
  jobTitle: 'React JS Developer',
  companyName: 'Google',
  jobDescription: 'React JS Developer with more than 3 years of experience. Looking for candidates with strong expertise in modern React development, state management, and frontend technologies.',
  meetingType: 'Technical Interview',
  resumeText: `Experienced React JS Developer with 3+ years of expertise in building scalable web applications.

TECHNICAL SKILLS:
• Frontend: HTML, CSS, JavaScript, React.js, Next.js, TypeScript, Tailwind CSS, Material UI, Bootstrap
• State Management: Redux, Context API, Redux Saga
• Simulation Tools: Mirage.js
• Version Control: Git, GitHub
• Testing & Deployment: Jest, React Testing Library, CI/CD Pipelines
• UI/UX Design: Figma
• Performance Optimization: Lazy Loading, Code Splitting, Server-Side Rendering (SSR)
• Tools & Technologies: Agile/Scrum, Jira, API Integration
• Expertise: Web Services (REST), Responsive Web Design

EXPERIENCE:
• 3+ years of professional React development experience
• Built and maintained multiple production-grade React applications
• Expertise in modern React patterns including hooks, context, and functional components
• Strong experience with TypeScript for type-safe development
• Proficient in state management solutions including Redux and Context API
• Experience with testing frameworks and CI/CD deployment pipelines
• Skilled in responsive design and cross-browser compatibility
• API integration and RESTful web services experience`,
  keySkills: 'Frontend: HTML, CSS, JavaScript, React.js, Next.js, TypeScript, Tailwind CSS, Material UI, Bootstrap. State Management: Redux, Context API, Redux Saga. Simulation Tools: Mirage.js. Version Control: Git, GitHub. Testing & Deployment: Jest, React Testing Library, CI/CD Pipelines. UI/UX Design: Figma. Performance Optimization: Lazy Loading, Code Splitting, Server-Side Rendering (SSR). Tools & Technologies: Agile/Scrum, Jira, API Integration. Expertise: Web Services (REST), Responsive Web Design.'
};

// Storage keys for persistent data
const STORAGE_KEYS = {
  PREMIUM_CONTEXT: 'neural_sync_premium_context',
  PREMIUM_AUTO_SETUP: 'neural_sync_premium_auto_setup'
};

export const SetupScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isPremium } = usePremium();
  
  // Initialize form data - auto-populate for premium users
  const [formData, setFormData] = useState(() => {
    if (isPremium) {
      // For premium users, use predefined data
      return PREMIUM_USER_DATA;
    }
    return {
      jobTitle: '',
      companyName: '',
      jobDescription: '',
      meetingType: '',
      resumeText: '',
      keySkills: '' // NEW: Key skills field
    };
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isParsingPDF, setIsParsingPDF] = useState(false);
  const [parseProgress, setParseProgress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [parseSuccess, setParseSuccess] = useState(false);
  const [pdfJSAvailable, setPdfJSAvailable] = useState<boolean | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Test PDF.js availability on component mount
  useEffect(() => {
    const checkPDFJS = async () => {
      const isAvailable = await testPDFJSAvailability();
      setPdfJSAvailable(isAvailable);
      if (!isAvailable) {
        console.warn('PDF.js is not available, will show manual input option');
      }
    };
    
    checkPDFJS();
  }, []);

  // Auto-navigate premium users directly to meeting screen
  useEffect(() => {
    if (isPremium) {
      // Set parseSuccess to true for premium users since they have predefined data
      setParseSuccess(true);
      
      // Create meeting context with predefined data
      const meetingContext: MeetingContext = {
        jobTitle: PREMIUM_USER_DATA.jobTitle,
        companyName: PREMIUM_USER_DATA.companyName,
        jobDescription: PREMIUM_USER_DATA.jobDescription,
        meetingType: PREMIUM_USER_DATA.meetingType,
        resumeText: PREMIUM_USER_DATA.resumeText,
        keySkills: PREMIUM_USER_DATA.keySkills
      };
      
      // Store in both localStorage (persistent) and sessionStorage (for compatibility)
      localStorage.setItem(STORAGE_KEYS.PREMIUM_CONTEXT, JSON.stringify(meetingContext));
      sessionStorage.setItem('neural_sync_meeting_context', JSON.stringify(meetingContext));
      
      // Auto-navigate to meeting screen after a short delay
      const timer = setTimeout(() => {
        console.log('Auto-navigating premium user to meeting screen with predefined data');
        navigate('/meeting', { 
          state: { context: meetingContext },
          replace: true 
        });
      }, 1000); // 1 second delay to show the setup screen briefly
      
      return () => clearTimeout(timer);
    }
  }, [isPremium, navigate]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset previous states
    setParseSuccess(false);
    setErrors(prev => ({ ...prev, resume: '' }));

    // Validate file first
    const validation = validatePDFFile(file);
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, resume: validation.error || 'Invalid file' }));
      return;
    }

    setResumeFile(file);
    setIsParsingPDF(true);
    setParseProgress('Preparing to parse PDF...');

    try {
      let text = '';
      
      if (pdfJSAvailable) {
        setParseProgress('Loading PDF document...');
        text = await parsePDF(file);
      } else {
        setParseProgress('Using alternative text extraction...');
        text = await extractTextFromPDFAlternative(file);
      }
      
      setParseProgress('Processing complete!');
      setFormData(prev => ({ ...prev, resumeText: text }));
      setParseSuccess(true);
      
      // Clear progress after a short delay
      setTimeout(() => {
        setParseProgress('');
      }, 2000);
      
    } catch (error) {
      console.error('PDF parsing failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse PDF. Please try again.';
      setErrors(prev => ({ 
        ...prev, 
        resume: `${errorMessage} You can also enter your resume text manually below.`
      }));
      setResumeFile(null);
      setFormData(prev => ({ ...prev, resumeText: '' }));
      setShowManualInput(true);
    } finally {
      setIsParsingPDF(false);
    }
  };

  const handleManualResumeInput = (text: string) => {
    setFormData(prev => ({ ...prev, resumeText: text }));
    if (text.trim().length > 50) {
      setParseSuccess(true);
      setErrors(prev => ({ ...prev, resume: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = 'Job description is required';
    }
    if (!formData.meetingType.trim()) {
      newErrors.meetingType = 'Meeting type is required';
    }
    if (!formData.resumeText.trim()) {
      newErrors.resume = 'Please upload your resume or enter resume text manually';
    } else if (formData.resumeText.trim().length < 50) {
      newErrors.resume = 'Resume text is too short. Please provide more details.';
    }
    if (!formData.keySkills.trim()) {
      newErrors.keySkills = 'Please enter your key skills for better AI responses';
    } else if (formData.keySkills.trim().length < 10) {
      newErrors.keySkills = 'Please provide more detailed key skills (at least 10 characters)';
    }
    if (!formData.keySkills.trim()) {
      newErrors.keySkills = 'Please enter your key skills for better AI responses';
    } else if (formData.keySkills.trim().length < 10) {
      newErrors.keySkills = 'Please provide more detailed key skills (at least 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    
    try {
      if (validateForm()) {
        // Create the meeting context with key skills
        // Create the meeting context with key skills
        const meetingContext: MeetingContext = {
          jobTitle: formData.jobTitle.trim(),
          companyName: formData.companyName.trim(),
          jobDescription: formData.jobDescription.trim(),
          meetingType: formData.meetingType,
          resumeText: formData.resumeText.trim(),
          keySkills: formData.keySkills.trim() // NEW: Include key skills
        };
        
        console.log('Navigating to meeting with context:', meetingContext);
        
        // Save context to session storage for MeetingScreen reload support
        sessionStorage.setItem('neural_sync_meeting_context', JSON.stringify(meetingContext));
        // Navigate with context
        navigate('/meeting', { 
          state: { context: meetingContext },
          replace: true 
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to start meeting. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-4 text-5xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
            Neural Sync
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Lightning-fast AI interview assistant. Get instant, accurate responses powered by advanced neural networks.
          </p>
          <div className="flex items-center justify-center mt-4 space-x-2 text-sm text-indigo-600">
            <Zap className="w-4 h-4" />
            <span className="font-medium">Ultra-Fast Response • Real-time Processing • AI-Powered</span>
          </div>
        </div>

        {/* Setup Form */}
        <div className="p-8 border shadow-2xl bg-white/80 backdrop-blur-sm rounded-3xl border-white/20 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Resume Upload */}
            <div className="space-y-3">
              <label className="flex items-center text-lg font-semibold text-gray-900">
                <FileText className="w-5 h-5 mr-2" />
                Resume Upload
              </label>

              {/* PDF.js Status Warning */}
              {pdfJSAvailable === false && (
                <div className="flex items-start p-4 border rounded-lg bg-amber-50 border-amber-200">
                  <Info className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">PDF processing is limited</p>
                    <p className="mt-1 text-amber-700">
                      You can still upload a PDF, but text extraction may be limited. 
                      For best results, consider entering your resume text manually below.
                    </p>
                  </div>
                </div>
              )}

              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                parseSuccess ? 'border-green-400 bg-green-50' : 
                errors.resume ? 'border-red-400 bg-red-50' : 
                'border-gray-300 hover:border-indigo-400'
              }`}>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                  disabled={isParsingPDF}
                />
                <label
                  htmlFor="resume-upload"
                  className={`cursor-pointer flex flex-col items-center ${isParsingPDF ? 'pointer-events-none' : ''}`}
                >
                  {isParsingPDF ? (
                    <div className="text-center">
                      <Loader className="w-12 h-12 mb-4 text-indigo-500 animate-spin" />
                      <p className="font-medium text-indigo-600">Processing PDF...</p>
                      {parseProgress && (
                        <p className="mt-2 text-sm text-gray-500">{parseProgress}</p>
                      )}
                    </div>
                  ) : parseSuccess && resumeFile ? (
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 mb-4 text-green-500" />
                      <p className="font-medium text-green-600">{resumeFile.name}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Successfully parsed • {Math.round(formData.resumeText.length / 1000)}k characters
                      </p>
                      <p className="mt-2 text-xs text-gray-400">Click to upload a different file</p>
                    </div>
                  ) : resumeFile ? (
                    <div className="text-center">
                      <FileText className="w-12 h-12 mb-4 text-indigo-500" />
                      <p className="font-medium text-indigo-600">{resumeFile.name}</p>
                      <p className="mt-1 text-sm text-gray-500">Ready to process</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 mb-4 text-gray-400" />
                      <p className="font-medium text-gray-600">Upload your resume (PDF)</p>
                      <p className="mt-1 text-sm text-gray-400">Click here or drag and drop</p>
                      <p className="mt-2 text-xs text-gray-400">Maximum file size: 10MB</p>
                    </div>
                  )}
                </label>
              </div>

              {/* Manual Resume Input */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Or enter your resume text manually:
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowManualInput(!showManualInput)}
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    {showManualInput ? 'Hide' : 'Show'} manual input
                  </button>
                </div>
                {(showManualInput || !parseSuccess) && (
                  <textarea
                    value={formData.resumeText}
                    onChange={(e) => handleManualResumeInput(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 text-sm transition-colors border border-gray-300 resize-none rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="Paste your resume content here... Include your experience, skills, education, etc."
                  />
                )}
              </div>

              {errors.resume && (
                <div className="flex items-start p-3 text-sm text-red-600 rounded-lg bg-red-50">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{errors.resume}</span>
                </div>
              )}
              {parseSuccess && (
                <div className="flex items-center p-3 text-sm text-green-600 rounded-lg bg-green-50">
                  <CheckCircle className="flex-shrink-0 w-4 h-4 mr-2" />
                  <span>Resume content ready for use!</span>
                </div>
              )}
            </div>

            {/* NEW: Key Skills Input */}
            <div className="space-y-3">
              <label className="flex items-center text-lg font-semibold text-gray-900">
                <Target className="w-5 h-5 mr-2" />
                Key Skills & Technologies
                <span className="px-2 py-1 ml-2 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full">
                  Important for AI
                </span>
              </label>
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <p className="mb-3 text-sm text-blue-800">
                  <strong>Why this matters:</strong> When you ask incomplete questions like "diff between let and const", 
                  the AI will use these skills to provide relevant, context-aware answers.
                </p>
                <p className="text-xs text-blue-600">
                  Example: "JavaScript, React, Node.js, Python, SQL, AWS, Git, REST APIs, MongoDB"
                </p>
              </div>
              <textarea
                value={formData.keySkills}
                onChange={(e) => setFormData(prev => ({ ...prev, keySkills: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 transition-colors border border-gray-300 resize-none rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="List your key skills, technologies, and areas of expertise (e.g., JavaScript, React, Python, AWS, Machine Learning, etc.)"
              />
              {errors.keySkills && (
                <div className="flex items-center text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.keySkills}
                </div>
              )}
            </div>

            {/* Job Details Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <label className="flex items-center text-lg font-semibold text-gray-900">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="e.g., Senior Software Engineer"
                />
                {errors.jobTitle && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.jobTitle}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="flex items-center text-lg font-semibold text-gray-900">
                  <Building2 className="w-5 h-5 mr-2" />
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="e.g., Google, Microsoft, Startup Inc."
                />
                {errors.companyName && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.companyName}
                  </div>
                )}
              </div>
            </div>

            {/* Meeting Type */}
            <div className="space-y-3">
              <label className="flex items-center text-lg font-semibold text-gray-900">
                <Calendar className="w-5 h-5 mr-2" />
                Meeting Type
              </label>
              <select
                value={formData.meetingType}
                onChange={(e) => setFormData(prev => ({ ...prev, meetingType: e.target.value }))}
                className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">Select meeting type</option>
                {MEETING_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.meetingType && (
                <div className="flex items-center text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.meetingType}
                </div>
              )}
            </div>

            {/* Job Description */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-gray-900">
                Job Description
              </label>
              <textarea
                value={formData.jobDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                rows={6}
                className="w-full px-4 py-3 transition-colors border border-gray-300 resize-none rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="Paste the job description here..."
              />
              {errors.jobDescription && (
                <div className="flex items-center text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.jobDescription}
                </div>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="flex items-center p-3 text-sm text-red-600 rounded-lg bg-red-50">
                <AlertCircle className="flex-shrink-0 w-4 h-4 mr-2" />
                <span>{errors.submit}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isParsingPDF || isSubmitting}
              className="flex items-center justify-center w-full px-8 py-4 font-semibold text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Starting Neural Sync Session...
                </>
              ) : isParsingPDF ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Processing Resume...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Start Neural Sync Session
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
