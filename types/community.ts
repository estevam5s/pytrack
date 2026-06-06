export type CommunityPostCategory =
  | "duvida"
  | "exercicio"
  | "projeto"
  | "vaga"
  | "material"
  | "conquista"
  | "discussao"
  | "artigo"
  | "evento";

export type CommunityUserLevel =
  | "Iniciante"
  | "Explorador Python"
  | "Python Developer"
  | "Data Apprentice"
  | "Backend Builder"
  | "IoT Maker"
  | "Data Engineer"
  | "Software Engineer"
  | "Mentor Python";

export interface CommunityProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  headline: string | null;
  current_track: string | null;
  level: string;
  xp: number;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  is_online: boolean;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  category: CommunityPostCategory;
  title: string | null;
  content: string;
  image_urls: string[];
  tags: string[];
  visibility: "public" | "members" | "private";
  status: "active" | "hidden" | "deleted" | "reported";
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  reports_count: number;
  created_at: string;
  updated_at: string;
}

export interface CommunityPostWithAuthor extends CommunityPost {
  author: CommunityProfile | null;
  liked: boolean;
  saved: boolean;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  parent_comment_id: string | null;
  content: string;
  likes_count: number;
  is_solution: boolean;
  status: "active" | "hidden" | "deleted";
  created_at: string;
  updated_at: string;
  author?: CommunityProfile | null;
}

export interface CommunityLike {
  id: string;
  user_id: string;
  post_id: string | null;
  comment_id: string | null;
  target_type: "post" | "comment";
  created_at: string;
}

export interface CommunitySavedPost {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface CommunityFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface CommunityJob {
  id: string;
  user_id: string;
  title: string;
  company: string;
  location: string | null;
  remote: boolean;
  contract_type: string | null;
  seniority: string | null;
  salary_range: string | null;
  description: string | null;
  requirements: string[] | null;
  apply_url: string | null;
  tags: string[];
  status: "open" | "closed";
  created_at: string;
  updated_at: string;
  author?: CommunityProfile | null;
}

export type CommunityNotificationType =
  | "like"
  | "comment"
  | "reply"
  | "follow"
  | "solution"
  | "mention"
  | "job";

export interface CommunityNotification {
  id: string;
  user_id: string;
  actor_id: string | null;
  type: CommunityNotificationType;
  post_id: string | null;
  comment_id: string | null;
  message: string | null;
  read: boolean;
  created_at: string;
  actor?: CommunityProfile | null;
}

export type CommunityReportReason =
  | "spam"
  | "abuse"
  | "offensive"
  | "misinformation"
  | "other";
