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

// ENHANCED: Optimized response generation with key skills context
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

    // ENHANCED: Smart question analysis and context-aware prompting
    const questionLower = lastQuestion.toLowerCase();
    const isIncompleteQuestion = lastQuestion.length < 20 || 
                                questionLower.includes('diff') || 
                                questionLower.includes('what is') ||
                                questionLower.includes('explain') ||
                                questionLower.includes('tell me') ||
                                questionLower.includes('how') ||
                                questionLower.includes('why');

    // Enhanced prompt with key skills integration for incomplete questions
    const prompt = `You are an expert interview coach helping a candidate respond professionally and confidently.

CANDIDATE PROFILE:
- Position: ${context.jobTitle}
- Company: ${context.companyName}
- Interview Type: ${context.meetingType}
- Key Skills & Technologies: ${context.keySkills}

CANDIDATE BACKGROUND (key highlights):
${context.resumeText.slice(0, 1200)}

INTERVIEWER'S QUESTION:
"${lastQuestion}"

${isIncompleteQuestion ? `
SPECIAL INSTRUCTION FOR INCOMPLETE QUESTION:
This appears to be an incomplete or brief question. Use the candidate's key skills (${context.keySkills}) to provide a relevant, comprehensive answer. If the question mentions technical terms like "let", "const", "diff", etc., relate your answer to the candidate's JavaScript/programming skills and provide practical examples.
` : ''}

INSTRUCTIONS:
- Provide a direct, professional response to the specific question asked
- Use relevant experience from the candidate's background when applicable
- Keep response conversational, confident, and authentic
- Structure answer clearly with specific examples if relevant
- Match the tone appropriate for ${context.meetingType}
- If the question is incomplete, use the key skills context to provide a comprehensive answer
- For technical questions, relate to the candidate's expertise in: ${context.keySkills}
- Aim for 2-4 sentences that directly address the question

Generate a natural, professional response:`;

    console.log('Neural Sync generating optimized response...');
    const startTime = Date.now();
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const endTime = Date.now();
    console.log(`Neural Sync response generated in ${endTime - startTime}ms`);
    
    // Enhanced fallback responses based on question type and key skills
    if (!text || text.length < 20) {
      const questionLower = lastQuestion.toLowerCase();
      
      if (questionLower.includes('yourself') || questionLower.includes('background')) {
        return `I'm a dedicated ${context.jobTitle} with strong experience in ${context.keySkills}. I'm particularly excited about this opportunity at ${context.companyName} because it aligns perfectly with my expertise in these technologies and allows me to contribute my skills while continuing to grow professionally.`;
      } else if (questionLower.includes('strength') || questionLower.includes('skills')) {
        return `One of my key strengths is my expertise in ${context.keySkills}. I've consistently delivered successful projects by combining these technical skills with strong problem-solving abilities and effective collaboration. My experience with these technologies has enabled me to adapt quickly to new challenges.`;
      } else if (questionLower.includes('why') && questionLower.includes('company')) {
        return `I'm drawn to ${context.companyName} because of your innovative approach and the opportunity to work with technologies I'm passionate about, including ${context.keySkills}. This role represents an excellent opportunity to contribute to meaningful projects while working with a talented team.`;
      } else if (questionLower.includes('diff') || questionLower.includes('difference')) {
        // Handle incomplete technical questions using key skills
        const skills = context.keySkills.toLowerCase();
        if (skills.includes('javascript') || skills.includes('js')) {
          return "Based on my JavaScript experience, I can explain the key differences. For example, if you're asking about 'let' vs 'const' vs 'var', the main differences are in scope, hoisting behavior, and reassignment capabilities. 'Let' and 'const' are block-scoped, while 'var' is function-scoped. 'Const' prevents reassignment, while 'let' allows it.";
        } else if (skills.includes('react')) {
          return "In my React experience, I've worked with many concepts that have important differences. For instance, props vs state, functional vs class components, or controlled vs uncontrolled components. Could you specify which comparison you'd like me to elaborate on?";
        } else {
          return `Based on my experience with ${context.keySkills}, I can explain various technical differences. Could you provide more context about which specific concepts you'd like me to compare?`;
        }
      }
      
      return `That's an excellent question. Based on my experience with ${context.keySkills} and background in ${context.jobTitle}, I believe I can provide valuable insights. Could you provide a bit more context so I can give you the most relevant and detailed answer?`;
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

// ENHANCED: Generate code response for technical questions with better context awareness
export const generateCodeResponse = async (
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
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", // Use more capable model for code generation
      generationConfig: {
        temperature: 0.2, // Lower temperature for more consistent code
        topK: 10,
        topP: 0.8,
        maxOutputTokens: 800, // More tokens for comprehensive code examples
        candidateCount: 1,
      }
    });

    const lastQuestion = recentTranscript.length > 0 
      ? recentTranscript[recentTranscript.length - 1].text 
      : '';

    // Determine the primary technology from key skills and job title
    const keySkillsLower = context.keySkills.toLowerCase();
    const jobTitleLower = context.jobTitle.toLowerCase();
    const questionLower = lastQuestion.toLowerCase();
    
    let primaryTech = 'JavaScript';
    if (keySkillsLower.includes('react') || jobTitleLower.includes('react') || questionLower.includes('react')) {
      primaryTech = 'React.js';
    } else if (keySkillsLower.includes('python') || jobTitleLower.includes('python') || questionLower.includes('python')) {
      primaryTech = 'Python';
    } else if (keySkillsLower.includes('java') && !keySkillsLower.includes('javascript') || jobTitleLower.includes('java') || questionLower.includes('java')) {
      primaryTech = 'Java';
    } else if (keySkillsLower.includes('node') || jobTitleLower.includes('node') || questionLower.includes('node')) {
      primaryTech = 'Node.js';
    } else if (keySkillsLower.includes('angular') || jobTitleLower.includes('angular') || questionLower.includes('angular')) {
      primaryTech = 'Angular';
    } else if (keySkillsLower.includes('vue') || jobTitleLower.includes('vue') || questionLower.includes('vue')) {
      primaryTech = 'Vue.js';
    }

    // Enhanced prompt specifically designed for code generation with key skills context
    const prompt = `You are a senior software engineer providing code examples for technical interview questions.

CANDIDATE PROFILE:
- Position: ${context.jobTitle}
- Company: ${context.companyName}
- Primary Technology: ${primaryTech}
- Key Skills: ${context.keySkills}

CANDIDATE BACKGROUND:
${context.resumeText.slice(0, 800)}

INTERVIEWER'S QUESTION:
"${lastQuestion}"

INSTRUCTIONS FOR CODE GENERATION:
1. Analyze if this question requires a code implementation or example
2. If it's a coding question, provide clean, production-ready code
3. Use ${primaryTech} as the primary language/framework unless the question specifies otherwise
4. Consider the candidate's key skills: ${context.keySkills}
5. For React.js questions, provide functional components with hooks
6. Include proper imports, exports, and TypeScript types when applicable
7. Add clear comments explaining complex logic
8. Format code with proper indentation and structure
9. If it's not a coding question, respond with "This question doesn't require a code implementation."

SPECIFIC GUIDELINES:
- For React questions: Use functional components, hooks (useState, useEffect, etc.), and modern React patterns
- For JavaScript questions: Use ES6+ syntax, async/await, and modern JavaScript features
- For Python questions: Use clean, Pythonic code with proper error handling
- For algorithm questions: Provide optimized solutions with time/space complexity analysis
- For system design questions: Provide architectural code examples or pseudocode

Generate a comprehensive code example:`;

    console.log('Neural Sync generating code response...');
    const startTime = Date.now();
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const endTime = Date.now();
    console.log(`Neural Sync code response generated in ${endTime - startTime}ms`);
    
    // Enhanced detection for code-worthy questions
    const codeKeywords = [
      // General coding terms
      'code', 'implement', 'function', 'algorithm', 'write', 'program', 'solve', 'debug', 'optimize',
      // React-specific terms
      'react', 'component', 'jsx', 'hook', 'usestate', 'useeffect', 'props', 'state', 'render',
      // JavaScript terms
      'javascript', 'js', 'async', 'await', 'promise', 'callback', 'closure', 'prototype',
      // General programming terms
      'class', 'method', 'api', 'database', 'query', 'script', 'logic', 'syntax', 'framework', 'library',
      // Data structures and algorithms
      'array', 'object', 'loop', 'recursion', 'sort', 'search', 'tree', 'graph', 'hash',
      // Web development
      'html', 'css', 'dom', 'event', 'fetch', 'axios', 'rest', 'graphql'
    ];
    
    const isCodeQuestion = codeKeywords.some(keyword => questionLower.includes(keyword)) ||
                          context.keySkills.toLowerCase().split(',').some(skill => 
                            questionLower.includes(skill.trim().toLowerCase())
                          );
    
    if (!isCodeQuestion) {
      return "This question doesn't require a code implementation. It appears to be a conceptual or behavioral question that would be better answered with an explanation rather than code.";
    }
    
    if (!text || text.length < 50) {
      // Provide fallback code examples based on key skills
      if (keySkillsLower.includes('react')) {
        return `// React.js Example Component based on your skills
import React, { useState, useEffect } from 'react';

const ExampleComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data or perform side effects
    const fetchData = async () => {
      try {
        setLoading(true);
        // Your API call here
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Data Display</h2>
      {data.map((item, index) => (
        <div key={index}>
          {/* Render your data here */}
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default ExampleComponent;`;
      } else if (keySkillsLower.includes('python')) {
        return `# Python Example based on your skills
def example_function(input_data):
    """
    Example function demonstrating Python best practices
    """
    try:
        # Your logic here based on the specific requirements
        processed_data = process_input(input_data)
        return processed_data
    except Exception as error:
        print(f"Error: {error}")
        return None

def process_input(data):
    # Implementation based on your specific requirements
    return [item.upper() for item in data if isinstance(item, str)]

# Usage example
if __name__ == "__main__":
    sample_data = ["hello", "world", 123, "python"]
    result = example_function(sample_data)
    print(result)`;
      } else {
        return `// JavaScript Example based on your skills
function exampleFunction(input) {
  // Implementation based on your specific requirements
  try {
    // Your logic here
    return processInput(input);
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

function processInput(input) {
  // Process the input based on requirements
  return input.filter(item => item !== null && item !== undefined);
}

// Usage example
const result = exampleFunction(inputData);
console.log(result);`;
      }
    }
    
    return text;
    
  } catch (error) {
    console.error('Neural Sync code generation error:', error);
    return "Unable to generate code at this time due to a technical error. Please try rephrasing your question or try again in a moment.";
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
Key Skills: ${context.keySkills}
Recent conversation: ${recentTranscript || 'Interview starting'}

CANDIDATE BACKGROUND:
${context.resumeText.slice(0, 600)}

Provide tips that are:
- Specific to this role and company
- Based on the conversation context and key skills
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
      `Highlight your expertise in ${context.keySkills} with specific examples`,
      "Ask thoughtful questions about the team structure and daily responsibilities",
      "Provide concrete examples with measurable results from your background",
      "Show genuine enthusiasm for the company's mission and values",
      "Prepare follow-up questions that demonstrate your research about the company"
    ];
    
  } catch (error) {
    console.error('Tips generation error:', error);
    return [
      `Stay confident and reference your experience with ${context.keySkills}`,
      "Ask insightful questions about the role and company culture",
      "Provide specific examples that demonstrate your technical skills",
      "Show enthusiasm and genuine interest in the opportunity",
      "Prepare thoughtful questions about the team and challenges"
    ];
  }
};

// Generate a direct answer to a question for the demo
export async function generateGeminiAnswer(question: string, tech: string, level: string): Promise<string> {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-8b",
      generationConfig: {
        temperature: 0.6,
        topK: 15,
        topP: 0.85,
        maxOutputTokens: 250,
        candidateCount: 1,
      }
    });
    const prompt = `You are an expert interviewer. Answer the following question for a ${level} ${tech} candidate:\n\n${question}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text && text.length > 0 ? text : 'Sorry, I could not generate an answer.';
  } catch (error) {
    return 'Sorry, there was an error generating the answer.';
  }
}

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