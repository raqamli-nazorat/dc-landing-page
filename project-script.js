let translations = {};

document.addEventListener("DOMContentLoaded", async () => {
    lucide.createIcons();

    const langCurrent = document.getElementById('lang-current');
    const langDropdown = document.getElementById('lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-switcher__option');

    // Get Project ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch('./language.json');
        translations = await response.json();
        
        const savedLang = (localStorage.getItem('selectedLang') || 'UZ').toUpperCase();
        updateContent(savedLang);
        populateProjectDetails(projectId, savedLang);
        
        langCurrent.querySelector('span').textContent = savedLang;
        const option = Array.from(langOptions).find(opt => opt.getAttribute('data-lang').toUpperCase() === savedLang);
        if (option) {
            langCurrent.querySelector('img').src = option.querySelector('img').src;
        }
    } catch (error) {
        console.error('Failed to load translations:', error);
    }

    function updateContent(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
    }

    function populateProjectDetails(id, lang) {
        const project = translations[lang];
        if (!project) return;

        const container = document.getElementById('project-content');
        container.innerHTML = ''; // Clear existing

        const title = project[`project-card_${id}_title`];
        const desc = project[`project-card_${id}_desc`];
        const detail = project[`project-card_${id}_detail`];
        const features = project[`project-card_${id}_features`];
        const videoId = project[`project-card_${id}_video`];
        const images = project[`project-card_${id}_images`];

        // Main Card (Ageing Tank style)
        const mainCard = document.createElement('div');
        mainCard.className = 'info-card';
        mainCard.style.maxWidth = '1000px';
        mainCard.style.margin = '0 auto';
        
        mainCard.innerHTML = `
            <h1 class="project-detail__title" style="margin-bottom: 24px;">${title}</h1>
            <p class="project-detail__description" style="margin-bottom: 30px;">${desc} ${detail || ''}</p>
            
            ${features ? `
                <ul class="project-detail__features" style="list-style: none; display: flex; flex-direction: column; gap: 16px;">
                    ${features.map(f => `
                        <li style="display: flex; align-items: center; gap: 12px; font-size: 16px; color: var(--text-main);">
                            <div style="width: 32px; height: 32px; background: #6366f1; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i data-lucide="check" style="width: 18px; height: 18px;"></i>
                            </div>
                            ${f}
                        </li>
                    `).join('')}
                </ul>
            ` : ''}
        `;
        container.appendChild(mainCard);

        // Media Section (Video then Gallery)
        if (videoId || (images && images.length > 0)) {
            const mediaSection = document.createElement('div');
            mediaSection.className = 'project-media';
            mediaSection.style.maxWidth = '1000px';
            mediaSection.style.margin = '40px auto 0';

            if (videoId) {
                const video = document.createElement('div');
                video.className = 'video-wrapper';
                video.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
                mediaSection.appendChild(video);
            }

            if (images && images.length > 0) {
                const gallery = document.createElement('div');
                gallery.className = 'gallery-grid';
                gallery.style.gridTemplateColumns = 'repeat(3, 1fr)'; // 3 images per row like in image 2
                gallery.innerHTML = images.map(src => `<img src="${src}" alt="${title}" style="height: 200px;">`).join('');
                mediaSection.appendChild(gallery);
            }

            container.appendChild(mediaSection);
        }

        // Re-initialize icons
        lucide.createIcons();
    }

    // Language Switcher
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
            populateProjectDetails(projectId, lang);
            langDropdown.classList.remove('lang-switcher__dropdown--active');
            localStorage.setItem('selectedLang', lang);
        });
    });

    document.addEventListener('click', () => {
        langDropdown.classList.remove('lang-switcher__dropdown--active');
    });

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
});
