export type AuthMode = 'signin' | 'signup' | 'forgot';

export interface TransitionSettings {
  duration: number; // in ms, default 750
  angle: number; // in degrees, default 7.5
  easing: string; // CSS cubic-bezier string
  soundEnabled: boolean;
}

export interface UserAccount {
  name: string;
  email: string;
  avatarLetter: string;
  role: string;
  joinedYear: number;
}

export interface CuratedSpaceItem {
  id: string;
  title: string;
  category: 'Monographs' | 'Atelier' | 'Typography' | 'Architecture';
  description: string;
  curator: string;
  date: string;
  tags: string[];
  readingTime: string;
  accentColor: string;
}

export interface FocusSession {
  durationMinutes: number;
  spaceName: string;
  completedAt: string;
}
