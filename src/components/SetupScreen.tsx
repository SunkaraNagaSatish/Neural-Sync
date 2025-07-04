import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Briefcase, Building2, Calendar, ArrowRight, AlertCircle, CheckCircle, Loader, Info, Zap, Brain } from 'lucide-react';
import { parsePDF, validatePDFFile, extractTextFromPDFAlternative, testPDFJSAvailability } from '../services/pdfParser';
import { MeetingContext } from '../types';

const MEETING_TYPES = [
  'Initial Screening',
  'Technical Interview',
  'Behavioral Interview',
  'Panel Interview',
  'Final Round',
  'HR Discussion',
  'Culture Fit Interview'
];

export const SetupScreen: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    meetingType: '',
    resumeText: ''
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    
    try {
      if (validateForm()) {
        // Create the meeting context
        const meetingContext: MeetingContext = {
          jobTitle: formData.jobTitle.trim(),
          companyName: formData.companyName.trim(),
          jobDescription: formData.jobDescription.trim(),
          meetingType: formData.meetingType,
          resumeText: formData.resumeText.trim()
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Neural Sync
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Lightning-fast AI interview assistant. Get instant, accurate responses powered by advanced neural networks.
          </p>
          <div className="flex items-center justify-center mt-4 space-x-2 text-sm text-indigo-600">
            <Zap className="w-4 h-4" />
            <span className="font-medium">Ultra-Fast Response • Real-time Processing • AI-Powered</span>
          </div>
        </div>

        {/* Setup Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Resume Upload */}
            <div className="space-y-3">
              <label className="flex items-center text-lg font-semibold text-gray-900">
                <FileText className="w-5 h-5 mr-2" />
                Resume Upload
              </label>

              {/* PDF.js Status Warning */}
              {pdfJSAvailable === false && (
                <div className="flex items-start p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <Info className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-amber-800 font-medium">PDF processing is limited</p>
                    <p className="text-amber-700 mt-1">
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
                      <Loader className="w-12 h-12 text-indigo-500 mb-4 animate-spin" />
                      <p className="text-indigo-600 font-medium">Processing PDF...</p>
                      {parseProgress && (
                        <p className="text-gray-500 text-sm mt-2">{parseProgress}</p>
                      )}
                    </div>
                  ) : parseSuccess && resumeFile ? (
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                      <p className="text-green-600 font-medium">{resumeFile.name}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Successfully parsed • {Math.round(formData.resumeText.length / 1000)}k characters
                      </p>
                      <p className="text-gray-400 text-xs mt-2">Click to upload a different file</p>
                    </div>
                  ) : resumeFile ? (
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-indigo-500 mb-4" />
                      <p className="text-indigo-600 font-medium">{resumeFile.name}</p>
                      <p className="text-gray-500 text-sm mt-1">Ready to process</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 font-medium">Upload your resume (PDF)</p>
                      <p className="text-gray-400 text-sm mt-1">Click here or drag and drop</p>
                      <p className="text-gray-400 text-xs mt-2">Maximum file size: 10MB</p>
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors resize-none text-sm"
                    placeholder="Paste your resume content here... Include your experience, skills, education, etc."
                  />
                )}
              </div>

              {errors.resume && (
                <div className="flex items-start text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{errors.resume}</span>
                </div>
              )}
              {parseSuccess && (
                <div className="flex items-center text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Resume content ready for use!</span>
                </div>
              )}
            </div>

            {/* Job Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center text-lg font-semibold text-gray-900">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                  placeholder="e.g., Senior Software Engineer"
                />
                {errors.jobTitle && (
                  <div className="flex items-center text-red-600 text-sm">
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                  placeholder="e.g., Google, Microsoft, Startup Inc."
                />
                {errors.companyName && (
                  <div className="flex items-center text-red-600 text-sm">
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
              >
                <option value="">Select meeting type</option>
                {MEETING_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.meetingType && (
                <div className="flex items-center text-red-600 text-sm">
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors resize-none"
                placeholder="Paste the job description here..."
              />
              {errors.jobDescription && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.jobDescription}
                </div>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="flex items-center text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{errors.submit}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isParsingPDF || isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg"
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
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};