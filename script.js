// ========================================
// Mobile Navigation Toggle
// ========================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

// ========================================
// Smooth Scrolling Navigation
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (window.innerWidth <= 968) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// ========================================
// Mobile Navigation Toggle Handlers
// ========================================

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ========================================
// Navbar Scroll Effect
// ========================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow on scroll
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    // Hide/show navbar on scroll (optional)
    // if (currentScroll > lastScroll && currentScroll > 100) {
    //     navbar.style.transform = 'translateY(-100%)';
    // } else {
    //     navbar.style.transform = 'translateY(0)';
    // }
    
    lastScroll = currentScroll;
});

// ========================================
// Dark/Light Theme Toggle
// ========================================
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-theme');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    
    // Update icon
    if (body.classList.contains('dark-theme')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// ========================================
// Scroll Animations
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all cards and sections for animation
const animateElements = document.querySelectorAll(
    '.project-card, .stat-card, .skill-category, .contact-card, .about-text, .about-stats'
);

animateElements.forEach((el, index) => {
    // Add animation delay based on index
    el.style.transitionDelay = `${index * 0.1}s`;
    
    // Add slide-in class based on position
    if (index % 2 === 0) {
        el.classList.add('slide-in-left');
    } else {
        el.classList.add('slide-in-right');
    }
    
    observer.observe(el);
});

// ========================================
// Active Navigation Link Highlighting
// ========================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavigation() {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active-link');
                }
            });
        }
    });
}

// Apply debounced scroll listeners
const debouncedHighlight = debounce(highlightNavigation, 10);
window.addEventListener('scroll', debouncedHighlight);

// ========================================
// Typing Effect for Hero Title (Optional)
// ========================================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Uncomment to enable typing effect
// const heroTitle = document.querySelector('.hero-title .highlight');
// if (heroTitle) {
//     const originalText = heroTitle.textContent;
//     typeWriter(heroTitle, originalText, 80);
// }

// ========================================
// Scroll Progress Indicator (Optional)
// ========================================
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 70px;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        width: 0%;
        z-index: 9999;
        transition: width 0.2s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Uncomment to enable scroll progress indicator
createScrollProgress();

// ========================================
// Lazy Loading Images (if any added)
// ========================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ========================================
// Particle Background Effect (Optional)
// ========================================
function createParticles() {
    const hero = document.querySelector('.hero');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
    `;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            opacity: 0.3;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${5 + Math.random() * 10}s infinite ease-in-out;
        `;
        particlesContainer.appendChild(particle);
    }
    
    hero.style.position = 'relative';
    hero.insertBefore(particlesContainer, hero.firstChild);
    
    // Add animation CSS if not already present
    if (!document.querySelector('#particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
        style.textContent = `
            @keyframes float {
                0%, 100% {
                    transform: translateY(0) translateX(0);
                }
                50% {
                    transform: translateY(-30px) translateX(20px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Uncomment to enable particle effect
// createParticles();

// ========================================
// Performance Optimization
// ========================================
// Debounce function for scroll events
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// Form Validation (if contact form is added)
// ========================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ========================================
// Analytics Event Tracking (Optional)
// ========================================
function trackEvent(category, action, label) {
    // Add analytics tracking here if using Google Analytics or similar
    console.log(`Event: ${category} - ${action} - ${label}`);
}

// Track external link clicks
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('External Link', 'Click', link.href);
    });
});

// Track navigation clicks
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('Navigation', 'Click', link.textContent);
    });
});

// ========================================
// Keyboard Navigation Enhancement
// ========================================
document.addEventListener('keydown', (e) => {
    // Press 'T' to toggle theme
    if (e.key === 't' || e.key === 'T') {
        if (!e.target.matches('input, textarea')) {
            themeToggle.click();
        }
    }
    
    // Press 'Escape' to close mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ========================================
// Copy to Clipboard Functionality (for code snippets if added)
// ========================================
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copy';
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent);
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        });
        block.parentElement.style.position = 'relative';
        block.parentElement.appendChild(button);
    });
}

// ========================================
// Console Easter Egg
// ========================================
console.log('%c👾 Welcome to TeddyMbithi\'s Portfolio!', 'font-size: 20px; color: #3498db; font-weight: bold;');
console.log('%cInterested in cybersecurity? Check out my GitHub: https://github.com/TeddyMbithi', 'font-size: 14px; color: #2ecc71;');
console.log('%cPress "T" to toggle dark/light theme!', 'font-size: 12px; color: #e74c3c;');

// ========================================
// Initialize on Page Load
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Add any initialization code here
    highlightNavigation();
    
    // Smooth scroll to hash on page load
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                const navHeight = navbar.offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
    
    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
});

// ========================================
// Service Worker Registration (for PWA support - optional)
// ========================================
if ('serviceWorker' in navigator) {
    // Uncomment to enable PWA features
    // window.addEventListener('load', () => {
    //     navigator.serviceWorker.register('/sw.js')
    //         .then(reg => console.log('Service Worker registered'))
    //         .catch(err => console.log('Service Worker registration failed'));
    // });
}

// ========================================
// Export for testing (if needed)
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        debounce,
        trackEvent
    };
}

// ========================================
// Dynamic Content Loading System
// ========================================

let contentStructure = null;
let currentView = 'home';

// Load content structure
async function loadContentStructure() {
    try {
        const response = await fetch('content-structure.json');
        contentStructure = await response.json();
    } catch (error) {
        console.error('Error loading content structure:', error);
    }
}

// Simple markdown to HTML converter
function markdownToHTML(markdown) {
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2" target="_blank">$1</a>');
    
    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code class="language-$1">$2</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
    
    // Lists
    html = html.replace(/^\s*-\s+(.*)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    return html;
}

// Show category list view
function showCategoryView(categoryKey) {
    const category = contentStructure.categories[categoryKey];
    if (!category) return;
    
    const mainContent = document.querySelector('main') || document.body;
    const projectsSection = document.getElementById('projects');
    
    // Hide main sections
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Create breadcrumb and content container
    const contentView = document.createElement('div');
    contentView.id = 'content-view';
    contentView.className = 'content-view';
    contentView.innerHTML = `
        <div class="container">
            <div class="breadcrumb">
                <a href="#" onclick="returnToHome(); return false;">
                    <i class="fas fa-home"></i> Home
                </a>
                <i class="fas fa-chevron-right"></i>
                <span>${category.name}</span>
            </div>
            
            <div class="category-header">
                <div class="category-icon">
                    <i class="fas ${category.icon}"></i>
                </div>
                <h1>${category.name}</h1>
                <p>${category.description}</p>
            </div>
            
            <div class="writeups-grid">
                ${category.writeups.map(writeup => `
                    <div class="writeup-card" onclick="showWriteup('${categoryKey}', '${writeup.path}')">
                        <div class="writeup-header">
                            <h3>${writeup.title}</h3>
                            <span class="difficulty ${writeup.difficulty.toLowerCase()}">${writeup.difficulty}</span>
                        </div>
                        <p class="writeup-description">${writeup.description}</p>
                        <div class="writeup-meta">
                            <span class="category-badge">${writeup.category}</span>
                            <span class="read-link">
                                Read More <i class="fas fa-arrow-right"></i>
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    mainContent.appendChild(contentView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show individual writeup
async function showWriteup(categoryKey, path) {
    try {
        const response = await fetch(path);
        const markdown = await response.text();
        const html = markdownToHTML(markdown);
        
        const category = contentStructure.categories[categoryKey];
        const writeup = category.writeups.find(w => w.path === path);
        
        const mainContent = document.querySelector('main') || document.body;
        
        // Remove existing content view
        const existingView = document.getElementById('content-view');
        if (existingView) existingView.remove();
        
        // Create writeup view
        const writeupView = document.createElement('div');
        writeupView.id = 'content-view';
        writeupView.className = 'content-view writeup-view';
        writeupView.innerHTML = `
            <div class="container">
                <div class="breadcrumb">
                    <a href="#" onclick="returnToHome(); return false;">
                        <i class="fas fa-home"></i> Home
                    </a>
                    <i class="fas fa-chevron-right"></i>
                    <a href="#" onclick="showCategoryView('${categoryKey}'); return false;">
                        ${category.name}
                    </a>
                    <i class="fas fa-chevron-right"></i>
                    <span>${writeup.title}</span>
                </div>
                
                <article class="writeup-content">
                    ${html}
                </article>
                
                <div class="writeup-footer">
                    <a href="#" onclick="showCategoryView('${categoryKey}'); return false;" class="btn btn-secondary">
                        <i class="fas fa-arrow-left"></i> Back to ${category.name}
                    </a>
                </div>
            </div>
        `;
        
        mainContent.appendChild(writeupView);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Add syntax highlighting if available
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    } catch (error) {
        console.error('Error loading writeup:', error);
        alert('Error loading content. Please try again.');
    }
}

// Return to home view
function returnToHome() {
    const contentView = document.getElementById('content-view');
    if (contentView) contentView.remove();
    
    document.querySelectorAll('section').forEach(section => {
        section.style.display = '';
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update project cards to use dynamic loading
function setupDynamicCards() {
    const projectCards = document.querySelectorAll('.project-card .card-link');
    
    projectCards.forEach(card => {
        const href = card.getAttribute('href');
        
        // Check if this is a category we have in our structure
        if (href && href.includes('github.com') && href.includes('tree/main/')) {
            const categoryPath = href.split('tree/main/')[1];
            let categoryKey = null;
            
            if (categoryPath === 'HTB') categoryKey = 'HTB';
            else if (categoryPath === 'THM') categoryKey = 'THM';
            else if (categoryPath === 'RE') categoryKey = 'RE';
            else if (categoryPath.startsWith('MALWARE')) categoryKey = 'MALWARE';
            else if (categoryPath === 'CYBERSTUDENTS') categoryKey = 'CYBERSTUDENTS';
            
            if (categoryKey) {
                card.onclick = (e) => {
                    e.preventDefault();
                    showCategoryView(categoryKey);
                    return false;
                };
                card.removeAttribute('target');
            }
        }
    });
}

// Initialize content system
loadContentStructure().then(() => {
    setupDynamicCards();
});

// Make functions globally available
window.showCategoryView = showCategoryView;
window.showWriteup = showWriteup;
window.returnToHome = returnToHome;
