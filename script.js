// script.js - Main JavaScript file
import { initializeAnimations } from './animations.js';
import { initializeGitHub } from './github-integration.js';
import { initializeResume } from './resume-generator.js';
import { initializeContactForm } from './contact-form.js';

class Portfolio {
    constructor() {
        this.sections = {};
        this.currentSection = 'home';
        this.animations = null;
        this.github = null;
        this.resume = null;
        this.contactForm = null;
    }

    async initialize() {
        console.log("Initializing portfolio...");
        
        // Initialize loading screen
        this.initializeLoadingScreen();
        
        // Initialize modules FIRST
        this.initModules();
        
        // Initialize core components
        this.initializeNavigation();
        this.initializeSmoothScroll();
        this.initializeTheme();
        this.initializeBackToTop();
        
        // Load initial data
        await this.loadInitialData();
        
        // Initialize animations
        if (this.animations && this.animations.initialize) {
            this.animations.initialize();
        }
        
        // Hide loading screen
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
            console.log("Loading screen hidden");
        }, 1000);
    }

    initModules() {
        // Initialize each module
        this.animations = initializeAnimations(this);
        this.github = initializeGitHub(this);
        this.resume = initializeResume(this);
        this.contactForm = initializeContactForm(this);
        
        // Initialize modules that have initialize method
        if (this.github && this.github.initialize) {
            this.github.initialize();
        }
        if (this.resume && this.resume.initialize) {
            this.resume.initialize();
        }
        if (this.contactForm && this.contactForm.initialize) {
            this.contactForm.initialize();
        }
    }

    initializeLoadingScreen() {
        // Set current year in footer
        const currentYear = document.getElementById('current-year');
        if (currentYear) {
            currentYear.textContent = new Date().getFullYear();
        }
        
        // Safety timeout to hide loading screen if something fails
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
                loadingScreen.classList.add('hidden');
                console.log("Loading screen force-hidden");
            }
        }, 5000);
    }

    initializeNavigation() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        const navItems = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
        }

        // Close mobile menu when clicking a link
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks) navLinks.classList.remove('active');
                if (mobileMenuBtn) mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                
                // Update active nav item
                navItems.forEach(item => item.classList.remove('active'));
                link.classList.add('active');
                this.currentSection = link.getAttribute('data-target');
            });
        });

        // Update active nav on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNav();
        });
    }

    updateActiveNav() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('data-section');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-target') === current) {
                link.classList.add('active');
            }
        });
    }

    initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                if(this.getAttribute('href') === '#') return;
                
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if(targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initializeTheme() {
        // Theme switching logic can be added here
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        if (prefersDark.matches) {
            document.body.classList.add('dark-mode');
        }
    }

    initializeBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });
            
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    async loadInitialData() {
        // Load skills data
        await this.loadSkills();
        
        // Load projects data
        await this.loadProjects();
        
        // Load certifications data
        await this.loadCertifications();
        
        // Load timeline data
        await this.loadTimeline();
    }

    async loadSkills() {
        console.log("Loading skills...");
        
        const skillsData = [
            {
                category: 'Programming Languages',
                icon: 'fas fa-code',
                skills: [
                    { name: 'Python', level: 90 },
                    { name: 'JavaScript', level: 80 },
                    { name: 'C++', level: 70 }
                ]
            },
            {
                category: 'Frontend Development',
                icon: 'fas fa-laptop-code',
                skills: [
                    { name: 'HTML5/CSS3', level: 85 },
                    { name: 'React.js', level: 75 },
                    { name: 'Vue.js', level: 65 }
                ]
            },
            {
                category: 'AI/ML & Data Science',
                icon: 'fas fa-brain',
                skills: [
                    { name: 'TensorFlow', level: 85 },
                    { name: 'Deep Learning (CNN)', level: 85 },
                    { name: 'Pandas & Matplotlib', level: 90 },
                    { name: 'Data Analysis', level: 80 }
                ]
            }
        ];

        const container = document.getElementById('skills-container');
        console.log("Skills container found:", container);
        
        if (!container) {
            console.error("Skills container not found!");
            return;
        }
        
        container.innerHTML = skillsData.map(category => `
            <div class="skill-category animate-on-scroll">
                <h3><i class="${category.icon}"></i> ${category.category}</h3>
                <ul class="skill-list">
                    ${category.skills.map(skill => `
                        <li>
                            <span class="skill-name">${skill.name}</span>
                            <div class="skill-level">
                                <div class="skill-level-bar" style="width: ${skill.level}%"></div>
                            </div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `).join('');
        
        console.log("Skills loaded successfully!");
    }

    async loadProjects() {
        console.log("Loading projects...");
        
        const projectsData = [
            {
                title: 'Oral Cancer Detection using Deep Learning',
                description: 'Developed an image-based oral cancer detection system using CNN with TensorFlow.',
                tags: ['Python', 'TensorFlow', 'CNN', 'Pandas', 'Matplotlib'],
                category: 'ai-ml'
            },
            {
                title: 'Chatbot using Python',
                description: 'Created an interactive chatbot with natural language processing capabilities.',
                tags: ['Python', 'NLP', 'AI'],
                category: 'ai-ml'
            },
            {
                title: 'Data Analysis Dashboard',
                description: 'Interactive dashboard for data analysis and visualization built with Python and React.',
                tags: ['Python', 'React.js', 'Data Visualization', 'Pandas'],
                category: 'web'
            }
        ];

        const container = document.getElementById('projects-container');
        if (!container) return;
        
        container.innerHTML = projectsData.map(project => `
            <div class="project-card animate-on-scroll" data-category="${project.category}">
                <div class="project-img">
                    <i class="fas fa-project-diagram"></i>
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tech">
                        ${project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="#" class="btn btn-outline"><i class="fas fa-eye"></i> View Details</a>
                    </div>
                </div>
            </div>
        `).join('');

        // Initialize filter functionality
        this.initializeProjectFilter();
        console.log("Projects loaded!");
    }

    initializeProjectFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter projects
                const filter = button.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    async loadCertifications() {
        console.log("Loading certifications...");
        
        const certificationsData = [
            {
                title: 'Python using AI',
                organization: 'AI for Techies',
                date: 'March 2025 - Present',
                description: 'Create interactive visualization with ease debugging using AI for faster development.'
            },
            {
                title: 'Artificial Intelligence Program',
                organization: 'Rinex with Cognizance IIT Roorkee',
                date: 'July 2022 - September 2022',
                description: 'Building and understanding AI models for real life application and implementation.'
            }
        ];

        const container = document.getElementById('certifications-container');
        if (!container) return;
        
        container.innerHTML = certificationsData.map(cert => `
            <div class="cert-card animate-on-scroll">
                <h3>${cert.title}</h3>
                <div class="cert-org">${cert.organization}</div>
                <div class="cert-date">${cert.date}</div>
                <p>${cert.description}</p>
            </div>
        `).join('');
        
        console.log("Certifications loaded!");
    }

    async loadTimeline() {
        console.log("Loading timeline...");
        
        const timelineData = [
            {
                type: 'experience',
                date: 'Oct 2024 - Dec 2024',
                title: 'Software Developer Intern',
                subtitle: 'Brainware University',
                description: 'Designed and developed frontend components using React.js and JavaScript.'
            },
            {
                type: 'education',
                date: '2021 - 2025',
                title: 'B.Tech in Computer Science Engineering (AI & ML)',
                subtitle: 'Brainware University',
                description: 'CGPA: 7.92'
            },
            {
                type: 'education',
                date: '2020 - 2021',
                title: 'PCM with Computer Science',
                subtitle: 'Army School Barrackpore',
                description: 'Average CGPA: 7.92'
            }
        ];

        const container = document.querySelector('.timeline');
        if (!container) return;
        
        container.innerHTML = timelineData.map((item, index) => `
            <div class="timeline-item animate-on-scroll ${index % 2 === 0 ? 'left' : 'right'}">
                <div class="timeline-content ${item.type}">
                    <span class="timeline-date">${item.date}</span>
                    <h3>${item.title}</h3>
                    <h4>${item.subtitle}</h4>
                    <p>${item.description}</p>
                </div>
            </div>
        `).join('');
        
        console.log("Timeline loaded!");
    }

    // Utility methods
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        const notificationContainer = document.getElementById('notification-container');
        if (notificationContainer) {
            notificationContainer.appendChild(notification);
        }
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new Portfolio();
    window.portfolio.initialize().catch(error => {
        console.error("Failed to initialize portfolio:", error);
        // Force hide loading screen on error
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    });
});