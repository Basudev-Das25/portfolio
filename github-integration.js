// github-integration.js - Handles GitHub API integration
export function initializeGitHub(portfolio) {
    const GITHUB_USERNAME = 'Basudev-Das25';
    const EXCLUDED_REPOS = ['portfolio', 'Basudev-Das25', 'resume', 'cv', 'test'];
    
    return {
        async fetchGitHubData() {
            try {
                // Show loading spinner
                const spinner = document.getElementById('github-spinner');
                if (spinner) spinner.style.display = 'block';
                
                // Fetch repositories
                const repos = await this.fetchRepositories();
                
                // Update stats
                this.updateStats(repos);
                
                // Display repositories
                this.displayRepositories(repos);
                
                // Hide spinner
                if (spinner) spinner.style.display = 'none';
                
            } catch (error) {
                console.error('Error fetching GitHub data:', error);
                this.showError();
                const spinner = document.getElementById('github-spinner');
                if (spinner) spinner.style.display = 'none';
            }
        },
        
        async fetchRepositories() {
            try {
                const response = await fetch(
                    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`,
                    {
                        headers: {
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    }
                );
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch repositories: ${response.status}`);
                }
                
                let repos = await response.json();
                
                // Filter out excluded repositories
                repos = repos.filter(repo => 
                    !EXCLUDED_REPOS.includes(repo.name.toLowerCase()) &&
                    !repo.fork &&
                    !repo.private
                );
                
                return repos;
            } catch (error) {
                console.error('GitHub API error:', error);
                throw error;
            }
        },
        
        updateStats(repos) {
            // Repository count
            const repoCountEl = document.getElementById('repo-count');
            if (repoCountEl) repoCountEl.textContent = repos.length;
            
            // Languages used
            const languages = new Set();
            let totalStars = 0;
            let latestDate = null;
            
            repos.forEach(repo => {
                if (repo.language) {
                    languages.add(repo.language);
                }
                totalStars += repo.stargazers_count;
                
                const updatedAt = new Date(repo.updated_at);
                if (!latestDate || updatedAt > latestDate) {
                    latestDate = updatedAt;
                }
            });
            
            // Language count
            const languageCountEl = document.getElementById('language-count');
            if (languageCountEl) languageCountEl.textContent = languages.size;
            
            // Total stars
            const totalStarsEl = document.getElementById('total-stars');
            if (totalStarsEl) totalStarsEl.textContent = totalStars;
            
            // Latest update
            const latestUpdateEl = document.getElementById('latest-update');
            if (latestUpdateEl && latestDate) {
                const formattedDate = latestDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
                latestUpdateEl.textContent = formattedDate;
            }
        },
        
        displayRepositories(repos) {
            const container = document.getElementById('github-repos');
            if (!container) return;
            
            if (repos.length === 0) {
                container.innerHTML = `
                    <div class="no-repos-message" style="text-align: center; padding: 40px; color: #666;">
                        <i class="fas fa-code-branch" style="font-size: 3rem; margin-bottom: 20px; color: #ccc;"></i>
                        <h3 style="color: #333; margin-bottom: 10px;">No GitHub Projects Available</h3>
                        <p>GitHub projects will appear here when you create public repositories.</p>
                        <a href="https://github.com/new" target="_blank" class="btn btn-primary" style="margin-top: 20px;">
                            Create Your First Repository
                        </a>
                    </div>
                `;
                return;
            }
            
            // Display only top 6 repositories
            const displayRepos = repos.slice(0, 6);
            
            container.innerHTML = displayRepos.map(repo => `
                <div class="github-repo-card animate-on-scroll" style="
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    transition: transform 0.3s ease;
                ">
                    <div class="repo-header" style="
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 15px;
                    ">
                        <h3 style="margin: 0; font-size: 1.2rem;">
                            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" style="
                                color: #2E8B57;
                                text-decoration: none;
                            ">
                                ${repo.name}
                            </a>
                        </h3>
                        ${repo.language ? `
                            <span class="repo-language" style="
                                background: #e9ecef;
                                padding: 4px 8px;
                                border-radius: 12px;
                                font-size: 0.85rem;
                                color: #495057;
                            ">
                                ${repo.language}
                            </span>
                        ` : ''}
                    </div>
                    
                    <p class="repo-description" style="
                        color: #666;
                        margin-bottom: 15px;
                        font-size: 0.95rem;
                        line-height: 1.5;
                    ">
                        ${repo.description || 'No description available.'}
                    </p>
                    
                    <div class="repo-stats" style="
                        display: flex;
                        gap: 15px;
                        margin-bottom: 15px;
                        font-size: 0.9rem;
                        color: #6c757d;
                    ">
                        <span class="repo-stat">
                            <i class="fas fa-star"></i>
                            ${repo.stargazers_count}
                        </span>
                        <span class="repo-stat">
                            <i class="fas fa-code-branch"></i>
                            ${repo.forks_count}
                        </span>
                        <span class="repo-stat">
                            <i class="fas fa-calendar-alt"></i>
                            ${new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                    
                    <div class="repo-footer" style="
                        display: flex;
                        gap: 10px;
                        margin-top: 15px;
                    ">
                        <a href="${repo.html_url}" target="_blank" class="btn btn-outline btn-sm" style="
                            padding: 6px 12px;
                            font-size: 0.85rem;
                        ">
                            <i class="fab fa-github"></i> View Code
                        </a>
                        ${repo.homepage ? `
                            <a href="${repo.homepage}" target="_blank" class="btn btn-primary btn-sm" style="
                                padding: 6px 12px;
                                font-size: 0.85rem;
                            ">
                                <i class="fas fa-external-link-alt"></i> Live Demo
                            </a>
                        ` : ''}
                    </div>
                </div>
            `).join('');
            
            // Add hover effects
            container.querySelectorAll('.github-repo-card').forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-5px)';
                });
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0)';
                });
            });
        },
        
        showError() {
            const container = document.getElementById('github-repos');
            if (!container) return;
            
            container.innerHTML = `
                <div class="error-message" style="
                    text-align: center;
                    padding: 40px;
                    background: #fff8f8;
                    border-radius: 12px;
                    border: 1px solid #ffcccc;
                ">
                    <i class="fas fa-exclamation-triangle" style="
                        font-size: 3rem;
                        color: #dc3545;
                        margin-bottom: 20px;
                    "></i>
                    <h3 style="color: #721c24; margin-bottom: 10px;">Unable to load GitHub projects</h3>
                    <p style="color: #856404; margin-bottom: 20px;">
                        Please check your internet connection or try again later.
                    </p>
                    <button class="btn btn-outline retry-btn" style="
                        background: white;
                        border: 1px solid #2E8B57;
                        color: #2E8B57;
                        padding: 8px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                    ">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </div>
            `;
            
            // Add retry functionality
            const retryBtn = container.querySelector('.retry-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    this.fetchGitHubData();
                });
            }
        },
        
        initialize() {
            // Fetch GitHub data on load
            this.fetchGitHubData();
            
            // Auto-refresh every 5 minutes (optional)
            setInterval(() => {
                this.fetchGitHubData();
            }, 5 * 60 * 1000);
        }
    };
}