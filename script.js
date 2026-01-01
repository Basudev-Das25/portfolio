// script.js - Complete JavaScript for Basudev Das Portfolio

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (mobileMenuBtn) {
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // In a real implementation, you would send this data to a server
        // For this demo, we'll just show an alert
        alert(`Thank you for your message, ${name}! I'll get back to you soon at ${email}.`);
        
        // Reset form
        contactForm.reset();
    });
}

// Smooth scrolling for anchor links
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

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if(window.scrollY > 50) {
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Resume Download Function (Option 3 - Complete Implementation)
function downloadResume() {
    // Try to download the PDF if it exists
    const pdfUrl = 'Basudev_Das_Resume.pdf';
    
    // Show loading indicator
    const downloadBtn = document.querySelector('.download-resume-btn');
    if (downloadBtn) {
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        downloadBtn.disabled = true;
        
        setTimeout(() => {
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
        }, 2000);
    }
    
    // Create a test to check if PDF exists
    fetch(pdfUrl, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                // PDF exists, download it
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.download = 'Basudev_Das_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Show success message
                showNotification('Resume downloaded successfully!', 'success');
            } else {
                // PDF doesn't exist, generate HTML version
                generateHTMLResume();
            }
        })
        .catch(() => {
            // Error occurred, generate HTML version
            generateHTMLResume();
        });
}

function generateHTMLResume() {
    // Create a modal with resume content that can be printed
    const modal = document.createElement('div');
    modal.id = 'resume-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease;
    `;
    
    const resumeContent = document.createElement('div');
    resumeContent.style.cssText = `
        background: white;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        padding: 30px;
        border-radius: 10px;
        position: relative;
        animation: slideUp 0.3s ease;
    `;
    
    resumeContent.innerHTML = `
        <style>
            @media print {
                body * {
                    visibility: hidden;
                }
                #printable-resume, #printable-resume * {
                    visibility: visible;
                }
                #printable-resume {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    padding: 20px;
                }
                #printable-resume .no-print {
                    display: none !important;
                }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        </style>
        
        <div class="no-print" style="position: absolute; top: 15px; right: 15px; display: flex; gap: 10px;">
            <button onclick="printResume()" style="background: #4A90E2; color: white; border: none; padding: 8px 20px; border-radius: 4px; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-print"></i> Print/Save as PDF
            </button>
            <button onclick="closeResumeModal()" style="background: #e74c3c; color: white; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center;">×</button>
        </div>
        
        <div id="printable-resume" style="margin-top: 50px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="font-size: 32px; color: #2C3E50; margin-bottom: 10px; font-weight: 700;">Basudev Das</h1>
                <h2 style="font-size: 20px; color: #2E8B57; margin: 10px 0; font-weight: 600;">Python Developer & AI/ML Engineer</h2>
                <div style="font-size: 14px; margin: 15px 0; line-height: 1.6;">
                    <strong>Email:</strong> basduev1983@gmail.com | basudevd983@gmail.com<br>
                    <strong>Phone:</strong> +91 9836061605<br>
                    <strong>Location:</strong> Barrackpore, Kolkata, India<br>
                    <strong>LinkedIn:</strong> linkedin.com/in/basudev-das-17a513342<br>
                    <strong>GitHub:</strong> github.com/Basudev-Das25
                </div>
            </div>
            
            <div style="margin: 25px 0;">
                <h3 style="font-size: 22px; color: #2E8B57; border-bottom: 2px solid #2E8B57; padding-bottom: 5px; margin-bottom: 15px; font-weight: 600;">Professional Summary</h3>
                <p style="line-height: 1.6; margin-bottom: 15px;">Aspiring Python Developer with a strong grasp of programming and problem-solving. Enjoys building practical solutions and learning through hands-on projects. Looking to grow by working on real-world software development challenges.</p>
                <p style="line-height: 1.6;">Associate Software Engineer graduate (B.Tech CSE – AI & ML, 2025) with hands-on experience in software development, frontend engineering, and academic projects. Strong foundation in application design, development, testing, and deployment using JavaScript, React.js, HTML, CSS, Node.js, and Python. Demonstrated ability to analyze business requirements, deliver high-quality code, and collaborate effectively in dynamic development environments.</p>
            </div>
            
            <div style="margin: 25px 0;">
                <h3 style="font-size: 22px; color: #2E8B57; border-bottom: 2px solid #2E8B57; padding-bottom: 5px; margin-bottom: 15px; font-weight: 600;">Education</h3>
                <div style="margin: 20px 0; padding-left: 20px; border-left: 3px solid #4A90E2;">
                    <div style="font-weight: 600; color: #2C3E50; font-size: 18px;">Bachelor of Technology (B.Tech) – Computer Science Engineering (AI & ML)</div>
                    <div style="color: #4A90E2; font-style: italic; margin: 5px 0;">Brainware University, India</div>
                    <div style="color: #666; font-size: 14px; margin: 5px 0;">2021 – 2025 | CGPA: 7.92</div>
                    <p style="margin: 10px 0 0 0; color: #555;">Relevant Courses: Deep Learning, Machine Learning, Data Structures, Algorithms, Computer Vision, Chatbot Development</p>
                </div>
                <div style="margin: 20px 0; padding-left: 20px; border-left: 3px solid #4A90E2;">
                    <div style="font-weight: 600; color: #2C3E50; font-size: 18px;">PCM with Computer Science</div>
                    <div style="color: #4A90E2; font-style: italic; margin: 5px 0;">Army School Barrackpore</div>
                    <div style="color: #666; font-size: 14px; margin: 5px 0;">2020 - 2021 | Average CGPA: 7.92</div>
                </div>
            </div>
            
            <div style="margin: 25px 0;">
                <h3 style="font-size: 22px; color: #2E8B57; border-bottom: 2px solid #2E8B57; padding-bottom: 5px; margin-bottom: 15px; font-weight: 600;">Technical Skills</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        <div style="font-weight: 600; color: #2E8B57; margin-bottom: 5px;">Programming Languages</div>
                        <div>Python, JavaScript (ES6+)</div>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        <div style="font-weight: 600; color: #2E8B57; margin-bottom: 5px;">Frontend Technologies</div>
                        <div>React.js, HTML5, CSS3, Redux</div>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        <div style="font-weight: 600; color: #2E8B57; margin-bottom: 5px;">AI/ML & Data Science</div>
                        <div>TensorFlow, CNN, Pandas, Matplotlib</div>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        <div style="font-weight: 600; color: #2E8B57; margin-bottom: 5px;">Tools & Practices</div>
                        <div>Git/GitHub, Node.js, Express.js, Data Analysis</div>
                    </div>
                </div>
            </div>
            
            <div style="margin: 25px 0;">
                <h3 style="font-size: 22px; color: #2E8B57; border-bottom: 2px solid #2E8B57; padding-bottom: 5px; margin-bottom: 15px; font-weight: 600;">Work Experience</h3>
                <div style="margin: 20px 0; padding-left: 20px; border-left: 3px solid #4A90E2;">
                    <div style="font-weight: 600; color: #2C3E50; font-size: 18px;">Software Developer Intern / Academic Projects</div>
                    <div style="color: #4A90E2; font-style: italic; margin: 5px 0;">Brainware University</div>
                    <div style="color: #666; font-size: 14px; margin: 5px 0;">Oct 2024 – Dec 2024</div>
                    <ul style="margin: 10px 0; padding-left: 20px; color: #555;">
                        <li style="margin-bottom: 8px;">Designed and developed frontend application components using React.js and JavaScript based on functional requirements</li>
                        <li style="margin-bottom: 8px;">Implemented responsive user interfaces using HTML5 and CSS3 to ensure cross-device compatibility</li>
                        <li style="margin-bottom: 8px;">Participated in the full software development lifecycle including design, coding, testing, and debugging</li>
                        <li>Applied clean coding standards and modular architecture to improve maintainability</li>
                    </ul>
                </div>
            </div>
            
            <div style="margin: 25px 0;">
                <h3 style="font-size: 22px; color: #2E8B57; border-bottom: 2px solid #2E8B57; padding-bottom: 5px; margin-bottom: 15px; font-weight: 600;">Projects</h3>
                <div style="margin: 20px 0; padding-left: 20px; border-left: 3px solid #4A90E2;">
                    <div style="font-weight: 600; color: #2C3E50; font-size: 18px;">Oral Cancer Detection using Deep Learning</div>
                    <div style="color: #666; font-size: 14px; margin: 5px 0;">Oct 2024 – Jun 2025</div>
                    <p style="margin: 10px 0; color: #555;">Developed an image-based oral cancer detection system using a Convolutional Neural Network (CNN) with TensorFlow. Leveraged Pandas for data handling and Matplotlib for visualizing training performance and model accuracy. Focused on early detection by training the model on medical image datasets, improving precision through deep learning techniques and iterative evaluation.</p>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0;">
                        <span style="background: #e8f5ee; color: #2E8B57; padding: 4px 12px; border-radius: 20px; font-size: 13px;">Python</span>
                        <span style="background: #e8f5ee; color: #2E8B57; padding: 4px 12px; border-radius: 20px; font-size: 13px;">TensorFlow</span>
                        <span style="background: #e8f5ee; color: #2E8B57; padding: 4px 12px; border-radius: 20px; font-size: 13px;">CNN</span>
                        <span style="background: #e8f5ee; color: #2E8B57; padding: 4px 12px; border-radius: 20px; font-size: 13px;">Pandas</span>
                        <span style="background: #e8f5ee; color: #2E8B57; padding: 4px 12px; border-radius: 20px; font-size: 13px;">Matplotlib</span>
                    </div>
                </div>
                <div style="margin: 20px 0; padding-left: 20px; border-left: 3px solid #4A90E2;">
                    <div style="font-weight: 600; color: #2C3E50; font-size: 18px;">Chatbot using Python</div>
                    <p style="margin: 10px 0; color: #555;">Created an interactive chatbot using Python with natural language processing capabilities for answering questions and providing information.</p>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0;">
                        <span style="background: #e8f5ee; color: #2E8B57; padding: 4px 12px; border-radius: 20px; font-size: 13px;">Python</span>
                        <span style="background: #e8f5ee; color: #2E8B57; padding: 4px 12px; border-radius: 20px; font-size: 13px;">NLP</span>
                        <span style="background: #e8f5ee; color: #2E8B57; padding: 4px 12px; border-radius: 20px; font-size: 13px;">AI</span>
                    </div>
                </div>
            </div>
            
            <div style="margin: 25px 0;">
                <h3 style="font-size: 22px; color: #2E8B57; border-bottom: 2px solid #2E8B57; padding-bottom: 5px; margin-bottom: 15px; font-weight: 600;">Certifications</h3>
                <div style="margin: 15px 0; padding-left: 20px; border-left: 3px solid #4A90E2;">
                    <div style="font-weight: 600; color: #2C3E50;">Python using AI</div>
                    <div style="color: #4A90E2; margin: 5px 0;">AI for Techies | March 2025 - Present</div>
                    <p style="margin: 5px 0; color: #555;">Create interactive and effortless visualization with ease debugging and code generation using AI for 10x faster development.</p>
                </div>
                <div style="margin: 15px 0; padding-left: 20px; border-left: 3px solid #4A90E2;">
                    <div style="font-weight: 600; color: #2C3E50;">Rinex Artificial Intelligence Program</div>
                    <div style="color: #4A90E2; margin: 5px 0;">Cognizance, IIT Roorkee | July 2022 - September 2022</div>
                    <p style="margin: 5px 0; color: #555;">A program associated with building and understanding AI models for real life application and implementation.</p>
                </div>
            </div>
            
            <div style="margin: 25px 0;">
                <h3 style="font-size: 22px; color: #2E8B57; border-bottom: 2px solid #2E8B57; padding-bottom: 5px; margin-bottom: 15px; font-weight: 600;">Languages</h3>
                <div style="display: flex; gap: 30px;">
                    <div>
                        <div style="font-weight: 600; color: #2C3E50;">English</div>
                        <div style="color: #555;">Full Professional Proficiency</div>
                    </div>
                    <div>
                        <div style="font-weight: 600; color: #2C3E50;">Hindi</div>
                        <div style="color: #555;">Full Professional Proficiency</div>
                    </div>
                </div>
            </div>
            
            <div style="margin: 25px 0;">
                <h3 style="font-size: 22px; color: #2E8B57; border-bottom: 2px solid #2E8B57; padding-bottom: 5px; margin-bottom: 15px; font-weight: 600;">Interests</h3>
                <div style="color: #555;">
                    Coding challenges, Learning new programming languages, AI/ML research, Open source contributions
                </div>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee; font-size: 12px; color: #666; text-align: center;">
                <p>Generated from Basudev Das Portfolio • ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p class="no-print">Click "Print/Save as PDF" button above to save as PDF or print this resume</p>
            </div>
        </div>
    `;
    
    modal.appendChild(resumeContent);
    document.body.appendChild(modal);
    
    // Add close on ESC key
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeResumeModal();
        }
    });
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
}

// Helper function to print resume
function printResume() {
    window.print();
}

// Helper function to close resume modal
function closeResumeModal() {
    const modal = document.getElementById('resume-modal');
    if (modal) {
        modal.remove();
    }
    document.body.style.overflow = 'auto';
}

// Notification function
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#2E8B57' : '#4A90E2'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
    notification.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// GitHub API Integration
async function fetchGitHubRepos() {
    const username = 'Basudev-Das25';
    const reposContainer = document.getElementById('github-repos');
    const spinner = document.getElementById('github-spinner');
    const repoCountElement = document.getElementById('repo-count');
    const languageCountElement = document.getElementById('language-count');
    const latestUpdateElement = document.getElementById('latest-update');
    
    // Return early if elements don't exist
    if (!reposContainer) return;
    
    // Show loading spinner
    if (spinner) spinner.style.display = 'block';
    reposContainer.innerHTML = '';
    
    try {
        // Fetch user repositories
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const repos = await response.json();
        
        // Update repo count
        if (repoCountElement) {
            repoCountElement.textContent = repos.length;
        }
        
        // Find the latest update date
        if (latestUpdateElement && repos.length > 0) {
            const latestRepo = repos[0];
            const updateDate = new Date(latestRepo.updated_at);
            latestUpdateElement.textContent = updateDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }
        
        // Count unique languages
        if (languageCountElement) {
            const languages = new Set();
            repos.forEach(repo => {
                if (repo.language) {
                    languages.add(repo.language);
                }
            });
            languageCountElement.textContent = languages.size;
        }
        
        // Display repositories
        repos.forEach(repo => {
            const repoCard = document.createElement('div');
            repoCard.className = 'project-card';
            
            // Determine icon based on language or topic
            let icon = 'fas fa-code';
            if (repo.language === 'Python') icon = 'fab fa-python';
            if (repo.language === 'JavaScript') icon = 'fab fa-js-square';
            if (repo.language === 'HTML') icon = 'fab fa-html5';
            if (repo.language === 'CSS') icon = 'fab fa-css3-alt';
            
            // Determine color based on language
            let bgColor = 'linear-gradient(135deg, #2E8B57 0%, #4A90E2 100%)';
            if (repo.language === 'Python') bgColor = 'linear-gradient(135deg, #3776AB 0%, #FFD43B 100%)';
            if (repo.language === 'JavaScript') bgColor = 'linear-gradient(135deg, #F7DF1E 0%, #000000 100%)';
            if (repo.language === 'HTML') bgColor = 'linear-gradient(135deg, #E34F26 0%, #F06529 100%)';
            
            repoCard.innerHTML = `
                <div class="project-img" style="background: ${bgColor};">
                    <i class="${icon}" style="color: white;"></i>
                </div>
                <div class="project-content">
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available.'}</p>
                    <div class="project-tech">
                        ${repo.language ? `<span class="tech-tag">${repo.language}</span>` : ''}
                        <span class="tech-tag">${repo.stargazers_count} <i class="fas fa-star"></i></span>
                        <span class="tech-tag">${repo.forks_count} <i class="fas fa-code-branch"></i></span>
                    </div>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank"><i class="fab fa-github"></i> View Code</a>
                        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                    </div>
                </div>
            `;
            
            reposContainer.appendChild(repoCard);
        });
        
        // Hide spinner
        if (spinner) spinner.style.display = 'none';
        
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        if (spinner) spinner.style.display = 'none';
        reposContainer.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 40px;">Unable to load GitHub repositories. Please check your connection or try again later.</p>';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Fetch GitHub repositories
    fetchGitHubRepos();
    
    // Check if we're on the resume download section
    if(window.location.hash === '#resume-download') {
        setTimeout(() => {
            downloadResume();
            // Remove the hash from URL
            history.replaceState(null, null, ' ');
        }, 500);
    }
    
    // Add event listeners to all download resume buttons
    document.querySelectorAll('.download-resume-btn').forEach(button => {
        button.addEventListener('click', downloadResume);
    });
});