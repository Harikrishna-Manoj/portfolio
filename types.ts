import { ReactNode } from 'react';

export interface NavLink {
  name: string;
  href: string;
  id: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  tech: string[];
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string | null;
  github: string | null;
  color: string;
  icon: ReactNode;
}

export interface SkillCategory {
  category: string;
  icon: ReactNode;
  items: string[];
}

export interface CopyMessage {
  text: string;
  type: 'success' | 'error';
}
