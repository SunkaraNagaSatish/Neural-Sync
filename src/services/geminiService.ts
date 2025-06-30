import { GoogleGenerativeAI } from '@google/generative-ai';
import { MeetingContext, TranscriptEntry } from '../types';

// Initialize with your API key for instant access
const API_KEY = 'AIzaSyBX-cs-LMrflp5UxNGU7rQaswI9o-gwuE8';
let genAI: GoogleGenerativeAI | null = null;

// Auto-initialize on module load for instant readiness
try {
  genAI = new GoogleGenerativeAI(API_KEY);
  console.log('Neural Sync AI auto-initialized successfully');
} catch (error) {
  console.error('Failed to auto-initialize Neural Sync AI:', error);
}

export const initializeGemini = (apiKey?: string) => {
  try {
    const keyToUse = apiKey?.trim() || API_KEY;
    genAI = new GoogleGenerativeAI(keyToUse);
    console.log('Neural Sync AI initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Neural Sync AI:', error);
    throw new Error('Failed to initialize Neural Sync AI');
  }
};

// Optimized response generation with enhanced speed and accuracy
export const generateMeetingResponse = async (
  context: MeetingContext,
  recentTranscript: TranscriptEntry[]
): Promise<string> => {
  if (!genAI) {
    try {
      genAI = new GoogleGenerativeAI(API_KEY);
    } catch (error) {
      throw new Error('Neural Sync AI not available. Please check your connection.');
    }
  }

  try {
    // Use the fastest Gemini model with optimized settings for speed and accuracy
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-8b", // Fastest model available
      generationConfig: {
        temperature: 0.6, // Balanced creativity and consistency
        topK: 15, // Optimized for speed
        topP: 0.85, // Better quality responses
        maxOutputTokens: 250, // Optimal length for interview responses
        candidateCount: 1, // Single candidate for speed
      }
    });

    // Get the most recent question/conversation
    const lastQuestion = recentTranscript.length > 0 
      ? recentTranscript[recentTranscript.length - 1].text 
      : '';

    // Enhanced prompt for better accuracy and relevance
    const prompt = `You are an expert interview coach helping a candidate respond professionally and confidently.

CANDIDATE PROFILE:
- Position: ${context.jobTitle}
- Company: ${context.companyName}
- Interview Type: ${context.meetingType}

CANDIDATE BACKGROUND (key highlights):
${context.resumeText.slice(0, 1200)}

INTERVIEWER'S QUESTION:
"${lastQuestion}"

INSTRUCTIONS:
- Provide a direct, professional response to the specific question asked
- Use relevant experience from the candidate's background when applicable
- Keep response conversational, confident, and authentic
- Structure answer clearly with specific examples if relevant
- Match the tone appropriate for ${context.meetingType}
- Aim for 2-4 sentences that directly address the question

Generate a natural, professional response:`;

    console.log('Neural Sync generating optimized response...');
    const startTime = Date.now();
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const endTime = Date.now();
    console.log(`Neural Sync response generated in ${endTime - startTime}ms`);
    
    // Enhanced fallback responses based on question type
    if (!text || text.length < 20) {
      const questionLower = lastQuestion.toLowerCase();
      
      if (questionLower.includes('yourself') || questionLower.includes('background')) {
        return `I'm a dedicated ${context.jobTitle} with strong experience in the technologies and methodologies relevant to this role. I'm particularly excited about this opportunity at ${context.companyName} because it aligns perfectly with my career goals and allows me to contribute my skills while continuing to grow professionally.`;
      } else if (questionLower.includes('strength') || questionLower.includes('skills')) {
        return `One of my key strengths is my ability to quickly learn and adapt to new technologies while maintaining high-quality standards. I've consistently delivered successful projects by combining technical expertise with strong problem-solving skills and effective collaboration.`;
      } else if (questionLower.includes('why') && questionLower.includes('company')) {
        return `I'm drawn to ${context.companyName} because of your innovative approach and strong reputation in the industry. This role represents an excellent opportunity to contribute to meaningful projects while working with a talented team that shares my commitment to excellence.`;
      }
      
      return "That's an excellent question. Based on my experience and background, I believe I can bring valuable insights to this role. Could you provide a bit more context so I can give you the most relevant and detailed answer?";
    }
    
    return text;
    
  } catch (error) {
    console.error('Neural Sync AI error:', error);
    
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('api key not valid') || errorMessage.includes('api_key_invalid')) {
        throw new Error('API key issue detected. Please verify your Gemini API key.');
      } else if (errorMessage.includes('quota exceeded')) {
        throw new Error('API quota exceeded. Please wait a moment and try again.');
      } else if (errorMessage.includes('safety') || errorMessage.includes('blocked')) {
        return "I'd be happy to discuss that topic. Could you rephrase the question or provide more specific details about what you'd like to know?";
      } else if (errorMessage.includes('rate limit')) {
        throw new Error('Rate limit reached. Please wait a moment before trying again.');
      }
      
      throw new Error(`Neural Sync Error: ${error.message}`);
    }
    
    throw new Error('Failed to generate AI response. Please try again.');
  }
};

export const generateMeetingSummary = async (
  context: MeetingContext,
  fullTranscript: TranscriptEntry[]
): Promise<string> => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 600,
      }
    });

    const transcriptText = fullTranscript
      .map(entry => `[${entry.timestamp.toLocaleTimeString()}] ${entry.text}`)
      .join('\n');

    if (!transcriptText.trim()) {
      return "No transcript available to summarize. Please record some conversation first.";
    }

    const prompt = `Create a professional summary of this ${context.meetingType} for the ${context.jobTitle} position at ${context.companyName}.

MEETING TRANSCRIPT:
${transcriptText.slice(0, 3000)}

Provide a structured summary with:

## Meeting Overview
- Duration and type
- Key topics discussed

## Main Discussion Points
- Technical areas covered
- Important questions asked
- Candidate responses

## Key Highlights
- Strengths demonstrated
- Relevant experience shared
- Areas of mutual interest

## Next Steps
- Follow-up actions mentioned
- Timeline discussed

Keep it concise and professional.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text || "Unable to generate summary at this time.";
    
  } catch (error) {
    console.error('Summary generation error:', error);
    throw new Error('Failed to generate meeting summary. Please try again.');
  }
};

export const generateInterviewTips = async (
  context: MeetingContext,
  currentTranscript: TranscriptEntry[]
): Promise<string[]> => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 300,
      }
    });

    const recentTranscript = currentTranscript
      .slice(-3)
      .map(entry => entry.text)
      .join(' ');

    const prompt = `Generate 4-5 specific, actionable interview tips for a candidate in a ${context.meetingType} for ${context.jobTitle} at ${context.companyName}.

CONTEXT:
Role: ${context.jobTitle}
Company: ${context.companyName}
Recent conversation: ${recentTranscript || 'Interview starting'}

CANDIDATE BACKGROUND:
${context.resumeText.slice(0, 600)}

Provide tips that are:
- Specific to this role and company
- Based on the conversation context
- Confidence-building and actionable
- Professional and relevant

Format each tip as a bullet point starting with "•"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response into an array of tips
    const tips = text
      .split('\n')
      .filter(line => line.trim().startsWith('•'))
      .map(line => line.replace('•', '').trim())
      .filter(tip => tip.length > 0);
    
    return tips.length > 0 ? tips : [
      "Highlight your most relevant experience for this specific role",
      "Ask thoughtful questions about the team structure and daily responsibilities",
      "Provide concrete examples with measurable results from your background",
      "Show genuine enthusiasm for the company's mission and values",
      "Prepare follow-up questions that demonstrate your research about the company"
    ];
    
  } catch (error) {
    console.error('Tips generation error:', error);
    return [
      "Stay confident and reference your relevant experience",
      "Ask insightful questions about the role and company culture",
      "Provide specific examples that demonstrate your skills",
      "Show enthusiasm and genuine interest in the opportunity",
      "Prepare thoughtful questions about the team and challenges"
    ];
  }
};

// Optimized test function for faster connection verification
export const testGeminiConnection = async (): Promise<boolean> => {
  if (!genAI) {
    try {
      genAI = new GoogleGenerativeAI(API_KEY);
    } catch (error) {
      return false;
    }
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-8b",
      generationConfig: {
        maxOutputTokens: 5,
        temperature: 0,
      }
    });
    const result = await model.generateContent("Test");
    const response = await result.response;
    const text = response.text();
    return text.length > 0;
  } catch (error) {
    console.error('Neural Sync API test failed:', error);
    return false;
  }
};

// Check if API is ready
export const isGeminiReady = (): boolean => {
  return genAI !== null;
};