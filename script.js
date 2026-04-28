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
        await updateContent(savedLang); // Wait for content update

        // Sync theme to body from html if set by anti-flash script
        if (document.documentElement.classList.contains('dark-mode')) {
            document.body.classList.add('dark-mode');
        }

        // Show document now that it's ready
        document.documentElement.style.visibility = 'visible';

        // Update switcher UI (text and flag)
        langCurrent.querySelector('span').textContent = savedLang;
        const option = Array.from(langOptions).find(opt => opt.getAttribute('data-lang').toUpperCase() === savedLang);
        if (option) {
            langCurrent.querySelector('img').src = option.querySelector('img').src;
        }
    } catch (error) {
        console.error('Failed to load translations:', error);
        document.documentElement.style.visibility = 'visible'; // Ensure visibility even on error
    }

    // Tag filtering logic
    const tags = document.querySelectorAll('.tag');
    const projects = document.querySelectorAll('.project-card');

    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const filter = tag.getAttribute('data-filter');
            if (!filter) return; // Completely skip if no data-filter (e.g. features tags)

            // Handle active class
            const parent = tag.parentElement;
            parent.querySelectorAll('.tag').forEach(t => t.classList.remove('tag--active'));
            tag.classList.add('tag--active');

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

    const animatedElements = document.querySelectorAll('.project-card, .feature-item, .about__card');
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
        // Update document language dynamically
        document.documentElement.lang = lang.toLowerCase();

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

        // Update document title and meta description for SEO
        if (translations[lang]) {
            const siteTitle = "Raqamli Nazorat";
            const heroTitle = translations[lang]['hero_title'];
            const heroDesc = translations[lang]['hero_desc'];

            if (heroTitle) {
                document.title = `${siteTitle} - ${heroTitle}`;
                
                // Update OG/Twitter titles too
                const ogTitle = document.querySelector('meta[property="og:title"]');
                if (ogTitle) ogTitle.setAttribute('content', `${siteTitle} - ${heroTitle}`);
                
                const twitterTitle = document.querySelector('meta[name="twitter:title"]');
                if (twitterTitle) twitterTitle.setAttribute('content', `${siteTitle} - ${heroTitle}`);
            }

            if (heroDesc) {
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc) metaDesc.setAttribute('content', heroDesc);

                const ogDesc = document.querySelector('meta[property="og:description"]');
                if (ogDesc) ogDesc.setAttribute('content', heroDesc);

                const twitterDesc = document.querySelector('meta[name="twitter:description"]');
                if (twitterDesc) twitterDesc.setAttribute('content', heroDesc);
            }
        }
    }

    langCurrent.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Close mobile nav menu if open
        if (typeof navMenu !== 'undefined' && navMenu && navMenu.classList.contains('nav--active')) {
            navMenu.classList.remove('nav--active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        }
        
        // Close filter dropdown if open
        const filterHeader = document.querySelector('.filter-tags--small');
        if (filterHeader) filterHeader.classList.remove('filter-tags--open');

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

    // Elements
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const heroIcon = document.getElementById('hero-icon');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.querySelector('.nav');
    const themeLight = document.getElementById('theme-light');
    const themeDark = document.getElementById('theme-dark');
    const mailImg = document.getElementById('mail-img');
    const telegramImg = document.getElementById('telegram-img');
    const footerImg = document.getElementById('footer-img');

    // Theme Management
    function setTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (themeToggle) themeToggle.classList.add('theme-toggle--active');
            if (themeDark) themeDark.classList.add('active');
            if (themeLight) themeLight.classList.remove('active');
            if (heroIcon) heroIcon.src = './Assets/hero_icon_dark.svg';
            if (footerImg) footerImg.src = './Assets/footer_logo_dark.svg';
            if (mailImg) mailImg.src = './Assets/mail_02_dark.svg';
            if (telegramImg) telegramImg.src = './Assets/telegram_dark.svg';
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            if (themeToggle) themeToggle.classList.remove('theme-toggle--active');
            if (themeLight) themeLight.classList.add('active');
            if (themeDark) themeDark.classList.remove('active');
            if (heroIcon) heroIcon.src = './Assets/hero_icon_light.svg';
            if (footerImg) footerImg.src = './Assets/Footer_logo.svg';
            if (mailImg) mailImg.src = './Assets/mail-02.svg';
            if (telegramImg) telegramImg.src = './Assets/telegram.svg';
            localStorage.setItem('theme', 'light');
        }
    }

    // Initial Theme Setup
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    if (themeLight && themeDark) {
        themeLight.addEventListener('click', () => setTheme('light'));
        themeDark.addEventListener('click', () => setTheme('dark'));
    }

    // Project Navigation
    projects.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project-id');
            window.location.href = `project.html?id=${projectId}`;
        });
    });

    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Close filter dropdown if open
            const filterHeader = document.querySelector('.filter-tags--small');
            if (filterHeader) filterHeader.classList.remove('filter-tags--open');
            
            // Close language dropdown if open
            if (langDropdown) langDropdown.classList.remove('active');

            navMenu.classList.toggle('nav--active');
            
            // Toggle icon between menu and x
            const icon = mobileMenuBtn.querySelector('i');
            if (navMenu.classList.contains('nav--active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
    }

    // Project Filter Logic Enhancement
    tags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const filterHeader = tag.parentElement;
                if (filterHeader.classList.contains('filter-tags--small')) {
                    if (filterHeader.classList.contains('filter-tags--open')) {
                        e.stopPropagation(); // Prevent container's toggle listener
                        filterHeader.classList.remove('filter-tags--open');
                    }
                    // If not open, let it bubble to filterHeader to trigger toggle (open)
                }
            }
        });
    });

    // Close menu or filter on click outside
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('nav--active')) {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navMenu.classList.remove('nav--active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        }
        
        const filterHeader = document.querySelector('.filter-tags--small');
        if (filterHeader && filterHeader.classList.contains('filter-tags--open')) {
            if (!filterHeader.contains(e.target)) {
                filterHeader.classList.remove('filter-tags--open');
            }
        }
    });

    // Project Filter Dropdown Toggle for Mobile
    const filterHeader = document.querySelector('.filter-tags--small');
    if (filterHeader) {
        filterHeader.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.stopPropagation();
                
                // Close mobile nav menu if open
                if (navMenu) {
                    navMenu.classList.remove('nav--active');
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) {
                        icon.setAttribute('data-lucide', 'menu');
                        lucide.createIcons();
                    }
                }
                
                // Close language dropdown if open
                if (langDropdown) langDropdown.classList.remove('active');

                filterHeader.classList.toggle('filter-tags--open');
            }
        });
    }
});