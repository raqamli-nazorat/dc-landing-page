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
        wrapper.style.margin = '0 auto';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '30px';

        // Use the Premium Figma Layout for all projects
        const isPremium = true;

        if (isPremium) {
            // PREMIUM FIGMA LAYOUT (ID 1 ONLY)
            wrapper.style.gap = '24px';
            
            // 1. Blue Header Card
            const headerBlock = document.createElement('div');
            headerBlock.className = 'project-header-premium';
            headerBlock.innerHTML = `
                <h1 class="project-header-premium__title">${title}</h1>
                <p class="project-header-premium__desc">${desc}</p>
            `;
            wrapper.appendChild(headerBlock);

            // 2. Info Grid (Two Cards) - Dynamic from language.json
            const sumTitle1 = project[`project-card_${id}_summary_title_1`] || 'Loyiha haqida';
            const sumText1 = project[`project-card_${id}_summary_text_1`] || desc;
            const sumTitle2 = project[`project-card_${id}_summary_title_2`] || 'Asosiy maqsad';
            const sumText2 = project[`project-card_${id}_summary_text_2`] || 'Tizimni raqamlashtirish va jarayonlarni avtomatlashtirish orqali samaradorlikni oshirish.';

            const infoGrid = document.createElement('div');
            infoGrid.className = 'project-info-grid-premium';
            infoGrid.innerHTML = `
                <div class="info-card-premium">
                    <div class="info-card-premium__icon">
                        <img src="./Assets/detail_icon_2.svg" alt="">
                    </div>
                    <div class="info-card-premium__content">
                        <h3 class="info-card-premium__title">${sumTitle1}</h3>
                        <p class="info-card-premium__text">${sumText1}</p>
                    </div>
                </div>
                <div class="info-card-premium">
                    <div class="info-card-premium__icon">
                        <img src="./Assets/detail_icon_2.svg" alt="">
                    </div>
                    <div class="info-card-premium__content">
                        <h3 class="info-card-premium__title">${sumTitle2}</h3>
                        <p class="info-card-premium__text">${sumText2}</p>
                    </div>
                </div>
            `;
            wrapper.appendChild(infoGrid);
            wrapper.appendChild(infoGrid);

            // 3. Black Functions Block
            if (features && features.length > 0) {
                const functionsBox = document.createElement('div');
                functionsBox.className = 'project-functions-premium';
                functionsBox.innerHTML = `
                    <h2 class="project-functions-premium__title">Funksiyalar</h2>
                    <ul class="functions-list-premium">
                        ${features.map(f => `
                            <li class="function-item-premium">
                                <img src="./Assets/detail_icon_2.svg" style="width: 32px; height: 32px;" alt="">
                                <span>${f}</span>
                            </li>
                        `).join('')}
                    </ul>
                `;
                wrapper.appendChild(functionsBox);
            }

            // 5. Video Section (If exists)
            if (videoId) {
                const videoContainer = document.createElement('div');
                videoContainer.className = 'project-video-premium';
                videoContainer.style.borderRadius = '32px';
                videoContainer.style.overflow = 'hidden';
                videoContainer.style.marginTop = '24px';
                videoContainer.innerHTML = `
                    <iframe width="100%" height="500" src="https://www.youtube.com/embed/${videoId}" 
                        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                `;
                wrapper.appendChild(videoContainer);
            }

            // 6. Image Gallery (If exists)
            if (images && images.length > 0) {
                const galleryContainer = document.createElement('div');
                galleryContainer.className = 'project-gallery-premium';
                galleryContainer.style.marginTop = '24px';
                galleryContainer.style.display = 'grid';
                galleryContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(380px, 1fr))';
                galleryContainer.style.gap = '24px';
                
                galleryContainer.innerHTML = images.map(src => `
                    <div style="border-radius: 24px; overflow: hidden; border: 1px solid var(--border-color);">
                        <img src="${src}" alt="${title}" style="width: 100%; height: 280px; object-fit: cover; transition: transform 0.3s ease; transform: scale(1.05);" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1.05)'">
                    </div>
                `).join('');
                wrapper.appendChild(galleryContainer);
            }

            // 4. White Details Section (Only if content exists)
            if (advantages || results || users || work || screens) {
                const detailsSection = document.createElement('div');
                detailsSection.className = 'project-details-premium';
                
                const addSec = (title, text) => {
                    if (!text) return '';
                    return `
                        <div class="premium-section">
                            <h3 class="premium-section__title">${title}</h3>
                            <p class="premium-section__text">${text}</p>
                        </div>
                    `;
                };

                detailsSection.innerHTML = `
                    ${addSec(advantagesTitle, advantages)}
                    ${addSec(resultsTitle, results)}
                    ${addSec(usersTitle, users)}
                    ${addSec(workTitle, work)}
                    ${addSec(screensTitle, screens)}
                `;
                wrapper.appendChild(detailsSection);
            }
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
        footerImg.src = './Assets/footer_logo_dark.png';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
        footerImg.src = body.classList.contains('dark-mode') ? './Assets/footer_logo_dark.png' : './Assets/footer_logo_light.png';
    });
});
