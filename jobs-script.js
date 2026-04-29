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
        // Boshlang'ich holatni tekshirish
        const syncEducation = () => {
            if (isStudentCheckbox.checked) {
                educationGroup.classList.add('is-visible');
            } else {
                educationGroup.classList.remove('is-visible');
            }
        };

        syncEducation();

        isStudentCheckbox.addEventListener('change', syncEducation);
    }

    // Theme Management
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const footerImg = document.getElementById('footer-img');
    const mailImg = document.getElementById('mail-img');
    const telegramImg = document.getElementById('telegram-img');
    const themeLight = document.getElementById('theme-light');
    const themeDark = document.getElementById('theme-dark');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.querySelector('.nav');

    if (langCurrent) {
        langCurrent.addEventListener('click', (e) => {
            e.stopPropagation();

            // Close mobile nav menu if open
            if (navMenu && navMenu.classList.contains('nav--active')) {
                navMenu.classList.remove('nav--active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            }

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

    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark-mode');
            body.classList.add('dark-mode');
            if (themeToggle) themeToggle.classList.add('theme-toggle--active');
            if (themeDark) themeDark.classList.add('active');
            if (themeLight) themeLight.classList.remove('active');
            if (footerImg) footerImg.src = './Assets/footer_logo_dark.svg';
            if (mailImg) mailImg.src = './Assets/mail_02_dark.svg';
            if (telegramImg) telegramImg.src = './Assets/telegram_dark.svg';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark-mode');
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
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            // Close language dropdown if open
            if (langDropdown) langDropdown.classList.remove('lang-switcher__dropdown--active');

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
            const { data: regionsData } = await res.json();
            const regions = regionsData?.results?.filter((region) => region.is_application === true);

            const regionSelect = document.getElementById('region-select');
            if (!regionSelect) return;

            const dropdown = document.getElementById('region-dropdown');
            const input = document.getElementById('region');
            const headerText = document.getElementById('region-header').querySelector('span');

            // Clear existing manual options
            dropdown.innerHTML = '';

            if (!regions.length) {
                const option = document.createElement('div');
                option.className = 'custom-select__option';
                option.textContent = 'Ish joylari hozircha mavjud emas';
                dropdown.appendChild(option);
                return;
            }

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
            const positions = positionsData?.results?.filter((pos) => pos.is_application === true);

            const positionSelect = document.getElementById('position-select');
            if (!positionSelect) return;

            const dropdown = document.getElementById('position-dropdown');
            const input = document.getElementById('position');
            const headerText = document.getElementById('position-header').querySelector('span');

            // Clear existing manual options
            dropdown.innerHTML = '';

            if (!positions.length) {
                const option = document.createElement('div');
                option.className = 'custom-select__option';
                option.textContent = 'Bo\'sh ish o\'rinlari hozircha mavjud emas';
                dropdown.appendChild(option);
                return;
            }

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


    const notification = document.getElementById('notification');
    const notifIcon = document.getElementById('notif-icon');
    const notifText = document.getElementById('notif-text');
    const closeBtn = document.getElementById('close-button');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('active');
        });
    }

    function showNotification(message, type = 'success') {
        if (!notification || !notifIcon || !notifText) return;

        // Reset classes
        notifIcon.classList.remove('success', 'error');
        notification.classList.remove('active');

        // Force reflow to restart transition if already active
        void notification.offsetWidth;

        notifText.innerText = message;
        notifIcon.classList.add(type);

        if (type === 'success') {
            notifIcon.innerHTML = "<i data-lucide='circle-check-big'></i>";
        } else {
            notifIcon.innerHTML = "<i data-lucide='circle-x'></i>";
        }

        lucide.createIcons();
        notification.classList.add('active');

        setTimeout(() => {
            notification.classList.remove('active');
        }, 5000);
    }

    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        let input = e.target.value.replace(/\D/g, ''); // Faqat raqamlarni olamiz
        let size = input.length;

        if (size > 12) input = input.substring(0, 12); // Maksimal 12 ta raqam (+998 va 9 ta raqam)

        let formattedValue = "";

        if (size > 0) {
            formattedValue += "+" + input.substring(0, 3);
        }
        if (size > 3) {
            formattedValue += " " + input.substring(3, 5);
        }
        if (size > 5) {
            formattedValue += "-" + input.substring(5, 8);
        }
        if (size > 8) {
            formattedValue += "-" + input.substring(8, 10);
        }
        if (size > 10) {
            formattedValue += "-" + input.substring(10, 12);
        }

        e.target.value = formattedValue;
    });

    const cvInput = document.getElementById("cv_upload");
    const cvText = document.getElementById("cv-text");

    cvInput.addEventListener("change", function () {
        if (this.files.length > 0) {
            const fileName = this.files[0].name;
            cvText.innerText = fileName?.length > 50 ? fileName.slice(0, 50) + "..." : fileName;
        } else {
            cvText.innerText = "Fayl yuklash";
        }
    });

    const form = document.getElementById('jobs-form');


    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const lang = (localStorage.getItem('selectedLang') || 'UZ').toUpperCase();
            const t = (key) => (translations[lang] && translations[lang][key]) ? translations[lang][key] : key;

            if (document.getElementById('full_name').value.trim() == '') {
                showNotification(t('error_full_name'), 'error');
                return;
            }
            if (document.getElementById('birth_date').value == '') {
                showNotification(t('error_birth_date'), 'error');
                return;
            }
            const phoneVal = document.getElementById('phone').value.replace(/[^\d+]/g, '');
            if (phoneVal == '' || phoneVal == '+998' || phoneVal.length < 13) {
                showNotification(t('error_phone'), 'error');
                return;
            }
            if (document.getElementById('telegram').value.trim() == '') {
                showNotification(t('error_telegram'), 'error');
                return;
            }
            if (document.getElementById('position').value == '') {
                showNotification(t('error_position'), 'error');
                return;
            }
            if (document.getElementById('region').value == '') {
                showNotification(t('error_region'), 'error');
                return;
            }
            if (document.getElementById('cv_upload').files.length === 0) {
                showNotification(t('error_cv'), 'error');
                return;
            }
            if (document.getElementById('portfolio').value.trim() == '') {
                showNotification(t('error_portfolio_empty'), 'error');
                return;
            }

            if (!document.getElementById('portfolio').value.startsWith('https://')) {
                showNotification(t('error_portfolio_invalid'), 'error');
                return;
            }
            const isStudent = document.getElementById('is_student').checked;
            if (isStudent && document.getElementById('education').value.trim() == '') {
                showNotification(t('error_education'), 'error');
                return;
            }

            const formData = new FormData();

            formData.append('full_name', document.getElementById('full_name').value);
            formData.append('birth_date', document.getElementById('birth_date').value);
            formData.append('is_student', document.getElementById('is_student').checked);
            formData.append('university', document.getElementById('education').value);
            formData.append('region', document.getElementById('region').value);
            formData.append('phone', document.getElementById('phone').value.replace(/[^\d+]/g, ''));

            const telegramValue = document.getElementById('telegram').value.replace('@', '');

            formData.append('telegram', telegramValue.startsWith('https://t.me/') ? telegramValue : `https://t.me/${telegramValue}`);

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

            if (res.ok) {
                form.reset();
                // Custom selectlarni reset qilish
                document.querySelectorAll('.custom-select').forEach(select => {
                    const header = select.querySelector('.custom-select__header');
                    const headerText = header.querySelector('span');
                    const options = select.querySelectorAll('.custom-select__option');

                    header.classList.remove('custom-select__header--filled');
                    options.forEach(opt => opt.classList.remove('custom-select__option--selected'));

                    const lang = localStorage.getItem('selectedLang') || 'UZ';
                    const key = headerText.getAttribute('data-i18n');
                    if (key && translations[lang] && translations[lang][key]) {
                        headerText.textContent = translations[lang][key];
                    }
                });

                // CV text reset
                const cvText = document.getElementById("cv-text");
                const lang = localStorage.getItem('selectedLang') || 'UZ';
                if (cvText && translations[lang] && translations[lang]['btn_upload_cv']) {
                    cvText.innerText = translations[lang]['btn_upload_cv'];
                } else if (cvText) {
                    cvText.innerText = "Fayl yuklash";
                }

                // Education group hide
                const educationGroup = document.getElementById('education_group');
                if (educationGroup) educationGroup.style.display = 'none';

                showNotification(t('success_message'), 'success');
            } else {
                console.error("Xatolik tafsilotlari:", data);
                let errorMsg = t('error_generic');
                if (data && data.error) {
                    if (data.error.details) {
                        const details = data.error.details;
                        const messages = [];
                        Object.values(details).forEach(errArray => {
                            if (Array.isArray(errArray)) {
                                messages.push(...errArray);
                            } else {
                                messages.push(errArray);
                            }
                        });
                        errorMsg = messages.join('\n') || data.error.errorMsg;
                    } else {
                        errorMsg = data.error.errorMsg || t('error_generic');
                    }
                } else if (data && typeof data === 'object' && !data.error) {
                    errorMsg = Object.entries(data).map(([key, val]) => `${key}: ${val}`).join('\n');
                }

                showNotification(errorMsg, 'error');
            }
        });
    }


});
