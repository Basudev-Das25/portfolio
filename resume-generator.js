// resume-generator.js - Handles resume download and generation
export function initializeResume(portfolio) {
    return {
        initResumeDownload() {
            const downloadBtn = document.querySelector('.download-resume-btn');
            
            if (downloadBtn) {
                downloadBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.downloadResume();
                });
            }
        },
        
        async downloadResume() {
            // Show loading state
            const originalText = this.updateButtonState(true);
            
            try {
                // Check if PDF exists
                const pdfExists = await this.checkPdfExists();
                
                if (pdfExists) {
                    // Download existing PDF
                    this.downloadPdf();
                    portfolio.showNotification('Resume downloaded successfully!', 'success');
                } else {
                    // Generate and show resume modal
                    this.showResumeModal();
                    portfolio.showNotification('Resume opened for printing/saving', 'info');
                }
            } catch (error) {
                console.error('Error downloading resume:', error);
                portfolio.showNotification('Failed to download resume. You can contact me directly.', 'error');
            } finally {
                // Restore button state
                setTimeout(() => {
                    this.updateButtonState(false, originalText);
                }, 1000);
            }
        },
        
        updateButtonState(isLoading, originalText = null) {
            const button = document.querySelector('.download-resume-btn');
            
            if (!button) return null;
            
            if (isLoading) {
                originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                button.disabled = true;
                return originalText;
            } else {
                if (originalText) {
                    button.innerHTML = originalText;
                }
                button.disabled = false;
                return null;
            }
        },
        
        async checkPdfExists() {
            try {
                const response = await fetch('resume.pdf', { method: 'HEAD' });
                return response.ok;
            } catch {
                return false;
            }
        },
        
        downloadPdf() {
            const link = document.createElement('a');
            link.href = 'resume.pdf';
            link.download = 'Basudev_Das_Resume.pdf';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        
        showResumeModal() {
            // Remove any existing modal
            const existingModal = document.querySelector('.resume-modal');
            if (existingModal) existingModal.remove();
            
            const modal = this.createResumeModal();
            document.body.appendChild(modal);
            
            // Add event listeners
            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.remove();
            });
            
            modal.querySelector('.print-resume').addEventListener('click', () => {
                this.printResume();
            });
            
            // Close on escape key
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    modal.remove();
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
            
            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                    document.removeEventListener('keydown', escapeHandler);
                }
            });
            
            // Prevent scrolling when modal is open
            document.body.style.overflow = 'hidden';
            
            // Cleanup when modal is removed
            const observer = new MutationObserver(() => {
                if (!document.contains(modal)) {
                    document.body.style.overflow = '';
                    document.removeEventListener('keydown', escapeHandler);
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true });
        },
        
        createResumeModal() {
            const modal = document.createElement('div');
            modal.className = 'resume-modal';
            modal.innerHTML = `
                <div class="resume-modal-content" style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                    width: 90%;
                    max-width: 800px;
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                    z-index: 10000;
                ">
                    <div class="resume-modal-header" style="
                        padding: 20px;
                        border-bottom: 1px solid #e9ecef;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <h2 style="margin: 0; color: #2E8B57;">Basudev Das - Resume</h2>
                        <div class="resume-modal-actions" style="display: flex; gap: 10px;">
                            <button class="btn btn-primary print-resume" style="
                                background: #2E8B57;
                                color: white;
                                border: none;
                                padding: 8px 16px;
                                border-radius: 6px;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                gap: 8px;
                            ">
                                <i class="fas fa-print"></i> Print/Save as PDF
                            </button>
                            <button class="btn btn-outline close-modal" style="
                                background: white;
                                border: 1px solid #2E8B57;
                                color: #2E8B57;
                                padding: 8px 16px;
                                border-radius: 6px;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                gap: 8px;
                            ">
                                <i class="fas fa-times"></i> Close
                            </button>
                        </div>
                    </div>
                    <div class="resume-modal-body" style="
                        padding: 20px;
                        overflow-y: auto;
                        flex-grow: 1;
                    " id="printable-resume">
                        ${this.generateResumeHtml()}
                    </div>
                </div>
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    z-index: 9999;
                "></div>
            `;
            return modal;
        },
        
        generateResumeHtml() {
            return `
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
                        .no-print {
                            display: none !important;
                        }
                    }
                    
                    .resume-content {
                        font-family: 'Inter', sans-serif;
                        color: #333;
                        line-height: 1.6;
                    }
                    
                    .resume-header {
                        text-align: center;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 2px solid #2E8B57;
                    }
                    
                    .resume-header h1 {
                        font-size: 2.5rem;
                        color: #2E8B57;
                        margin-bottom: 10px;
                    }
                    
                    .resume-header h2 {
                        font-size: 1.5rem;
                        color: #4A90E2;
                        margin-bottom: 20px;
                        font-weight: 500;
                    }
                    
                    .contact-info {
                        display: flex;
                        justify-content: center;
                        gap: 20px;
                        flex-wrap: wrap;
                        font-size: 1rem;
                    }
                    
                    .contact-info p {
                        margin: 5px 0;
                    }
                    
                    .resume-section {
                        margin-bottom: 25px;
                    }
                    
                    .resume-section h3 {
                        font-size: 1.3rem;
                        color: #2E8B57;
                        margin-bottom: 15px;
                        padding-bottom: 5px;
                        border-bottom: 1px solid #e9ecef;
                    }
                    
                    .resume-item {
                        margin-bottom: 15px;
                    }
                    
                    .resume-item-header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 5px;
                    }
                    
                    .resume-item-title {
                        font-weight: 600;
                        font-size: 1.1rem;
                    }
                    
                    .resume-item-date {
                        color: #666;
                    }
                    
                    .resume-item-subtitle {
                        color: #4A90E2;
                        margin-bottom: 5px;
                    }
                    
                    .skills-list {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px;
                        margin-top: 10px;
                    }
                    
                    .skill-tag {
                        background: #e9ecef;
                        padding: 5px 12px;
                        border-radius: 20px;
                        font-size: 0.9rem;
                    }
                </style>
                
                <div class="resume-content">
                    <div class="resume-header">
                        <h1>Basudev Das</h1>
                        <h2>Python Developer & AI/ML Engineer</h2>
                        <div class="contact-info">
                            <p><strong>Email:</strong> basduev1983@gmail.com</p>
                            <p><strong>Phone:</strong> +91 9836061605</p>
                            <p><strong>Location:</strong> Barrackpore, Kolkata, India</p>
                            <p><strong>GitHub:</strong> github.com/Basudev-Das25</p>
                        </div>
                    </div>
                    
                    <div class="resume-section">
                        <h3>Summary</h3>
                        <p>Aspiring Python Developer with a strong grasp of programming and problem-solving. Enjoys building practical solutions and learning through hands-on projects. Passionate about AI/ML technologies and full-stack development.</p>
                    </div>
                    
                    <div class="resume-section">
                        <h3>Technical Skills</h3>
                        <div class="skills-list">
                            <span class="skill-tag">Python</span>
                            <span class="skill-tag">JavaScript</span>
                            <span class="skill-tag">React.js</span>
                            <span class="skill-tag">TensorFlow</span>
                            <span class="skill-tag">Deep Learning</span>
                            <span class="skill-tag">Pandas</span>
                            <span class="skill-tag">Matplotlib</span>
                            <span class="skill-tag">HTML5/CSS3</span>
                            <span class="skill-tag">Git</span>
                            <span class="skill-tag">Data Analysis</span>
                        </div>
                    </div>
                    
                    <div class="resume-section">
                        <h3>Projects</h3>
                        <div class="resume-item">
                            <div class="resume-item-header">
                                <div class="resume-item-title">Oral Cancer Detection using Deep Learning</div>
                            </div>
                            <p>Developed an image-based oral cancer detection system using CNN with TensorFlow for accurate diagnosis.</p>
                        </div>
                        <div class="resume-item">
                            <div class="resume-item-header">
                                <div class="resume-item-title">Chatbot using Python</div>
                            </div>
                            <p>Created an interactive chatbot with natural language processing capabilities for intelligent conversations.</p>
                        </div>
                        <div class="resume-item">
                            <div class="resume-item-header">
                                <div class="resume-item-title">Data Analysis Dashboard</div>
                            </div>
                            <p>Interactive dashboard for data analysis and visualization built with Python and React.js.</p>
                        </div>
                    </div>
                    
                    <div class="resume-section">
                        <h3>Experience</h3>
                        <div class="resume-item">
                            <div class="resume-item-header">
                                <div class="resume-item-title">Software Developer Intern</div>
                                <div class="resume-item-date">Oct 2024 - Dec 2024</div>
                            </div>
                            <div class="resume-item-subtitle">Brainware University</div>
                            <p>Designed and developed frontend components using React.js and JavaScript.</p>
                        </div>
                    </div>
                    
                    <div class="resume-section">
                        <h3>Education</h3>
                        <div class="resume-item">
                            <div class="resume-item-header">
                                <div class="resume-item-title">B.Tech in Computer Science Engineering (AI & ML)</div>
                                <div class="resume-item-date">2021 - 2025</div>
                            </div>
                            <div class="resume-item-subtitle">Brainware University</div>
                            <p>CGPA: 7.92</p>
                        </div>
                        <div class="resume-item">
                            <div class="resume-item-header">
                                <div class="resume-item-title">PCM with Computer Science</div>
                                <div class="resume-item-date">2020 - 2021</div>
                            </div>
                            <div class="resume-item-subtitle">Army School Barrackpore</div>
                            <p>Average CGPA: 7.92</p>
                        </div>
                    </div>
                    
                    <div class="resume-section">
                        <h3>Certifications</h3>
                        <div class="resume-item">
                            <div class="resume-item-title">Python using AI</div>
                            <div class="resume-item-subtitle">AI for Techies | March 2025 - Present</div>
                        </div>
                        <div class="resume-item">
                            <div class="resume-item-title">Artificial Intelligence Program</div>
                            <div class="resume-item-subtitle">Rinex with Cognizance IIT Roorkee | July 2022 - September 2022</div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        printResume() {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Basudev Das - Resume</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                                color: #333;
                                padding: 20px;
                            }
                            @media print {
                                @page {
                                    margin: 0.5in;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        ${document.getElementById('printable-resume').innerHTML}
                        <script>
                            window.onload = function() {
                                window.print();
                                setTimeout(function() {
                                    window.close();
                                }, 1000);
                            }
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        },
        
        initialize() {
            this.initResumeDownload();
        }
    };
}