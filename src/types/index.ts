export type EducationStage =
  | 'high_school'
  | 'undergraduate'
  | 'graduate'
  | 'early_career'
  | 'experienced'
  | 'career_change'
  | 'other';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type Language = 'en' | 'fr' | 'ar';

export type InterviewCategory =
  | 'university'
  | 'scholarship'
  | 'job'
  | 'internship'
  | 'competition'
  | 'personal_intro'
  | 'custom';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type SessionLength = 10 | 20 | 25;

export type PracticeMode = 'general' | 'focus_weakness';

export type SessionStatus = 'active' | 'completed' | 'abandoned';

export type QuestionType = 'opening' | 'core' | 'follow_up' | 'challenge' | 'closing';

export interface UserProfile {
  id: string;
  name: string;
  educationStage: EducationStage;
  goal: string;
  target: string;
  experienceLevel: ExperienceLevel;
  language: Language;
  concerns: string[];
  avatarPath?: string;
  createdAt: string;
}

export interface InterviewConfig {
  category: InterviewCategory;
  target: string;
  language: Language;
  difficulty: Difficulty;
  sessionLength: SessionLength;
  practiceMode: PracticeMode;
  background: string;
  sourceUrl?: string;
  pageContext?: string;
}

export interface FeedbackDimension {
  dimension: string;
  score: number; // 1-5 qualitative scale
  note: string;
}

export interface Evaluation {
  whatWorked: string;
  whatCouldImprove: string;
  whyItMatters: string;
  actionableSuggestion: string;
  exampleImprovement: string;
  dimensions: FeedbackDimension[];
  overallScore: number; // 1-5
  isComplete: boolean;
}

export interface CriterionScore {
  key: string;
  score: number; // 0-100, an estimate
  note: string;
}

export interface AnswerReview {
  assessment: string;
  criteria: CriterionScore[];
  overallScore: number; // 0-100, mean of criterion scores
  strengths: string[];
  mainWeakness: string;
  whyItMatters: string;
  improvementSuggestion: string;
  strongerStructure: string;
  nextRecommendation: string;
  rubricVersion: string;
  model: string;
  evaluatedAt: string;
}

export interface Attempt {
  id: string;
  questionId: string;
  attemptNumber: number;
  answerText: string;
  voiceUsed: boolean;
  evaluation: AnswerReview | null;
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  attemptCount: number;
  isFollowUp: boolean;
  parentQuestionId?: string;
}

export type CriterionStatus = 'improved' | 'unchanged' | 'needs_attention';

export interface CriterionComparison {
  key: string;
  previous: number;
  latest: number;
  delta: number;
  status: CriterionStatus;
}

export interface AttemptComparison {
  previousAttemptNumber: number;
  latestAttemptNumber: number;
  criteria: CriterionComparison[];
  overallDelta: number;
  improvements: string[];
  remainingWeaknesses: string[];
  recommendation: string;
}

// Legacy comparison shape used by the UI layer during the rubric migration.
export interface Comparison {
  scoreDelta: number;
  improvements: string[];
  newStrengths: string[];
  remainingWeakness: string;
  recommendedAction: string;
}

export interface SessionSummary {
  overallAssessment: string;
  strongestAspects: string[];
  recurringWeaknesses: string[];
  questionsAnswered: number;
  improvementsAchieved: number;
  recommendedNext: string[];
  weakestArea: string;
}

export interface InterviewSession {
  id: string;
  config: InterviewConfig;
  status: SessionStatus;
  questions: Question[];
  attempts: Record<string, Attempt[]>; // questionId -> attempts
  comparisons: Record<string, Comparison>; // questionId -> comparison
  summary: SessionSummary | null;
  startedAt: string;
  endedAt: string | null;
  userId: string;
}
