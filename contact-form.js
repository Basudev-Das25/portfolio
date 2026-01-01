// contact-form.js - Handles contact form submission
export function initializeContactForm(portfolio) {
    return {
        initContactForm() {
            const form = document.getElementById('contactForm');
            
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleFormSubmit(form);
                });
                
                // Add real-time validation
                this.addFormValidation(form);
            }
        },
        
        addFormValidation(form) {
            const inputs = form.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        },
        
        validateField(field) {
            const value = field.value.trim();
            let isValid = true;
            let errorMessage = '';
            
            switch(field.id) {
                case 'name':
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = 'Name must be at least 2 characters';
                    }
                    break;
                case 'email':
                    if (!this.isValidEmail(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                    break;
                case 'subject':
                    if (value.length < 3) {
                        isValid = false;
                        errorMessage = 'Subject must be at least 3 characters';
                    }
                    break;
                case 'message':
                    if (value.length < 10) {
                        isValid = false;
                        errorMessage = 'Message must be at least 10 characters';
                    }
                    break;
            }
            
            if (!isValid) {
                this.showFieldError(field, errorMessage);
            } else {
                this.clearFieldError(field);
            }
            
            return isValid;
        },
        
        showFieldError(field, message) {
            this.clearFieldError(field);
            
            const error = document.createElement('div');
            error.className = 'field-error';
            error.textContent = message;
            error.style.color = '#dc3545';
            error.style.fontSize = '0.85rem';
            error.style.marginTop = '5px';
            
            field.style.borderColor = '#dc3545';
            field.parentNode.appendChild(error);
        },
        
        clearFieldError(field) {
            const existingError = field.parentNode.querySelector('.field-error');
            if (existingError) {
                existingError.remove();
            }
            field.style.borderColor = '';
        },
        
        async handleFormSubmit(form) {
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Validate all fields
            let isValid = true;
            form.querySelectorAll('input, textarea').forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                portfolio.showNotification('Please fix the errors in the form', 'error');
                return;
            }
            
            // Show loading state
            this.setFormLoading(true);
            
            try {
                // In production, you would send this to your backend
                // For demo, we'll simulate API call
                await this.sendContactForm(data);
                
                // Show success message
                portfolio.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                
                // Reset form
                form.reset();
                
                // Clear any remaining errors
                form.querySelectorAll('.field-error').forEach(error => error.remove());
                form.querySelectorAll('input, textarea').forEach(field => {
                    field.style.borderColor = '';
                });
                
            } catch (error) {
                // Show error message
                portfolio.showNotification('Failed to send message. Please try again or email me directly.', 'error');
                console.error('Form submission error:', error);
                
            } finally {
                // Reset loading state
                this.setFormLoading(false);
            }
        },
        
        validateForm(data) {
            const { name, email, subject, message } = data;
            
            // Basic validation
            if (!name || name.trim().length < 2) {
                portfolio.showNotification('Please enter a valid name', 'error');
                return false;
            }
            
            if (!email || !this.isValidEmail(email)) {
                portfolio.showNotification('Please enter a valid email address', 'error');
                return false;
            }
            
            if (!subject || subject.trim().length < 3) {
                portfolio.showNotification('Please enter a subject', 'error');
                return false;
            }
            
            if (!message || message.trim().length < 10) {
                portfolio.showNotification('Please enter a message (minimum 10 characters)', 'error');
                return false;
            }
            
            return true;
        },
        
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        
        setFormLoading(isLoading) {
            const submitBtn = document.querySelector('#contactForm button[type="submit"]');
            if (!submitBtn) return;
            
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');
            
            if (isLoading) {
                if (btnText) btnText.style.display = 'none';
                if (btnLoader) btnLoader.style.display = 'inline-block';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
                submitBtn.style.cursor = 'not-allowed';
            } else {
                if (btnText) btnText.style.display = 'inline-block';
                if (btnLoader) btnLoader.style.display = 'none';
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
            }
        },
        
        async sendContactForm(data) {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // For demo purposes, log the data
            console.log('Contact form data:', data);
            
            // In production, replace with actual API call
            // Example:
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            
            // if (!response.ok) throw new Error('Failed to send message');
            
            // Return success for demo
            return { success: true, message: 'Message sent successfully' };
        },
        
        initialize() {
            this.initContactForm();
        }
    };
}