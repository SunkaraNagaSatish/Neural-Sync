import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyBX-cs-LMrflp5UxNGU7rQaswI9o-gwuE8';
let genAI: GoogleGenerativeAI | null = null;

// Auto-initialize
try {
  genAI = new GoogleGenerativeAI(API_KEY);
} catch (error) {
  console.error('Failed to initialize AI Interview Service:', error);
}

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

export const generateInterviewQuestion = async (
  technology: string,
  experienceLevel: string
): Promise<Question> => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 200,
      }
    });

    const prompt = `Generate a realistic interview question for a ${experienceLevel} ${technology} position.

Requirements:
- Make it appropriate for ${experienceLevel} level
- Focus on ${technology} specifically
- Make it realistic and commonly asked
- Avoid overly complex or theoretical questions for entry level
- For senior level, include system design or leadership aspects

Return ONLY the question text, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const questionText = response.text().trim();

    // Determine category and difficulty based on content and level
    let category = 'Technical';
    if (questionText.toLowerCase().includes('team') || questionText.toLowerCase().includes('lead')) {
      category = 'Leadership';
    } else if (questionText.toLowerCase().includes('challenge') || questionText.toLowerCase().includes('difficult')) {
      category = 'Behavioral';
    } else if (questionText.toLowerCase().includes('design') || questionText.toLowerCase().includes('architecture')) {
      category = 'System Design';
    }

    const difficulty = experienceLevel === 'Entry Level' ? 'Easy' : 
                     experienceLevel === 'Mid Level' ? 'Medium' : 'Hard';

    return {
      id: Date.now().toString(),
      text: questionText,
      category,
      difficulty
    };

  } catch (error) {
    console.error('Error generating interview question:', error);
    
    // Fallback questions based on technology and level
    const fallbackQuestions = {
      'Entry Level': {
        'JavaScript': 'Can you explain the difference between let, const, and var in JavaScript?',
        'Python': 'What are the main differences between lists and tuples in Python?',
        'React': 'What is the difference between props and state in React?',
        'default': 'Tell me about a recent project you worked on and the technologies you used.'
      },
      'Mid Level': {
        'JavaScript': 'How would you optimize the performance of a JavaScript application?',
        'Python': 'Explain how you would handle error handling and logging in a Python application.',
        'React': 'How would you manage state in a large React application?',
        'default': 'Describe a challenging technical problem you solved and your approach.'
      },
      'Senior Level': {
        'JavaScript': 'How would you design a scalable JavaScript architecture for a large team?',
        'Python': 'Design a system for processing millions of data records efficiently in Python.',
        'React': 'How would you architect a React application for optimal performance and maintainability?',
        'default': 'How do you approach technical decision-making and trade-offs in system design?'
      }
    };

    const levelQuestions = fallbackQuestions[experienceLevel as keyof typeof fallbackQuestions] || fallbackQuestions['Mid Level'];
    const questionText = levelQuestions[technology as keyof typeof levelQuestions] || levelQuestions.default;

    return {
      id: Date.now().toString(),
      text: questionText,
      category: 'Technical',
      difficulty: experienceLevel === 'Entry Level' ? 'Easy' : 
                 experienceLevel === 'Mid Level' ? 'Medium' : 'Hard'
    };
  }
};

export const evaluateAnswer = async (
  question: Question,
  answer: string,
  technology: string,
  experienceLevel: string
): Promise<Evaluation> => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500,
      }
    });

    const prompt = `Evaluate this interview answer for a ${experienceLevel} ${technology} position.

QUESTION: ${question.text}

ANSWER: ${answer}

Provide evaluation in this exact format:

SCORE: [number from 1-10]

FEEDBACK: [2-3 sentences of overall feedback]

STRENGTHS:
- [strength 1]
- [strength 2]
- [strength 3 if applicable]

IMPROVEMENTS:
- [improvement 1]
- [improvement 2]
- [improvement 3 if applicable]

Consider:
- Technical accuracy
- Communication clarity
- Depth appropriate for ${experienceLevel} level
- Specific examples and details
- Problem-solving approach`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response
    const scoreMatch = text.match(/SCORE:\s*(\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 5;

    const feedbackMatch = text.match(/FEEDBACK:\s*(.*?)(?=STRENGTHS:|$)/s);
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'Good effort on answering the question.';

    const strengthsMatch = text.match(/STRENGTHS:\s*(.*?)(?=IMPROVEMENTS:|$)/s);
    const strengthsText = strengthsMatch ? strengthsMatch[1] : '';
    const strengths = strengthsText
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace('-', '').trim())
      .filter(strength => strength.length > 0);

    const improvementsMatch = text.match(/IMPROVEMENTS:\s*(.*?)$/s);
    const improvementsText = improvementsMatch ? improvementsMatch[1] : '';
    const improvements = improvementsText
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace('-', '').trim())
      .filter(improvement => improvement.length > 0);

    return {
      score: Math.max(1, Math.min(10, score)), // Ensure score is between 1-10
      feedback,
      strengths: strengths.length > 0 ? strengths : ['Provided a clear response to the question'],
      improvements: improvements.length > 0 ? improvements : ['Consider providing more specific examples']
    };

  } catch (error) {
    console.error('Error evaluating answer:', error);
    
    // Fallback evaluation
    const wordCount = answer.split(' ').length;
    const hasExamples = answer.toLowerCase().includes('example') || answer.toLowerCase().includes('project');
    
    let score = 5;
    if (wordCount > 100 && hasExamples) score = 7;
    if (wordCount > 200 && hasExamples) score = 8;
    if (wordCount < 50) score = 4;

    return {
      score,
      feedback: 'Your answer shows understanding of the topic. Consider providing more specific examples and details to strengthen your response.',
      strengths: [
        'Addressed the main question',
        'Demonstrated basic understanding'
      ],
      improvements: [
        'Provide more specific examples',
        'Add more technical details',
        'Structure your response more clearly'
      ]
    };
  }
};