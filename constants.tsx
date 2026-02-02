import React from 'react';
import {
  Gift,
  ShoppingCart,
  Music,
  Code2,
  Layout,
  Database,
  Cpu,
} from 'lucide-react';
import { Experience, Project, SkillCategory, NavLink } from './types';

export const EMAIL_ADDRESS = "harikrishnamanoj2@gmail.com";
export const PHONE_NUMBER = "+919539440572";

export const NAV_LINKS: NavLink[] = [
  { name: 'Home', href: '#home', id: 'home' },
  { name: 'About', href: '#about', id: 'about' },
  { name: 'Experience', href: '#experience', id: 'experience' },
  { name: 'Projects', href: '#projects', id: 'projects' },
  { name: 'Skills', href: '#skills', id: 'skills' },
];

export const EXPERIENCES: Experience[] = [
  {
    company: "Maninfini Automation Pvt Ltd, Bangalore",
    role: "Flutter Developer",
    period: "Jun 2024 - Nov 2024",
    description: "Developed and maintained cross-platform mobile applications for the innovative 'Game of Giving' initiative, focusing on resource redistribution and social impact.",
    tech: ["Flutter", "Dart", "GetX", "REST APIs"]
  },
  {
    company: "Brototype, Ernakulam",
    role: "Flutter Developer Intern",
    period: "Nov 2023 - Feb 2024",
    description: "Gained hands-on experience in mobile application development, implementing key features and utilizing state management patterns like Bloc to enhance app scalability.",
    tech: ["Flutter", "Dart", "Bloc", "Hive"]
  },
  {
    company: "Govt Polytechnic college, Kalamassery",
    role: "Diploma In Electronics And Communication Engineering",
    period: "2018 - 2021 (CGPA: 8.04)",
    description: "Completed academic coursework focused on core electronics and communication principles, providing a strong analytical foundation for software development.",
    tech: ["Electronics", "Communication", "C Programming"]
  }
];

export const PROJECTS: Project[] = [
  {
    title: "Game of Giving Apps",
    description: "A community-focused initiative involving multiple cross-platform apps (Giver, Needy, Mentor) for redistributing surplus resources, promoting sustainability and social impact.",
    tags: ["Flutter", "Dart", "Play Store", "App Store"],
    link: "https://play.google.com/store/apps/developer?id=644869124",
    github: null,
    color: "bg-green-600",
    icon: <Gift className="w-12 h-12 text-green-300" />
  },
  {
    title: "HRX Store - E-Commerce App",
    description: "A feature-rich e-commerce application with secure payment (Razorpay), Firebase Authentication, product categories, and cart management. Built with an accompanying Admin app.",
    tags: ["Flutter", "Dart", "Firebase Firestore/Storage", "Bloc", "Razorpay"],
    link: "https://play.google.com/store/apps/details?id=com.ecom.hrx_store&pcampaignid=web_share",
    github: "https://github.com/Harikrishna-Manoj/HRX_Store_e_commerce",
    color: "bg-indigo-600",
    icon: <ShoppingCart className="w-12 h-12 text-indigo-300" />
  },
  {
    title: "Rhythm Music Player",
    description: "A conceptualized and developed offline music player with a sleek UI. Features include volume control, a dedicated play screen, mini player, and organization using Hive Database.",
    tags: ["Flutter", "Dart", "Hive Database", "Bloc"],
    link: "https://play.google.com/store/apps/details?id=in.freelance.rhythm_music_player&pcampaignid=web_share",
    github: "https://github.com/Harikrishna-Manoj/Rhythm_music_player",
    color: "bg-red-600",
    icon: <Music className="w-12 h-12 text-red-300" />
  }
];

export const SKILLS: SkillCategory[] = [
  { category: "Languages & Frameworks", icon: <Code2 className="w-6 h-6" />, items: ["Dart", "Flutter", "SQL", "OOPS", "REST APIs", "GraphQL"] },
  { category: "State Management & Architecture", icon: <Layout className="w-6 h-6" />, items: ["Bloc", "Provider", "GetX", "Clean Architecture", "MVVM", "SOLID Principle"] },
  { category: "Backend & Database", icon: <Database className="w-6 h-6" />, items: ["Firebase", "Hive", "SQL", "Data Structure", "Payment Gateway"] },
  { category: "Tools & DevOps", icon: <Cpu className="w-6 h-6" />, items: ["Git/GitHub", "VS Code", "Android Studio", "Figma", "Codemagic", "ChatGPT", "Davinci Resolve", "Photoshop"] }
];
