export interface MeetingContext {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  meetingType: string;
  resumeText: string;
  keySkills: string;
}

export interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: Date;
  confidence?: number;
}

// For code responses, explanation is required
export interface AIResponse {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
  explanation?: string; // Only for code responses
}

export interface MeetingSession {
  context: MeetingContext;
  transcript: TranscriptEntry[];
  aiResponses: AIResponse[];
  startTime: Date;
  isRecording: boolean;
}