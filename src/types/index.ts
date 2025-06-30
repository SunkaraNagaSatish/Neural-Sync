export interface MeetingContext {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  meetingType: string;
  resumeText: string;
}

export interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: Date;
  confidence?: number;
}

export interface AIResponse {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
}

export interface MeetingSession {
  context: MeetingContext;
  transcript: TranscriptEntry[];
  aiResponses: AIResponse[];
  startTime: Date;
  isRecording: boolean;
}