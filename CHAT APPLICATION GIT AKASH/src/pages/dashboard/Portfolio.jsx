

import React, { useState, useEffect } from 'react';

const Portfolio = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        setIsVisible(prev => ({
          ...prev,
          [entry.target.id]: entry.isIntersecting
        }));
      });
    }, observerOptions);

    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const skills = [
    { name: 'React.js', level: 90, icon: '⚛️' },
    { name: 'Node.js', level: 85, icon: '🟢' },
    { name: 'MongoDB', level: 80, icon: '🍃' },
    { name: 'Express.js', level: 85, icon: '⚡' },
    { name: 'JavaScript', level: 90, icon: '📄' },
    { name: 'TypeScript', level: 75, icon: '🔷' },
    { name: 'Material-UI', level: 85, icon: '🎨' },
    { name: 'JWT Auth', level: 80, icon: '🔒' },
    { name: 'AWS/Cloud', level: 70, icon: '☁️' },
    { name: 'Git/GitHub', level: 85, icon: '🐙' },
  ];

  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack MERN application with payment integration, admin panel, and real-time inventory management.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'JWT'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: true,
    },
    {
      title: 'Social Media Dashboard',
      description: 'Real-time analytics dashboard with WebSocket integration, data visualization, and user engagement metrics.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
      technologies: ['React', 'Socket.io', 'Express', 'Chart.js', 'Redis'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: true,
    },
    {
      title: 'Task Management System',
      description: 'Collaborative project management tool with drag-and-drop functionality, team collaboration, and progress tracking.',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop',
      technologies: ['React', 'Node.js', 'MongoDB', 'Material-UI', 'Socket.io'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: false,
    },
    {
      title: 'Weather App with AI',
      description: 'Weather application with AI-powered recommendations and location-based services.',
      image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=250&fit=crop',
      technologies: ['React', 'OpenAI API', 'Weather API', 'Geolocation'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: false,
    },
  ];

  const experience = [
    {
      title: 'Full Stack Developer',
      company: 'Tech Solutions Inc.',
      period: 'Jan 2023 - Present',
      description: 'Developed and maintained multiple MERN stack applications, improved application performance by 40%, and mentored junior developers.',
      achievements: ['Led a team of 3 developers', 'Reduced load time by 40%', 'Implemented CI/CD pipeline'],
    },
    {
      title: 'Frontend Developer',
      company: 'Digital Innovations Ltd.',
      period: 'Jun 2022 - Dec 2022',
      description: 'Specialized in React.js development, created responsive user interfaces, and collaborated with design teams.',
      achievements: ['Built 15+ responsive components', 'Improved user experience', 'Integrated 10+ APIs'],
    },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
  };
console.log("darkMode",darkMode)
  return (
    <div className={`portfolio ${darkMode ? 'dark' : 'light'}`}>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .portfolio {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          color: var(--text-primary);
          transition: all 0.3s ease;
        }

        .portfolio.light {
          --primary: #2563eb;
          --primary-light: #3b82f6;
          --secondary: #ec4899;
          --background: #ffffff;
          --background-alt: #f8fafc;
          --text-primary: #1e293b;
          --text-secondary: #64748b;
          --border: #e2e8f0;
          --shadow: rgba(0, 0, 0, 0.1);
        }

        .portfolio.dark {
          --primary: #3b82f6;
          --primary-light: #60a5fa;
          --secondary: #f472b6;
          --background: #0f172a;
          --background-alt: #1e293b;
          --text-primary: #f1f5f9;
          --text-secondary: #cbd5e1;
          --border: #334155;
          --shadow: rgba(0, 0, 0, 0.3);
        }

        .header {
          position: fixed;
          top: 0;
          width: 100%;
          backdrop-filter: blur(20px);
          background: var(--background)95;
          z-index: 1000;
          padding: 1rem 0;
          border-bottom: 1px solid var(--border);
        }

        .nav {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          text-decoration: none;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          list-style: none;
        }

        .nav-links a {
          color: var(--text-primary);
          text-decoration: none;
          transition: color 0.3s;
        }

        .nav-links a:hover {
          color: var(--primary);
        }

        .theme-toggle {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .theme-toggle:hover {
          background: var(--primary-light);
          transform: translateY(-2px);
        }

        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, var(--primary)10, var(--secondary)10);
          padding: 0 2rem;
          overflow: hidden;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-text {
          animation: slideInLeft 1s ease-out;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 1rem;
        }

        .hero-title .highlight {
          color: var(--primary);
          display: block;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn {
          padding: 1rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
          cursor: pointer;
          border: none;
          font-size: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: var(--primary);
          color: white;
        }

        .btn-primary:hover {
          background: var(--primary-light);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px var(--shadow);
        }

        .btn-outline {
          background: transparent;
          color: var(--primary);
          border: 2px solid var(--primary);
        }

        .btn-outline:hover {
          background: var(--primary);
          color: white;
          transform: translateY(-2px);
        }

        .hero-image {
          text-align: center;
          animation: slideInRight 1s ease-out;
        }

        .profile-img {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          border: 4px solid var(--primary);
          box-shadow: 0 0 0 8px var(--primary)30;
          margin-bottom: 2rem;
          animation: float 3s ease-in-out infinite;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .social-link {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--background-alt);
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 1.5rem;
          transition: all 0.3s;
          border: 2px solid var(--border);
        }

        .social-link:hover {
          background: var(--primary);
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 10px 30px var(--shadow);
        }

        .section {
          padding: 5rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 3rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 3rem;
          color: var(--text-primary);
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .about-text {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-secondary);
        }

        .about-text p {
          margin-bottom: 1.5rem;
        }

        .stats-card {
          background: var(--background-alt);
          padding: 2rem;
          border-radius: 15px;
          border: 1px solid var(--border);
          box-shadow: 0 5px 15px var(--shadow);
        }

        .stat-item {
          margin-bottom: 1.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .stat-bar {
          height: 8px;
          background: var(--border);
          border-radius: 4px;
          overflow: hidden;
        }

        .stat-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          border-radius: 4px;
          transition: width 2s ease;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .skill-card {
          background: var(--background-alt);
          padding: 2rem;
          border-radius: 15px;
          text-align: center;
          border: 1px solid var(--border);
          transition: all 0.3s;
          cursor: pointer;
        }

        .skill-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px var(--shadow);
          border-color: var(--primary);
        }

        .skill-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .skill-name {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .project-card {
          background: var(--background-alt);
          border-radius: 15px;
          overflow: hidden;
          border: 1px solid var(--border);
          transition: all 0.3s;
          cursor: pointer;
        }

        .project-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 50px var(--shadow);
        }

        .project-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .project-content {
          padding: 2rem;
        }

        .project-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .featured-badge {
          background: var(--primary);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.8rem;
        }

        .project-description {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .tech-tag {
          background: var(--primary)20;
          color: var(--primary);
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.8rem;
          border: 1px solid var(--primary)30;
        }

        .project-links {
          display: flex;
          gap: 1rem;
        }

        .project-link {
          padding: 0.5rem 1.5rem;
          border-radius: 25px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s;
          font-size: 0.9rem;
        }

        .link-code {
          background: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border);
        }

        .link-demo {
          background: var(--primary);
          color: white;
        }

        .experience-timeline {
          position: relative;
          padding-left: 2rem;
        }

        .timeline-line {
          position: absolute;
          left: 1rem;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--border);
        }

        .experience-item {
          position: relative;
          background: var(--background-alt);
          margin-bottom: 2rem;
          padding: 2rem;
          border-radius: 15px;
          border: 1px solid var(--border);
          margin-left: 2rem;
        }

        .experience-item::before {
          content: '';
          position: absolute;
          left: -3rem;
          top: 2rem;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--primary);
        }

        .experience-header {
          margin-bottom: 1rem;
        }

        .experience-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .experience-company {
          color: var(--primary);
          font-weight: 500;
        }

        .experience-period {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .achievements {
          margin-top: 1rem;
        }

        .achievement-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-secondary);
        }

        .contact-section {
          background: linear-gradient(135deg, var(--primary)10, var(--secondary)10);
        }

        .contact-card {
          background: var(--background-alt);
          padding: 4rem;
          border-radius: 20px;
          text-align: center;
          border: 1px solid var(--border);
          box-shadow: 0 20px 60px var(--shadow);
        }

        .contact-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .contact-subtitle {
          color: var(--text-secondary);
          margin-bottom: 3rem;
          font-size: 1.1rem;
        }

        .footer {
          background: var(--background-alt);
          padding: 2rem;
          text-align: center;
          border-top: 1px solid var(--border);
          color: var(--text-secondary);
        }

        .fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s ease;
        }

        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .hero-title {
            font-size: 2.5rem;
          }
          
          .about-grid {
            grid-template-columns: 1fr;
          }
          
          .nav-links {
            display: none;
          }
          
          .projects-grid {
            grid-template-columns: 1fr;
          }
          
          .skills-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <nav className="nav">
          <a href="#home" className="logo">Akash Nale</a>
          <ul className="nav-links">
            <li><a href="#home" onClick={() => scrollToSection('home')}>Home</a></li>
            <li><a href="#about" onClick={() => scrollToSection('about')}>About</a></li>
            <li><a href="#skills" onClick={() => scrollToSection('skills')}>Skills</a></li>
            <li><a href="#projects" onClick={() => scrollToSection('projects')}>Projects</a></li>
            <li><a href="#experience" onClick={() => scrollToSection('experience')}>Experience</a></li>
            <li><a href="#contact" onClick={() => scrollToSection('contact')}>Contact</a></li>
          </ul>
          <button 
            className="theme-toggle" 
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              MERN Stack
              <span className="highlight">Developer</span>
            </h1>
            <p className="hero-subtitle">
              Building scalable web applications with modern technologies. 
              2+ years of experience in full-stack development.
            </p>
            <div className="hero-buttons">
              <a href="#projects" className="btn btn-primary">
                🚀 View My Work
              </a>
              <a href="#contact" className="btn btn-outline">
                📧 Contact Me
              </a>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" 
              alt="Akash Nale" 
              className="profile-img"
            />
            <div className="social-links">
              <a href="https://github.com" className="social-link">🐙</a>
              <a href="https://linkedin.com" className="social-link">💼</a>
              <a href="mailto:john@example.com" className="social-link">📧</a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`section fade-in ${isVisible.about ? 'visible' : ''}`}>
        <h2 className="section-title">About Me</h2>
        <div className="about-grid">
          <div className="about-text">
            <p>
              I'm a passionate MERN stack developer with 2+ years of experience building scalable web applications. 
              I specialize in creating efficient, user-friendly solutions using React.js, Node.js, MongoDB, and Express.js.
            </p>
            <p>
              My expertise includes modern JavaScript/TypeScript, RESTful APIs, database design, and cloud deployment. 
              I'm committed to writing clean, maintainable code and staying updated with the latest industry trends.
            </p>
            <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem'}}>
              <span className="tech-tag">📍 New York, USA</span>
              <span className="tech-tag">📧 john.doe@email.com</span>
              <span className="tech-tag">📱 +1 (555) 123-4567</span>
            </div>
          </div>
          <div className="stats-card">
            <h3 style={{marginBottom: '2rem'}}>Quick Stats</h3>
            <div className="stat-item">
              <div className="stat-label">Projects Completed: 15+</div>
              <div className="stat-bar">
                <div className="stat-fill" style={{width: '75%'}}></div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Client Satisfaction: 98%</div>
              <div className="stat-bar">
                <div className="stat-fill" style={{width: '98%'}}></div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Code Quality Score: 95%</div>
              <div className="stat-bar">
                <div className="stat-fill" style={{width: '95%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className={`section fade-in ${isVisible.skills ? 'visible' : ''}`} style={{background: 'var(--background-alt)'}}>
        <h2 className="section-title">Technical Skills</h2>
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div key={skill.name} className="skill-card">
              <div className="skill-icon">{skill.icon}</div>
              <div className="skill-name">{skill.name}</div>
              <div className="stat-bar">
                <div className="stat-fill" style={{width: `${skill.level}%`}}></div>
              </div>
              <div style={{marginTop: '0.5rem', color: 'var(--text-secondary)'}}>{skill.level}%</div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className={`section fade-in ${isVisible.projects ? 'visible' : ''}`}>
        <h2 className="section-title">Featured Projects</h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={project.title} className="project-card">
              <img src={project.image} alt={project.title} className="project-image" />
              <div className="project-content">
                <h3 className="project-title">
                  {project.title}
                  {project.featured && <span className="featured-badge">Featured</span>}
                </h3>
                <p className="project-description">{project.description}</p>
                <div className="tech-stack">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a href={project.github} className="project-link link-code">
                    🐙 Code
                  </a>
                  <a href={project.demo} className="project-link link-demo">
                    🚀 Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className={`section fade-in ${isVisible.experience ? 'visible' : ''}`} style={{background: 'var(--background-alt)'}}>
        <h2 className="section-title">Professional Experience</h2>
        <div className="experience-timeline">
          <div className="timeline-line"></div>
          {experience.map((exp, index) => (
            <div key={exp.title} className="experience-item">
              <div className="experience-header">
                <h3 className="experience-title">{exp.title}</h3>
                <div className="experience-company">{exp.company}</div>
                <div className="experience-period">{exp.period}</div>
              </div>
              <p>{exp.description}</p>
              <div className="achievements">
                <strong>Key Achievements:</strong>
                {exp.achievements.map((achievement, i) => (
                  <div key={i} className="achievement-item">
                    <span>🏆</span>
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`section contact-section fade-in ${isVisible.contact ? 'visible' : ''}`}>
        <div className="contact-card">
          <h2 className="contact-title">Let's Work Together</h2>
          <p className="contact-subtitle">
            Ready to bring your ideas to life? I'm always interested in hearing about new projects and opportunities.
          </p>
          <div className="hero-buttons">
            <a href="mailto:john@example.com" className="btn btn-primary">
              📧 Send Email
            </a>
            <a href="https://linkedin.com" className="btn btn-outline">
              💼 LinkedIn
            </a>
            <a href="https://github.com" className="btn btn-outline">
              🐙 GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Akash Nale. Built with React & Modern CSS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Portfolio;