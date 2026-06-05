export type LearningLevel = "basico" | "intermediario" | "avancado";
export type Difficulty = "basico" | "intermediario" | "avancado" | "desafio";
export type ContentStatus = "nao_iniciado" | "em_andamento" | "concluido";

export interface UserProfile {
  id: string;
  user_id: string;
  name: string | null;
  avatar_url: string | null;
  current_level: LearningLevel;
  goal: string | null;
  bio: string | null;
  location: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  xp: number;
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: string;
  title: string;
  description: string | null;
  category: string;
  level: LearningLevel;
  area: string;
  order_index: number;
  estimated_hours: number;
  status: ContentStatus;
  slug: string | null;
  lessons_count: number;
  created_at: string;
}

export interface Progress {
  id: string;
  user_id: string;
  content_id: string;
  status: ContentStatus;
  progress_percentage: number;
  completed_at: string | null;
  updated_at: string;
}

export interface StackItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  level: LearningLevel;
  documentation_url: string | null;
  icon: string | null;
  created_at: string;
}

export interface UdemyCourse {
  id: string;
  title: string;
  instructor: string | null;
  url: string | null;
  category: string | null;
  level: LearningLevel;
  duration: string | null;
  status: ContentStatus;
  image_url: string | null;
  description: string | null;
  user_id: string | null;
  created_at: string;
}

export interface CourseInput {
  title: string;
  instructor?: string | null;
  url?: string | null;
  category?: string | null;
  level: LearningLevel;
  duration?: string | null;
  status: ContentStatus;
  image_url?: string | null;
  description?: string | null;
}

export interface Material {
  id: string;
  title: string;
  description: string | null;
  type: string;
  url: string | null;
  category: string | null;
  level: LearningLevel;
  created_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  url: string | null;
  category: string | null;
  level: LearningLevel;
  status: ContentStatus;
  cover_url: string | null;
  file_url: string | null;
  user_id: string | null;
  created_at: string;
}

export interface BookInput {
  title: string;
  author?: string | null;
  description?: string | null;
  url?: string | null;
  category?: string | null;
  level: LearningLevel;
  status: ContentStatus;
  cover_url?: string | null;
  file_url?: string | null;
}

export interface CareerPath {
  id: string;
  title: string;
  description: string | null;
  area: string;
  skills: string[];
  roadmap: string[];
  technologies: string[];
  salary_range: string | null;
  level: LearningLevel;
  created_at: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string | null;
  difficulty: Difficulty;
  category: string | null;
  tags: string[];
  starter_code: string | null;
  solution: string | null;
  created_at: string;
}

export interface YoutubeItem {
  id: string;
  user_id: string | null;
  kind: "video" | "playlist";
  title: string;
  url: string;
  thumbnail_url: string | null;
  channel: string | null;
  description: string | null;
  category: string | null;
  created_at: string;
}

export interface YoutubeInput {
  kind: "video" | "playlist";
  title: string;
  url: string;
  thumbnail_url?: string | null;
  channel?: string | null;
  description?: string | null;
  category?: string | null;
}

export interface Job {
  id: string;
  user_id: string | null;
  title: string;
  company: string | null;
  type: string | null;
  seniority: string | null;
  salary: string | null;
  modality: string | null;
  location: string | null;
  description: string | null;
  skills: string[];
  stack: string[];
  url: string | null;
  created_at: string;
}

export interface JobInput {
  title: string;
  company?: string | null;
  type?: string | null;
  seniority?: string | null;
  salary?: string | null;
  modality?: string | null;
  location?: string | null;
  description?: string | null;
  skills?: string[];
  stack?: string[];
  url?: string | null;
}

export interface PracticeExercise {
  id: string;
  ex_id: string;
  title: string;
  category: string | null;
  group_label: string | null;
  level: Difficulty;
  type: string | null;
  objective: string | null;
  requirements: string[];
  acceptance: string[];
  checklist: string[];
  suggested_file: string | null;
  suggested_test: string | null;
  source: string | null;
  order_index: number;
  created_at: string;
}

export type Seniority = "junior" | "pleno" | "senior" | "especialista";

export interface InterviewQuestion {
  id: string;
  num: number;
  question: string;
  category: string | null;
  seniority: Seniority | null;
  intro: string | null;
  concept: string | null;
  application: string | null;
  mistakes: string | null;
  fix_fast: string | null;
  code: string | null;
  order_index: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  difficulty: Difficulty;
  area: string | null;
  technologies: string[];
  requirements: string[];
  steps: string[];
  github_url: string | null;
  status: ContentStatus;
  created_at: string;
}

export interface ContentWithProgress extends Content {
  progress?: Progress | null;
}
