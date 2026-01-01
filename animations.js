// animations.js - Handles all animations and interactive effects
export function initializeAnimations(portfolio) {
    return {
        // Typewriter effect for hero section
        initTypewriter() {
            const typingText = document.querySelector('.typing-text');
            if (!typingText) return;
            
            const texts = [
                'Python Developer',
                'AI/ML Engineer',
                'Full Stack Developer',
                'Problem Solver'
            ];
            let textIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            let isStopped = false;
            
            function type() {
                if (isStopped) return;
                
                const currentText = texts[textIndex];
                
                if (isDeleting) {
                    typingText.textContent = currentText.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    typingText.textContent = currentText.substring(0, charIndex + 1);
                    charIndex++;
                }
                
                if (!isDeleting && charIndex === currentText.length) {
                    isDeleting = true;
                    setTimeout(type, 2000); // Pause at end
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    setTimeout(type, 500); // Pause before next text
                } else {
                    const speed = isDeleting ? 50 : 100;
                    setTimeout(type, speed);
                }
            }
            
            // Start typing after a delay
            setTimeout(type, 1000);
            
            // Stop animation when page is not visible
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    isStopped = true;
                } else {
                    isStopped = false;
                    type();
                }
            });
        },
        
        // Scroll animations
        initScrollAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            // Observe all elements with animation classes
            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                observer.observe(el);
            });
        },
        
        // Skill circles hover effects
        initSkillCircles() {
            const circles = document.querySelectorAll('.skill-circle');
            
            circles.forEach(circle => {
                circle.addEventListener('mouseenter', (e) => {
                    const skill = e.target.getAttribute('data-skill');
                    this.showSkillTooltip(e, skill);
                });
                
                circle.addEventListener('mouseleave', () => {
                    this.hideSkillTooltip();
                });
                
                circle.addEventListener('click', (e) => {
                    const skill = e.target.getAttribute('data-skill');
                    portfolio.showNotification(`Clicked on ${skill} skill!`, 'info');
                });
            });
        },
        
        // Parallax effects
        initParallax() {
            // Only add parallax on desktop
            if (window.innerWidth > 768) {
                window.addEventListener('scroll', () => {
                    const scrolled = window.pageYOffset;
                    const hero = document.querySelector('.hero');
                    const speed = 0.5;
                    
                    if (hero) {
                        hero.style.backgroundPositionY = (scrolled * speed) + 'px';
                    }
                });
            }
        },
        
        // Initialize all animations
        initialize() {
            this.initTypewriter();
            this.initScrollAnimations();
            this.initSkillCircles();
            this.initParallax();
            
            // Animate hero elements on load
            setTimeout(() => {
                this.animateHeroElements();
            }, 500);
        },
        
        // Animate hero section elements
        animateHeroElements() {
            const heroText = document.querySelector('.hero-text h1');
            const heroParagraph = document.querySelector('.hero-text p');
            const heroButtons = document.querySelector('.hero-btns');
            const heroImage = document.querySelector('.hero-image');
            const contactInfo = document.querySelector('.contact-info');
            
            if (heroText) {
                heroText.style.opacity = '1';
                heroText.style.transform = 'translateY(0)';
            }
            
            if (heroParagraph) {
                setTimeout(() => {
                    heroParagraph.style.opacity = '1';
                    heroParagraph.style.transform = 'translateY(0)';
                }, 300);
            }
            
            if (heroButtons) {
                setTimeout(() => {
                    heroButtons.style.opacity = '1';
                    heroButtons.style.transform = 'translateY(0)';
                }, 600);
            }
            
            if (heroImage) {
                setTimeout(() => {
                    heroImage.style.opacity = '1';
                    heroImage.style.transform = 'translateX(0)';
                }, 900);
            }
            
            if (contactInfo) {
                setTimeout(() => {
                    contactInfo.style.opacity = '1';
                    contactInfo.style.transform = 'translateY(0)';
                }, 1200);
            }
        },
        
        // Tooltip functions
        showSkillTooltip(event, skill) {
            this.hideSkillTooltip(); // Remove any existing tooltip
            
            const tooltip = document.createElement('div');
            tooltip.className = 'skill-tooltip';
            tooltip.textContent = `Expert in ${skill}`;
            tooltip.style.position = 'fixed';
            tooltip.style.background = 'var(--dark)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '8px 12px';
            tooltip.style.borderRadius = '6px';
            tooltip.style.fontSize = '0.9rem';
            tooltip.style.zIndex = '1000';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            
            const rect = event.target.getBoundingClientRect();
            tooltip.style.top = (rect.top - 40) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2) + 'px';
            tooltip.style.transform = 'translateX(-50%)';
            
            document.body.appendChild(tooltip);
        },
        
        hideSkillTooltip() {
            const tooltips = document.querySelectorAll('.skill-tooltip');
            tooltips.forEach(tooltip => tooltip.remove());
        }
    };
}