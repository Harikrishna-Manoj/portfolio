import React, { useState, useEffect, useRef } from 'react';
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
  Globe,
  Terminal,
  ClipboardCopy,
  Download,
  Send,
  Loader2,
  CheckCircle,
  Sun,
  Moon
} from 'lucide-react';
import { CopyMessage } from '../types';
import { EMAIL_ADDRESS, PHONE_NUMBER, NAV_LINKS, EXPERIENCES, PROJECTS, SKILLS } from '../constants';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
}

// Custom hook for scroll reveal animation
const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (ref.current && observer) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
    >
      {children}
    </div>
  );
};

const Portfolio: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
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
      setScrollY(window.scrollY);

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
        {/* Background blobs with parallax and fluid animation */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div style={{ transform: `translateY(${scrollY * 0.5}px)` }} className="absolute top-20 left-10 transition-transform duration-75 ease-out">
            <div className="w-72 h-72 bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-screen"></div>
          </div>
          <div style={{ transform: `translateY(${scrollY * 0.2}px)` }} className="absolute bottom-20 right-10 transition-transform duration-75 ease-out">
            <div className="w-96 h-96 bg-violet-600/10 dark:bg-violet-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>

        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors cursor-default">
              <Briefcase className="w-4 h-4" /> Flutter Developer
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Crafting Exceptional <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 animate-gradient-x">Mobile Experiences</span> with Flutter.
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
              I'm Harikrishna Manoj, a dedicated Flutter Developer specializing in building robust, cross-platform mobile applications that prioritize functionality and aesthetics.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#projects" onClick={(e) => scrollToSection(e, 'projects')} className="px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-medium rounded-full hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 hover:scale-105 active:scale-95">
                View Mobile Projects
              </a>
              {/* Changed mailto to copy function for the primary button */}
              <button onClick={copyEmailHandler} className="px-8 py-3.5 bg-transparent text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 font-medium rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95">
                Copy Email
              </button>
            </div>
            <div className="flex gap-6 text-slate-500 pt-4">
              <a href="https://github.com/Harikrishna-Manoj" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:scale-110 hover:-translate-y-1">
                <Github className="w-6 h-6" aria-label="GitHub Profile" />
              </a>
              <a href="https://www.linkedin.com/in/harikrishna-manoj-5851411b9/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:scale-110 hover:-translate-y-1">
                <Linkedin className="w-6 h-6" aria-label="LinkedIn Profile" />
              </a>
              {/* Changed mailto to copy function for the icon */}
              <button onClick={copyEmailHandler} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:scale-110 hover:-translate-y-1" aria-label="Copy Email Address">
                <Mail className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="flex-1 relative animate-in slide-in-from-right-10 fade-in duration-1000 delay-200">
            {/* Animated Profile Image Container */}
            <div className="relative w-full aspect-square max-w-md mx-auto group">
              <div className="relative w-full h-full animate-float hover:[animation-play-state:paused] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-2xl rotate-6 opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 rounded-2xl rotate-3 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105"></div>
                {/* Profile Image - UPDATED FOR GITHUB PAGES */}
                <div className="relative h-full w-full bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center border border-slate-200 dark:border-slate-800 transition-all duration-500 group-hover:-translate-y-3 group-hover:border-indigo-500/30 group-hover:shadow-xl group-hover:shadow-indigo-500/20">
                  <img
                    src={`${import.meta.env.BASE_URL}profile.png`}
                    alt="Harikrishna Manoj Profile"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentNode;
                      if (parent) {
                        const fallbackDiv = document.createElement('div');
                        fallbackDiv.className = 'text-slate-300 dark:text-slate-700 text-6xl font-bold flex items-center justify-center w-full h-full';
                        fallbackDiv.textContent = 'HM';
                        parent.appendChild(fallbackDiv);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block text-slate-400 dark:text-slate-600">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <RevealOnScroll>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-sm font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase mb-3">About Me</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Building top-tier, user-centric mobile software</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Specializing in Flutter development, my expertise lies in crafting cross-platform mobile applications that prioritize exceptional user experiences. My dedication to staying current with industry trends drives my focus on producing top-tier software that seamlessly merges functionality with aesthetics, ensuring high-quality solutions for the dynamic mobile landscape.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: <User />, title: "User-Centric Design", desc: "Prioritizing exceptional user experiences by merging seamless functionality with modern aesthetics." },
              { icon: <Briefcase />, title: "Cross-Platform Expertise", desc: "Crafting robust mobile applications for both Android and iOS using the Flutter framework." },
              { icon: <Code2 />, title: "Architecture Focus", desc: "Implementing Bloc, Clean Architecture, and SOLID principles for scalable and maintainable codebases." }
            ].map((item, index) => (
              <RevealOnScroll key={index} className={`delay-${index * 100}`}>
                <div className="p-8 h-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all duration-300">
                    {item.icon}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <RevealOnScroll>
            <div className="flex flex-col md:flex-row gap-16 max-w-6xl mx-auto">
              <div className="md:w-1/3">
                <h2 className="text-sm font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase mb-3">Career Path</h2>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">My Professional Journey</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  My experience focuses on hands-on Flutter development, from core concepts to implementing complex state management and database solutions.
                </p>
                {/* RESUME BUTTON - UPDATED FOR GITHUB PAGES */}
                <a
                  href="Flutter_Developer_Harikrishna_9539440572.pdf"
                  download="Flutter_Developer_Harikrishna_9539440572.pdf"
                  className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors group"
                >
                  Download Resume <Download className="w-4 h-4 transition-transform group-hover:translate-y-1" />
                </a>
              </div>

              <div className="md:w-2/3 space-y-8">
                {EXPERIENCES.map((exp, index) => (
                  <div key={index} className="relative pl-8 border-l-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-colors duration-300 pb-8 last:pb-0 group">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-300 dark:border-slate-700 group-hover:border-indigo-500 transition-colors duration-300 group-hover:scale-125"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">{exp.role}</h4>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full w-fit mt-2 sm:mt-0 border border-transparent group-hover:border-slate-300 dark:group-hover:border-slate-700 transition-all">{exp.period}</span>
                    </div>
                    <h5 className="text-indigo-600 dark:text-indigo-400 font-medium mb-4">{exp.company}</h5>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.tech.map((tag, i) => (
                        <span key={i} className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase mb-3">Portfolio</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Mobile Applications</h3>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {PROJECTS.map((project, index) => (
              <RevealOnScroll key={index} className={`delay-${index * 100}`}>
                <div className="group rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                  <div className={`h-48 ${project.color} relative overflow-hidden flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"></div>

                    {/* ENHANCED Mock phone frame using project-specific color and icon */}
                    <div className="w-1/2 h-full bg-slate-200 dark:bg-slate-800 rounded-b-[40px] shadow-2xl relative border-t-8 border-b-2 border-slate-300 dark:border-slate-700 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-slate-100 dark:bg-slate-950 rounded-b-lg"></div>
                      <div className="p-2 h-full">
                        <div className="h-full bg-slate-100 dark:bg-slate-950 rounded-lg flex flex-col justify-center items-center text-center">
                          {/* Project Icon and Title as the "Screenshot" */}
                          <div className={`p-4 rounded-xl ${project.color}/20 mb-3`}>
                            {project.icon}
                          </div>
                          <p className="text-xs text-slate-500 font-bold mt-2 px-2 truncate">{project.title.split(' - ')[0]}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{project.title}</h4>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-indigo-500/10 rounded-md text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-default">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-auto">
                      {/* Only render if github link exists */}
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:underline underline-offset-4">
                          <Github className="w-4 h-4" /> Code
                        </a>
                      )}
                      {/* Only render if store link exists */}
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:underline underline-offset-4">
                          <ExternalLink className="w-4 h-4" /> Store Link
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll>
            <div className="text-center mt-12">
              <a href="https://github.com/Harikrishna-Manoj" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 font-medium rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-95">
                <Github className="w-4 h-4" /> View All Code on GitHub
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-white dark:bg-slate-900 text-white transition-colors duration-300">
        <div className="container mx-auto px-6">
          <RevealOnScroll>
            <div className="flex flex-col md:flex-row gap-16 items-center max-w-6xl mx-auto">
              <div className="md:w-1/2">
                <h2 className="text-sm font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase mb-3">My Stack</h2>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Expertise in Mobile Development</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  My proficiency centers around the Flutter ecosystem, backed by a strong understanding of architecture patterns and scalable data solutions, using tools like Bloc for state management and Hive/Firebase for persistence.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 transition-colors">
                    <h4 className="font-bold text-lg text-indigo-600 dark:text-indigo-400 mb-1">Flutter</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Primary Framework</p>
                  </div>
                  <div className="p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 transition-colors">
                    <h4 className="font-bold text-lg text-indigo-600 dark:text-indigo-400 mb-1">Bloc/Provider</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">State Management</p>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {SKILLS.map((skill, index) => (
                    <div key={index} className="bg-slate-100/50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 hover:bg-slate-200/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400">
                        {skill.icon}
                        <h4 className="font-bold text-slate-900 dark:text-white">{skill.category}</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skill.items.map((item, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-200/50 dark:bg-slate-700/50 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-default">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <RevealOnScroll>
            <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row shadow-2xl">

              {/* Left Side: Info */}
              <div className="md:w-5/12 p-10 bg-indigo-600 text-white relative overflow-hidden flex flex-col justify-between">
                {/* Background Blobs with Animation */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full -mr-16 -mt-16 opacity-50 transition-transform duration-700 hover:scale-150 hover:rotate-45"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500 rounded-full -ml-12 -mb-12 opacity-50 transition-transform duration-700 delay-100 hover:scale-150 hover:-rotate-45"></div>

                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-4">Let's connect and build!</h3>
                  <p className="text-indigo-100 mb-8">
                    I'm currently seeking new Flutter development opportunities. Reach out via email or connect with me on LinkedIn.
                  </p>

                  <div className="space-y-4 mb-12">
                    {/* EMAIL: Click to Copy */}
                    <button onClick={copyEmailHandler} className="flex items-center gap-4 group/item hover:bg-white/10 p-3 rounded-xl -ml-3 transition-all duration-300 w-full text-left" aria-label="Copy Email Address">
                      <div className="w-10 h-10 bg-indigo-500/50 rounded-full flex items-center justify-center backdrop-blur-sm group-hover/item:bg-white group-hover/item:text-indigo-600 transition-all duration-300 group-hover/item:scale-110 group-hover/item:rotate-6 shadow-inner">
                        <Mail className="w-5 h-5" />
                      </div>
                      <span className="group-hover/item:translate-x-1 transition-transform font-medium truncate max-w-[200px] sm:max-w-none">{EMAIL_ADDRESS}</span>
                    </button>

                    {/* PHONE: Click to Copy */}
                    <button onClick={copyPhoneHandler} className="flex items-center gap-4 group/item hover:bg-white/10 p-3 rounded-xl -ml-3 transition-all duration-300 w-full text-left" aria-label="Copy Phone Number">
                      <div className="w-10 h-10 bg-indigo-500/50 rounded-full flex items-center justify-center backdrop-blur-sm group-hover/item:bg-white group-hover/item:text-indigo-600 transition-all duration-300 group-hover/item:scale-110 group-hover/item:rotate-6 shadow-inner">
                        <Terminal className="w-5 h-5" />
                      </div>
                      <span className="group-hover/item:translate-x-1 transition-transform font-medium">{PHONE_NUMBER}</span>
                    </button>
                  </div>

                  {/* Social Links moved here */}
                  <div>
                    <p className="text-indigo-200 mb-4 text-sm font-semibold uppercase tracking-wider">Connect with me</p>
                    <div className="flex gap-4 text-white">
                      <a href="https://www.linkedin.com/in/harikrishna-manoj-5851411b9/" target="_blank" rel="noopener noreferrer" className="p-3 bg-indigo-500 rounded-full hover:bg-white hover:text-indigo-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-900/30 active:scale-95 group/link" aria-label="LinkedIn Profile">
                        <Linkedin className="w-5 h-5 transition-transform group-hover/link:scale-110" />
                      </a>
                      <a href="https://github.com/Harikrishna-Manoj" target="_blank" rel="noopener noreferrer" className="p-3 bg-indigo-500 rounded-full hover:bg-white hover:text-indigo-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-900/30 active:scale-95 group/link" aria-label="GitHub Profile">
                        <Github className="w-5 h-5 transition-transform group-hover/link:scale-110" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="md:w-7/12 p-8 md:p-12 bg-white dark:bg-slate-900 flex flex-col justify-center">
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send a Message</h4>

                {isSubmitted ? (
                  <div className="h-full flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h5 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h5>
                    <p className="text-slate-600 dark:text-slate-400 max-w-xs">
                      Thanks for reaching out. Your email client should open shortly with the pre-filled message.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-8 px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                        placeholder="How can I help you?"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-8 transition-colors duration-300">
        <div className="container mx-auto px-6 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} Harikrishna Manoj. Built with React and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;