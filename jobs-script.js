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
        if (langCurrent) {
            langCurrent.querySelector('span').textContent = savedLang;
            const option = Array.from(langOptions).find(opt => opt.getAttribute('data-lang').toUpperCase() === savedLang);
            if (option) {
                langCurrent.querySelector('img').src = option.querySelector('img').src;
            }
        }
    } catch (error) {
        console.error('Failed to load translations:', error);
        document.documentElement.style.visibility = 'visible'; // Ensure visibility even on error
    }

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

        // Update placeholders
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                el.setAttribute('placeholder', translations[lang][key]);
            }
        });

        // Update document title for SEO
        if (translations[lang]) {
            const siteTitle = "Raqamli Nazorat";
            const jobsTitle = translations[lang]['nav_careers'] || "Ish o'rinlari";
            document.title = `${jobsTitle} - ${siteTitle}`;
        }
    }

    // Student Toggle Logic
    const isStudentCheckbox = document.getElementById('is_student');
    const educationGroup = document.getElementById('education_group');

    if (isStudentCheckbox && educationGroup) {
        // Initial state
        educationGroup.style.display = isStudentCheckbox.checked ? 'flex' : 'none';

        isStudentCheckbox.addEventListener('change', () => {
            educationGroup.style.display = isStudentCheckbox.checked ? 'flex' : 'none';
        });
    }

    if (langCurrent) {
        langCurrent.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('lang-switcher__dropdown--active');
        });
    }

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
        if (langDropdown) langDropdown.classList.remove('lang-switcher__dropdown--active');
    });

    // Theme Management
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const footerImg = document.getElementById('footer-img');
    const mailImg = document.getElementById('mail-img');
    const telegramImg = document.getElementById('telegram-img');
    const themeLight = document.getElementById('theme-light');
    const themeDark = document.getElementById('theme-dark');

    function setTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (themeToggle) themeToggle.classList.add('theme-toggle--active');
            if (themeDark) themeDark.classList.add('active');
            if (themeLight) themeLight.classList.remove('active');
            if (footerImg) footerImg.src = './Assets/footer_logo_dark.svg';
            if (mailImg) mailImg.src = './Assets/mail_02_dark.svg';
            if (telegramImg) telegramImg.src = './Assets/telegram_dark.svg';
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            if (themeToggle) themeToggle.classList.remove('theme-toggle--active');
            if (themeLight) themeLight.classList.add('active');
            if (themeDark) themeDark.classList.remove('active');
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

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.querySelector('.nav');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('nav--active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navMenu.classList.contains('nav--active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
    }

    async function getRegions() {
        try {
            const res = await fetch("https://backend.raqamlinazorat.uz/api/applications/regions/");
            const { data: regionsData} = await res.json();
            const regions = regionsData?.results;

            const regionSelect = document.getElementById('region-select');
            if (!regionSelect) return;

            const dropdown = document.getElementById('region-dropdown');
            const input = document.getElementById('region');
            const headerText = document.getElementById('region-header').querySelector('span');

            // Clear existing manual options
            dropdown.innerHTML = '';

            regions?.forEach(region => {
                const option = document.createElement('div');
                option.className = 'custom-select__option';
                option.setAttribute('data-value', region.id);
                option.textContent = region.name;

                // Add click listener for dynamic option
                option.addEventListener('click', () => {
                    headerText.textContent = option.textContent;
                    input.value = region.id;

                    // Update selection UI
                    dropdown.querySelectorAll('.custom-select__option').forEach(opt =>
                        opt.classList.remove('custom-select__option--selected')
                    );
                    option.classList.add('custom-select__option--selected');

                    // Close dropdown
                    regionSelect.classList.remove('custom-select--open');
                    regionSelect.querySelector('.custom-select__header').classList.add('custom-select__header--filled');
                });

                dropdown.appendChild(option);
            });
        } catch (error) {
            console.error("Failed to fetch regions:", error);
        }
    }

    getRegions();

    async function getPositions() {
        try {
            const res = await fetch('https://backend.raqamlinazorat.uz/api/applications/positions/');
            const { data: positionsData } = await res.json();
            const positions = positionsData?.results;

            const positionSelect = document.getElementById('position-select');
            if (!positionSelect) return;

            const dropdown = document.getElementById('position-dropdown');
            const input = document.getElementById('position');
            const headerText = document.getElementById('position-header').querySelector('span');

            // Clear existing manual options
            dropdown.innerHTML = '';

            positions?.forEach(position => {
                const option = document.createElement('div');
                option.className = 'custom-select__option';
                option.setAttribute('data-value', position.id);
                option.textContent = position.name;

                // Add click listener for dynamic option
                option.addEventListener('click', () => {
                    headerText.textContent = option.textContent;
                    input.value = position.id;

                    // Update selection UI
                    dropdown.querySelectorAll('.custom-select__option').forEach(opt =>
                        opt.classList.remove('custom-select__option--selected')
                    );
                    option.classList.add('custom-select__option--selected');

                    // Close dropdown
                    positionSelect.classList.remove('custom-select--open');
                    positionSelect.querySelector('.custom-select__header').classList.add('custom-select__header--filled');
                });

                dropdown.appendChild(option);
            });
        } catch (error) {
            console.error("Failed to fetch positions:", error);
        }
    }

    getPositions()

    // Close menu on click outside
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('nav--active')) {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navMenu.classList.remove('nav--active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        }

        // Close custom selects on outside click
        document.querySelectorAll('.custom-select').forEach(select => {
            if (!select.contains(e.target)) {
                select.classList.remove('custom-select--open');
            }
        });
    });

    // Custom Select Interaction Logic
    document.querySelectorAll('.custom-select').forEach(select => {
        const header = select.querySelector('.custom-select__header');
        const dropdown = select.querySelector('.custom-select__dropdown');
        const options = select.querySelectorAll('.custom-select__option');
        const input = select.querySelector('input[type="hidden"]');
        const headerText = header.querySelector('span');

        header.addEventListener('click', (e) => {
            e.stopPropagation();

            // Close other open selects
            document.querySelectorAll('.custom-select').forEach(other => {
                if (other !== select) other.classList.remove('custom-select--open');
            });

            select.classList.toggle('custom-select--open');
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                const text = option.textContent;

                // Update UI
                headerText.textContent = text;
                input.value = value;

                // Remove selected class from others
                options.forEach(opt => opt.classList.remove('custom-select__option--selected'));
                option.classList.add('custom-select__option--selected');

                // Close dropdown
                select.classList.remove('custom-select--open');

                // Mark header as "filled" if needed (optional)
                header.classList.add('custom-select__header--filled');
            });
        });
    });

    const form = document.getElementById('jobs-form');


    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData();

            formData.append('full_name', document.getElementById('full_name').value);
            formData.append('birth_date', document.getElementById('birth_date').value);
            formData.append('is_student', document.getElementById('is_student').checked);
            formData.append('university', document.getElementById('education').value);
            formData.append('region', document.getElementById('region').value);
            formData.append('phone', document.getElementById('phone').value);
            formData.append('telegram', document.getElementById('telegram').value);
            formData.append('position', document.getElementById('position').value);

            // Fix file retrieval
            const cvFileInput = document.getElementById('cv_upload');
            if (cvFileInput.files.length > 0) {
                formData.append('resume', cvFileInput.files[0]);
            }

            formData.append('extra_info', document.getElementById('additional_info').value);
            formData.append('portfolio', document.getElementById('portfolio').value);
            formData.append('status', 'pending');

            const res = await fetch("https://backend.raqamlinazorat.uz/api/applications/", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            console.log("Backend Response:", data);

            if (res.ok) {
                alert("Murojaat muvaffaqiyatli yuborildi!");
                form.reset();
                // Custom selectlarni ham reset qilish kerak bo'lishi mumkin
            } else {
                console.error("Xatolik tafsilotlari:", data);
                let errorMsg = "Xatolik yuz berdi!";
                if (data && typeof data === 'object') {
                    errorMsg = Object.entries(data).map(([key, val]) => `${key}: ${val}`).join('\n');
                }
                alert("Murojaat yuborishda xatolik:\n" + errorMsg);
            }
        });
    }




});
