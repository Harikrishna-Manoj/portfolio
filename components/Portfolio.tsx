import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code2,
  User,
  Briefcase,
  ChevronDown,
  Menu,
  X,
  Terminal,
  Download,
  Send,
  Loader2,
  CheckCircle,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  Globe,
  ClipboardCopy
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
import { CopyMessage } from '../types';
import { EMAIL_ADDRESS, PHONE_NUMBER, NAV_LINKS, EXPERIENCES, PROJECTS, SKILLS } from '../constants';


// Typing animation component
const TypewriterText: React.FC<{ texts: string[] }> = ({ texts }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  return (
    <span className="inline-block min-w-[1ch]">
      {texts[index].substring(0, subIndex)}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-0.5 h-[1em] bg-indigo-600 dark:bg-indigo-400 align-middle ml-1"
      />
    </span>
  );
};

const Portfolio: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [copyMessage, setCopyMessage] = useState<CopyMessage | null>(null);

  // Theme State
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle Theme Change
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Unified function to handle copying content (email or phone)
  const copyToClipboard = (content: string, type: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = content;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand('copy');
      setCopyMessage({ text: `${type} copied!`, type: 'success' });
    } catch (err) {
      console.error('Copy failed:', err);
      setCopyMessage({ text: `Failed to copy ${type}.`, type: 'error' });
    }

    document.body.removeChild(textarea);

    setTimeout(() => {
      setCopyMessage(null);
    }, 2000);
  };

  // Handler for Email button
  const copyEmailHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    copyToClipboard(EMAIL_ADDRESS, 'Email');
  };

  // Handler for Phone button
  const copyPhoneHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    copyToClipboard(PHONE_NUMBER, 'Phone number');
  };

  // Handler for Form Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler for Form Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate network delay for better UX
    setTimeout(() => {
      const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);

      // Open mailto link
      window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`;

      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  // Handle scroll effects and active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'experience', 'projects', 'skills', 'contact'];
      let currentActive = 'home';

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            currentActive = sectionId;
            break;
          }
        }
      }

      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100; // Adjust for fixed header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-600 dark:selection:text-indigo-200 transition-colors duration-300">

      {/* Toast Notification for Copy */}
      {copyMessage && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-lg transition-opacity duration-300 ${copyMessage.type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
          <div className="flex items-center gap-2">
            <ClipboardCopy className="w-4 h-4" />
            <p className="text-sm font-medium">{copyMessage.text}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-lg shadow-indigo-500/5 border-b border-slate-200/50 dark:border-slate-800/50 py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, 'home')}
            className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Code2 className="w-8 h-8 relative z-10 transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <span>Harikrishna&nbsp;<span className="text-slate-900 dark:text-slate-100">Manoj</span></span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.id)}
                className={`group text-sm font-medium relative py-1 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${activeSection === link.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 transform origin-left transition-transform duration-300 ${activeSection === link.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </a>
            ))}

            {/* Theme Toggle Button Desktop */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Contact Button preserved */}
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, 'contact')}
              className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-500 transition-all hover:shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] hover:-translate-y-0.5 active:scale-95"
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Controls */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 py-4' : 'max-h-0 py-0'}`}>
          <div className="flex flex-col items-center gap-4">
            {/* Mobile menu includes Contact */}
            {[...NAV_LINKS, { name: 'Contact', href: '#contact', id: 'contact' }].map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 py-2 w-full text-center hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                onClick={(e) => scrollToSection(e, link.id)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 bg-slate-50 dark:bg-slate-950 overflow-hidden relative transition-colors duration-300">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/30 blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/30 blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-pink-500/20 blur-[100px] animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-900 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_85%)]"></div>
        </div>

        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold border border-indigo-500/20 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Available for Hire</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:white tracking-tighter leading-[1.1]">
              Built with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-400 bg-[length:200%_auto] animate-gradient-x">
                Precision.
              </span>
            </h1>

            <div className="text-2xl md:text-3xl font-bold text-slate-700 dark:text-slate-300">
              I'm a <TypewriterText texts={["Flutter Developer", "Mobile Architect", "UI Enthusiast"]} />
            </div>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
              Hi, I'm <span className="text-slate-900 dark:text-white font-bold underline decoration-indigo-500 decoration-2 underline-offset-4">Harikrishna Manoj</span>. I specialize in building top-tier, cross-platform mobile apps that feel native and look stunning.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#projects"
                onClick={(e) => scrollToSection(e, 'projects')}
                className="group px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center gap-2 active:scale-95"
              >
                View My Work
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <button
                onClick={copyEmailHandler}
                className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 font-bold rounded-2xl hover:border-indigo-500 transition-all flex items-center gap-2 active:scale-95"
              >
                <Mail className="w-5 h-5" />
                Copy Email
              </button>
            </motion.div>

            <div className="flex gap-6 text-slate-500 pt-4">
              <a href="https://github.com/Harikrishna-Manoj" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:scale-110">
                <Github className="w-6 h-6" aria-label="GitHub Profile" />
              </a>
              <a href="https://www.linkedin.com/in/harikrishna-manoj-5851411b9/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:scale-110">
                <Linkedin className="w-6 h-6" aria-label="LinkedIn Profile" />
              </a>
            </div>
          </motion.div>

          {/* Profile Image with 3D-ish effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex-1 relative flex justify-center items-center"
          >
            <div className="relative group">
              {/* Decorative elements */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative w-72 h-72 md:w-96 md:h-96 rounded-[2.5rem] bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-800 overflow-hidden shadow-2xl z-10"
              >
                <img
                  src={`${import.meta.env.BASE_URL}profile.png`}
                  alt="Harikrishna Manoj Profile"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentNode;
                    if (parent) {
                      const fallbackDiv = document.createElement('div');
                      fallbackDiv.className = 'text-slate-300 dark:text-slate-700 text-6xl font-black flex items-center justify-center w-full h-full bg-slate-100 dark:bg-slate-950';
                      fallbackDiv.textContent = 'HM';
                      parent.appendChild(fallbackDiv);
                    }
                  }}
                />
              </motion.div>

              {/* Floaties */}
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 -right-8 w-20 h-20 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center z-20"
              >
                <Code2 className="w-10 h-10 text-indigo-500" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 -left-8 w-20 h-20 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center z-20"
              >
                <Briefcase className="w-10 h-10 text-violet-500" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block text-slate-400"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 space-y-6"
            >
              <h2 className="text-indigo-600 dark:text-indigo-400 font-bold tracking-tight uppercase text-sm">About Me</h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                Passion for <span className="text-indigo-600 dark:text-indigo-400 font-black">Performance</span> and User Experience.
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                As a Flutter Developer, I believe that every pixel matters. My journey in mobile development is driven by a desire to create software that isn't just functional, but a joy to use. I specialize in building complex, high-performance apps that bridge the gap between imagination and reality.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="space-y-1">
                  <p className="text-3xl font-black text-slate-900 dark:text-white">1.5+</p>
                  <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Years Experience</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-slate-900 dark:text-white">10+</p>
                  <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Projects Completed</p>
                </div>
              </div>
            </motion.div>

            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: <User className="w-6 h-6 text-indigo-500" />,
                  title: "User-Centric",
                  desc: "Design that flows naturally with how people use apps.",
                  color: "bg-indigo-500/10"
                },
                {
                  icon: <Briefcase className="w-6 h-6 text-violet-500" />,
                  title: "Cross-Platform",
                  desc: "One codebase, premium feel on both Android & iOS.",
                  color: "bg-violet-500/10"
                },
                {
                  icon: <Code2 className="w-6 h-6 text-pink-500" />,
                  title: "Clean Code",
                  desc: "Maintainable architecture using Bloc & SOLID principles.",
                  color: "bg-pink-500/10"
                },
                {
                  icon: <Globe className="w-6 h-6 text-emerald-500" />,
                  title: "Modern Stack",
                  desc: "Leveraging the latest Flutter & Firebase features.",
                  color: "bg-emerald-500/10"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bento-card group hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", item.color)}>
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="space-y-4">
                <h2 className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-tight text-sm">Professional Path</h2>
                <h3 className="text-4xl font-black text-slate-900 dark:text-white">Experience & Education</h3>
              </div>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="Flutter_Developer_Harikrishna_9539440572.pdf"
                download="Flutter_Developer_Harikrishna_9539440572.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all text-sm"
              >
                Download Resume <Download className="w-4 h-4" />
              </motion.a>
            </div>

            <div className="space-y-12">
              {EXPERIENCES.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-12 border-l-2 border-slate-200 dark:border-slate-800 last:border-0 pb-12 last:pb-0"
                >
                  <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-900 shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{exp.role}</h4>
                      <p className="text-indigo-600 dark:text-indigo-400 font-bold">{exp.company}</p>
                    </div>
                    <span className="inline-block px-4 py-1.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-widest whitespace-nowrap h-fit">
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-lg mb-6 max-w-2xl leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map((tag, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold transition-colors group-hover:border-indigo-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-tight text-sm">My Work</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Featured Mobile Apps</h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              A collection of production-ready mobile applications built with Flutter, focusing on performance, scalability, and UX.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {PROJECTS.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-4 bento-card hover:border-indigo-500/50 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50"
              >
                {/* Mobile Mockup Container */}
                <div className={cn("relative h-64 rounded-xl overflow-hidden mb-6 flex items-center justify-center transition-all duration-500 group-hover:scale-[1.02]", project.color)}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>

                  {/* Phone Frame */}
                  <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-32 h-56 bg-white dark:bg-slate-950 rounded-[2.5rem] border-[4px] border-slate-900 dark:border-slate-800 shadow-2xl relative overflow-hidden flex flex-col pt-4"
                  >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-slate-900 dark:bg-slate-800 rounded-full"></div>
                    <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                      <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 mb-2">
                        {project.icon}
                      </div>
                      <p className="text-[8px] font-black uppercase tracking-tighter text-slate-500 dark:text-slate-400 truncate w-full px-2">
                        {project.title.split(' - ')[0]}
                      </p>
                    </div>
                  </motion.div>
                </div>

                <div className="px-2 space-y-4 flex-grow flex flex-col">
                  <div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mt-2">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                        <Github className="w-4 h-4" /> Code
                      </a>
                    )}
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                        <ExternalLink className="w-4 h-4" /> Store
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mt-16 text-center"
          >
            <a href="https://github.com/Harikrishna-Manoj" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black rounded-2xl shadow-xl shadow-slate-900/10 transition-all hover:bg-slate-800 dark:hover:bg-slate-100">
              <Github className="w-5 h-5" />
              Complete Project Archive
            </a>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 bg-slate-50 dark:bg-slate-900/30 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-start max-w-6xl mx-auto">
            <div className="md:w-1/3 space-y-6 md:sticky md:top-32">
              <h2 className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-tight text-sm">Expertise</h2>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white lg:text-5xl">My Modern Stack</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Specializing in the Flutter ecosystem with deep knowledge of architecture patterns and scalable infrastructure.
              </p>

              <div className="p-6 rounded-2xl bg-indigo-600 text-white space-y-2 shadow-lg shadow-indigo-500/20">
                <p className="text-xs font-black uppercase tracking-widest opacity-80">Primary Focus</p>
                <p className="text-2xl font-black">Flutter & Dart Specialist</p>
              </div>
            </div>

            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {SKILLS.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 bento-card bg-white dark:bg-slate-900 border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-xl transition-shadow group"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      {skill.icon}
                    </div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{skill.category}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto bento-card border-none shadow-2xl flex flex-col md:flex-row overflow-hidden">

            {/* Contact Info Panel */}
            <div className="md:w-5/12 p-12 bg-indigo-600 text-white relative flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>

              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-4xl font-black tracking-tight leading-tight">Ready to build something great?</h3>
                  <p className="text-indigo-100/80 text-lg">
                    Always looking for exciting Flutter projects and professional collaborations.
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={copyEmailHandler}
                    className="w-full p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all flex items-center gap-4 group text-left border border-white/10"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase opacity-60">Email Address</p>
                      <p className="font-bold truncate max-w-[200px]">{EMAIL_ADDRESS}</p>
                    </div>
                  </button>

                  <button
                    onClick={copyPhoneHandler}
                    className="w-full p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all flex items-center gap-4 group text-left border border-white/10"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase opacity-60">Get in Touch</p>
                      <p className="font-bold truncate max-w-[200px]">{PHONE_NUMBER}</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="relative z-10 flex gap-4 pt-12 border-t border-white/10 mt-12">
                <a href="https://www.linkedin.com/in/harikrishna-manoj-5851411b9/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-indigo-600 hover:-translate-y-1 transition-all shadow-lg active:scale-95">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://github.com/Harikrishna-Manoj" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-indigo-600 hover:-translate-y-1 transition-all shadow-lg active:scale-95">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Form Panel */}
            <div className="md:w-7/12 p-12 bg-white dark:bg-slate-900 relative">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-6"
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white">Message Set!</h4>
                      <p className="text-slate-500 dark:text-slate-400">Opening your mail client...</p>
                    </div>
                    <button onClick={() => setIsSubmitted(false)} className="text-sm font-black text-indigo-600 uppercase tracking-widest">
                      Send Another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleFormSubmit}
                    className="space-y-6"
                  >
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 ml-4">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-slate-900 dark:text-white font-bold"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 ml-4">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-slate-900 dark:text-white font-bold"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 ml-4">Message</label>
                      <textarea
                        name="message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-slate-900 dark:text-white font-bold resize-none"
                        placeholder="Tell me about your project..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
                    >
                      {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>
                          Send Message
                          <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <div className="container mx-auto px-6 text-center space-y-4">
          <div className="flex justify-center flex-wrap gap-x-8 gap-y-4 text-xs font-black uppercase tracking-widest text-slate-400">
            {NAV_LINKS.map(link => (
              <a key={link.id} href={link.href} onClick={e => scrollToSection(e, link.id)} className="hover:text-indigo-600 transition-colors">
                {link.name}
              </a>
            ))}
          </div>
          <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} Harikrishna Manoj. Built with passion & precision.</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
