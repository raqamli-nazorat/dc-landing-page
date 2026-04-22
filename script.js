let translations = {};

document.addEventListener("DOMContentLoaded", async () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Language Switcher Elements
    const langCurrent = document.getElementById('lang-current');
    const langDropdown = document.getElementById('lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-switcher__option');

    // Fetch translations from JSON
    try {
        const response = await fetch('./language.json');
        translations = await response.json();
        
        // Initial UI Update from localStorage
        const savedLang = (localStorage.getItem('selectedLang') || 'UZ').toUpperCase();
        updateContent(savedLang);
        
        // Update switcher UI (text and flag)
        langCurrent.querySelector('span').textContent = savedLang;
        const option = Array.from(langOptions).find(opt => opt.getAttribute('data-lang').toUpperCase() === savedLang);
        if (option) {
            langCurrent.querySelector('img').src = option.querySelector('img').src;
        }
    } catch (error) {
        console.error('Failed to load translations:', error);
    }

    // Tag filtering logic
    const tags = document.querySelectorAll('.tag');
    const projects = document.querySelectorAll('.project-card');

    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const filter = tag.getAttribute('data-filter');
            
            // Handle active class
            const parent = tag.parentElement;
            parent.querySelectorAll('.tag').forEach(t => t.classList.remove('tag--active'));
            tag.classList.add('tag--active');

            if (!filter) return; // Skip if no data-filter (e.g. overview tags)

            projects.forEach(project => {
                const category = project.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    project.style.display = 'flex';
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'translateY(0) scale(1)';
                    }, 10);
                } else {
                    project.style.opacity = '0';
                    project.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => {
                        project.style.display = 'none';
                    }, 500); // Wait for transition
                }
            });
        });
    });

    // Reveal on scroll animation
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.project-card, .feature-item, .stat-card, .about__card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });


    function updateContent(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (el.children.length === 0) {
                    el.textContent = translations[lang][key];
                } else {
                    el.childNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                            node.textContent = translations[lang][key];
                        }
                    });
                }
            }
        });
    }

    langCurrent.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('lang-switcher__dropdown--active');
    });

    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang').toUpperCase();
            const imgSrc = option.querySelector('img').src;
            langCurrent.querySelector('span').textContent = lang;
            langCurrent.querySelector('img').src = imgSrc;
            updateContent(lang);
            langDropdown.classList.remove('lang-switcher__dropdown--active');
            localStorage.setItem('selectedLang', lang);
        });
    });

    // Close dropdown on outside click
    document.addEventListener('click', () => {
        langDropdown.classList.remove('lang-switcher__dropdown--active');
    });

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.classList.add('theme-toggle--active');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        themeToggle.classList.toggle('theme-toggle--active');
        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    projects.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project-id');
            window.location.href = `project.html?id=${projectId}`;
        });
    });
});


