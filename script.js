// Smooth scrolling and interactive behaviors
document.addEventListener('DOMContentLoaded', function() {
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Apply animation to elements
    const animatedElements = document.querySelectorAll('.feature-card, .vision-point, .timeline-item, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Stagger animation for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Floating cards random movement
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        // Add slight random movement
        setInterval(() => {
            if (!card.matches(':hover')) {
                const randomX = (Math.random() - 0.5) * 10;
                const randomY = (Math.random() - 0.5) * 10;
                card.style.transform = `translate(${randomX}px, ${randomY}px)`;
            }
        }, 3000 + (index * 1000));
        
        // Reset position on hover
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translate(0, -5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translate(0, 0)';
        });
    });
    
    // Form handling
    const contactForm = document.querySelector('.form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const interest = this.querySelector('select').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !interest || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Send form data to Vercel Serverless Function
            try {
                const response = await fetch('/api/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, interest, message }),
                });

                const result = await response.json();

                if (result.success) {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitBtn.style.background = 'var(--success-color)';
                    showNotification(result.message, 'success');
                    this.reset();
                } else {
                    throw new Error(result.error || 'Unknown error occurred');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification(`Failed to send message: ${error.message}`, 'error');
                submitBtn.style.background = 'var(--warning-color)'; // Indicate failure
            } finally {
                // Reset button after 3 seconds, regardless of success or failure
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = ''; // Clear custom background
                }, 3000);
            }
        });
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? '#ef4444' : 'var(--primary-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-xl);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
        `;
        
        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
            opacity: 0.8;
            transition: opacity 0.2s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Timeline animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                const dot = entry.target.querySelector('.timeline-dot');
                if (dot) {
                    setTimeout(() => {
                        dot.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            dot.style.transform = 'scale(1)';
                        }, 200);
                    }, 300);
                }
            }
        });
    }, { threshold: 0.5 });
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
    
    // Add CSS for timeline animation
    const style = document.createElement('style');
    style.textContent = `
        .timeline-item {
            opacity: 0;
            transform: translateX(-30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .timeline-item.animate {
            opacity: 1;
            transform: translateX(0);
        }
        
        .timeline-dot {
            transition: transform 0.2s ease, background-color 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Parallax effect for hero background
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Animate hero elements
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-buttons');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    });
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Mobile menu toggle (if needed in future)
    const createMobileMenu = () => {
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        mobileToggle.style.cssText = `
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--gray-700);
            cursor: pointer;
            
            @media (max-width: 768px) {
                display: block;
            }
        `;
        
        document.querySelector('.nav-container').appendChild(mobileToggle);
        
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-open');
        });
    };
    
    // Initialize mobile menu for smaller screens
    if (window.innerWidth <= 768) {
        createMobileMenu();
    }
    
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-toggle')) {
            createMobileMenu();
        }
    });
});
