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
        const desc = project[`project-card_${id}_detail`];
        const features = project[`project-card_${id}_features`];
        const advantages = project[`project-card_${id}_advantages`];
        const results = project[`project-card_${id}_results`];
        const users = project[`project-card_${id}_users`];
        const work = project[`project-card_${id}_work`];
        const screens = project[`project-card_${id}_screens`];
        const videoId = project[`project-card_${id}_video`];
        const images = project[`project-card_${id}_images`];
        const galleryLayout = project[`project-card_${id}_gallery_layout`] || 'grid';

        const advantagesTitle = project['project_advantages_title'];
        const resultsTitle = project['project_results_title'];
        const usersTitle = project['project_users_title'];
        const workTitle = project['project_work_title'];
        const screensTitle = project['project_screens_title'];

        // Layout Wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'project-detail-layout';
        wrapper.style.maxWidth = '1070px';
        wrapper.style.margin = '0 auto';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '30px';

        // 1. Main Info Card (Title, Desc, Features) - Matches Image 2 & 3
        const mainCard = document.createElement('div');
        mainCard.style.background = 'var(--bg-card)';
        mainCard.style.borderRadius = '32px';
        mainCard.style.padding = '50px';
        mainCard.style.boxShadow = '0 10px 40px rgba(0,0,0,0.03)';
        mainCard.style.border = '1px solid var(--border-color)';

        mainCard.innerHTML = `
            <h1 class="project-detail__title" style="margin-bottom: 20px;">${title}</h1>
            <p class="project-detail__description" style="margin-bottom: 40px; max-width: 800px;">${desc}</p>
            
            ${features && features.length > 0 ? `
                <div class="features-section">
                    <ul style="list-style: none; display: flex; flex-direction: column; gap: 24px;">
                        ${features.map(f => `
                            <li style="display: flex; align-items: center; gap: 16px; font-size: 16px; font-weight: 500; color: var(--text-main);">
                                <img src="./Images/detail_icon_img.png" alt="" style="width: 32px; height: 32px; flex-shrink: 0;">
                                ${f}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
        `;
        wrapper.appendChild(mainCard);

        // 2. Detailed Text Sections (Advantages, Results, etc.)
        if (advantages || results || users || work || screens) {
            const detailsCard = document.createElement('div');
            detailsCard.style.background = 'var(--bg-card)';
            detailsCard.style.borderRadius = '32px';
            detailsCard.style.padding = '50px';
            detailsCard.style.boxShadow = '0 10px 40px rgba(0,0,0,0.03)';
            detailsCard.style.border = '1px solid var(--border-color)';
            detailsCard.style.display = 'flex';
            detailsCard.style.flexDirection = 'column';
            detailsCard.style.gap = '40px';

            const addSection = (title, text) => {
                if (!text) return '';
                return `
                    <div class="detail-section">
                        <h3 style="font-size: 22px; margin-bottom: 16px; font-weight: 700; color: var(--text-title); font-family: var(--unbounded);">${title}</h3>
                        <p style="font-size: 16px; color: var(--text-muted); line-height: 1.8;">${text}</p>
                    </div>
                `;
            };

            detailsCard.innerHTML = `
                ${addSection(advantagesTitle, advantages)}
                ${addSection(resultsTitle, results)}
                ${addSection(usersTitle, users)}
                ${addSection(workTitle, work)}
                ${addSection(screensTitle, screens)}
            `;
            wrapper.appendChild(detailsCard);
        }

        // 3. Media Section
        if (videoId || (images && images.length > 0)) {
            const mediaSection = document.createElement('div');
            mediaSection.style.marginTop = '10px';

            if (videoId) {
                const video = document.createElement('div');
                video.className = 'video-wrapper';
                video.style.marginBottom = '30px';
                
                // Helper to get embed URL
                const getEmbedUrl = (url) => {
                    if (!url) return '';
                    if (url.includes('youtube.com/embed/')) return url;
                    let id = '';
                    if (url.includes('youtu.be/')) {
                        id = url.split('youtu.be/')[1].split('?')[0];
                    } else if (url.includes('v=')) {
                        id = url.split('v=')[1].split('&')[0];
                    } else if (!url.includes('http')) {
                        id = url; // Just an ID
                    }
                    return id ? `https://www.youtube.com/embed/${id}` : url;
                };

                video.innerHTML = `<iframe src="${getEmbedUrl(videoId)}" frameborder="0" allowfullscreen></iframe>`;
                mediaSection.appendChild(video);
            }

            if (images && images.length > 0) {
                const gallery = document.createElement('div');
                gallery.className = 'gallery-grid';
                
                if (galleryLayout === 'list') {
                    // Full-width vertical list for tall screenshots
                    gallery.style.display = 'flex';
                    gallery.style.flexDirection = 'column';
                    gallery.style.gap = '30px';
                    gallery.innerHTML = images.map(src => `
                        <div style="border-radius: 24px; overflow: hidden; background: var(--bg-card); border: 1px solid var(--border-color); box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                            <img src="${src}" alt="${title}" style="width: 100%; height: auto; display: block; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                        </div>
                    `).join('');
                } else {
                    // Standard grid for smaller images
                    gallery.style.display = 'grid';
                    gallery.style.gridTemplateColumns = 'repeat(auto-fit, minmax(320px, 1fr))';
                    gallery.style.gap = '24px';
                    gallery.innerHTML = images.map(src => `
                        <div style="border-radius: 24px; overflow: hidden; background: var(--bg-card); border: 1px solid var(--border-color);">
                            <img src="${src}" alt="${title}" style="width: 100%; height: 280px; object-fit: cover; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        </div>
                    `).join('');
                }
                
                mediaSection.appendChild(gallery);
            }

            wrapper.appendChild(mediaSection);
        }

        container.appendChild(wrapper);

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
    const footerImg = document.getElementById('footer-img');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        footerImg.src = './Images/footer_logo_dark.png';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
        footerImg.src = body.classList.contains('dark-mode') ? './Images/footer_logo_dark.png' : './Images/Footer_logo.png';
    });
});
