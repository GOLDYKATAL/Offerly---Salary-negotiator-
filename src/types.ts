export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange: { min: number; max: number; median: number };
  description: string;
  requirements: string[];
  benefits: string[];
}

export interface ChatMessage {
  sender: "user" | "recruiter";
  text: string;
  timestamp: string;
  score?: number; // Optional sentiment/effectiveness feedback
  feedback?: string;
}

export interface QAMessage {
  question: string;
  answer: string;
}

export interface CoachedState {
  currentStep: number;
  coachingPath: "full" | "review" | "practice";
  role: string;
  location: string;
  experience: string;
  experienceYears: number;
  currentSalary: number;
  targetSalary: number;
  
  // Offer Upload details
  offerCompany: string;
  offerSalary: number;
  offerEquity: string;
  offerBonus: string;
  offerText: string;
  
  // Job search
  selectedJobId: string | null;
  
  // Interactive screens state
  chatMessages: ChatMessage[];
  qaHistory: QAMessage[];
  emailTone: "confident" | "collaborative" | "firm";
  customEmailText: string;
}

export interface ScreenProps {
  state: CoachedState;
  updateState: (updates: Partial<CoachedState>) => void;
  nextStep: () => void;
  prevStep: () => void;
}
