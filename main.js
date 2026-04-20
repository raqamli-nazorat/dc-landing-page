document.addEventListener('DOMContentLoaded', () => {
    // Project Data Object
    const PROJECT_DETAILS = {
        'ai-call-center': {
            title: 'AI-CALL-CENTER',
            tag: 'Sun\'iy Intellekt',
            desc: 'Mijozlar bilan muloqotni inson aralashuvisiz amalga oshiruvchi, nutqni tushunish va tahlil qilishga asoslangan intellektual platforma. Tizim 24/7 rejimida ishlaydi va har qanday murakkablikdagi savollarga javob bera oladi.',
            features: ['O\'zbek va rus tillarida nutqni aniqlash', 'Mijoz kayfiyatini (sentiment) tahlil qilish', 'CRM tizimlari bilan integratsiya', 'Avtomatik hisobot shakllantirish'],
            media: []
        },
        'ypx': {
            title: 'YPX [AI]',
            tag: 'Sun\'iy Intellekt',
            desc: 'Yo\'l harakati xavfsizligini ta\'minlash uchun sun\'iy intellektga asoslangan videokuzatuv tizimi. Tizim qoidabuzarliklarni avtomatik aniqlaydi va tegishli organlarga xabar beradi.',
            features: ['Davlat raqamlarini (ANPR) 99% aniqlikda o\'qish', 'To\'xtash va burilish qoidalarini nazorat qilish', 'Tezlikni o\'lchash (radar aralashuvisiz)', 'Tungi ko\'rish va yomon ob-havoda ishlash'],
            media: [
                { type: 'video', src: 'assets/projects/ypx/video.mp4' },
                { type: 'image', src: 'assets/projects/ypx/1.jpg' }
            ]
        },
        'ageing-tank': {
            title: 'AGEING TANK [POLIMER]',
            tag: 'Sanoat Avtomatlashtirish',
            desc: 'Polimer xomashyosini tayyorlash jarayonida harorat, bosim va vaqt parametrlarini boshqaruvchi yuqori texnologik PLC tizimi. Sanoat xavfsizligi talablariga to\'liq javob beradi.',
            features: ['Haroratni +-0.1 darajagacha aniqlikda saqlash', 'Favqulodda to\'xtatish (Safety) tizimi', 'Masofaviy monitoring va boshqaruv', 'Jarayonlar arxivi va loglash'],
            media: [
                { type: 'video', src: 'assets/projects/ageing-tank/video.mp4' },
                { type: 'image', src: 'assets/projects/ageing-tank/1.jpg' },
                { type: 'image', src: 'assets/projects/ageing-tank/2.jpg' }
            ]
        },
        'biokimyo': {
            title: 'BIOKIMYO',
            tag: 'Sanoat Avtomatlashtirish',
            desc: 'Biokimyoviy laboratoriyalar va ishlab chiqarish liniyalari uchun mo\'ljallangan avtomatlashtirish majmuasi. Kimyoviy reaksiyalar ketma-ketligini qat\'iy nazorat qiladi.',
            features: ['Reagentlar sarfini avtomatik o\'lchash', 'PH va boshqa kimyoviy ko\'rsatkichlar tahlili', 'SCADA visualizatsiyasi', 'Xalqaro standartlar bo\'yicha sifat nazorati'],
            media: [
                { type: 'video', src: 'assets/projects/biokimyo/video.mp4' },
                { type: 'image', src: 'assets/projects/biokimyo/1.jpg' }
            ]
        },
        'dispatcher': {
            title: 'DISPATCHER [WEB]',
            tag: 'Boshqaruv Tizimlari',
            desc: 'Yirik korxonalar va davlat organlari uchun operativ dispetcherlik markazi. Barcha ma\'lumotlar yagona ekranda (Situation Center) jamlanadi va tahlil qilinadi.',
            features: ['Real-vaqtda geografik xaritalar (GIS)', 'Hodisalar haqida tezkor bildirishnomalar', 'Guruhli aloqa tizimi integratsiyasi', 'Tarixiy ma\'lumotlar tahlili (Big Data)'],
            media: [
                { type: 'video', src: 'assets/projects/dispatcher/video.mp4' }
            ]
        },
        'gazprom': {
            title: 'Gazprom [PLC]',
            tag: 'Sanoat Avtomatlashtirish',
            desc: 'Gaz konlari va taqsimlash stansiyalari uchun maxsus ishlab chiqilgan PLC boshqaruv shkaflari va dasturiy ta\'minoti.',
            features: ['Yuqori bosim ostida ishlash xavfsizligi', 'Portlashdan himoyalangan uskunalar nazorati', 'Yillik hisobotlar generatsiyasi', 'Avariya holatlarini bashorat qilish'],
            media: [
                { type: 'video', src: 'assets/projects/gazprom/video.mp4' },
                { type: 'image', src: 'assets/projects/gazprom/1.jpg' }
            ]
        },
        'galogramma': {
            title: 'GALOGRAMMA',
            tag: 'Boshqaruv Tizimlari',
            desc: 'Mahsulotlar haqiqiyligini tekshirish va qalbakilashtirishga qarshi kurashish uchun maxsus golografik markirovka tizimi.',
            features: ['QR va Gologramma integratsiyasi', 'Mobil ilova orqali tekshirish', 'Ishlab chiqaruvchi uchun statistik portal', 'Logistika zanjiri nazorati'],
            media: [
                { type: 'video', src: 'assets/projects/galogramma/video.mp4' }
            ]
        },
        'e-komplektasiya': {
            title: 'E-KOMPLEKTASIYA',
            tag: 'Boshqaruv Tizimlari',
            desc: 'Qurilish va sanoat ob\'ektlari butlovchi qismlarini boshqarish tizimi. Loyiha smetasidan tortib to omborga yetib kelishigacha bo\'lgan jarayonni qamrab oladi.',
            features: ['Ombor qoldiqlari nazorati', 'Yetkazib beruvchilar reytingi', 'Budjetni rejalashtirish', 'Elektron imzo (ERI) bilan tasdiqlash'],
            media: [
                { type: 'image', src: 'assets/projects/e-komplektasiya/1.jpg' },
                { type: 'image', src: 'assets/projects/e-komplektasiya/2.jpg' }
            ]
        },
        'm-gaz': {
            title: 'M-GAZ [WEB]',
            tag: 'Boshqaruv Tizimlari',
            desc: 'Gaz iste\'moli va abonentlar hisobini yuritish uchun mo\'ljallangan onlayn platforma.',
            features: ['Elektron to\'lovlar integratsiyasi', 'Iste\'mol tahlili', 'Abonentlar shaxsiy kabineti'],
            media: [
                { type: 'image', src: 'assets/projects/m-gaz/1.jpg' }
            ]
        },
        's-gaz': {
            title: 'S-GAZ [WEB]',
            tag: 'Boshqaruv Tizimlari',
            desc: 'Gaz transportirovka qilish tizimining texnik holatini nazorat qiluvchi maxsus platforma.',
            features: ['Quvurlar holati monitoringi', 'Avariya holatlarini tezkor aniqlash', 'Olti oylik tahliliy hisobotlar'],
            media: [
                { type: 'video', src: 'assets/projects/s-gaz/video.mp4' },
                { type: 'image', src: 'assets/projects/s-gaz/1.jpg' },
                { type: 'image', src: 'assets/projects/s-gaz/2.jpg' },
                { type: 'image', src: 'assets/projects/s-gaz/3.jpg' }
            ]
        },
        'karantin': {
            title: 'KARANTIN [WEB]',
            tag: 'Boshqaruv Tizimlari',
            desc: 'Davlat sanitariya-epidemiologiya va karantin nazorati xizmati uchun mo\'ljallangan yagona platforma.',
            features: ['Obyektlar reyestri', 'Nazorat tadbirlarini rejalashtirish', 'Statistik tahlillar'],
            media: [
                { type: 'image', src: 'assets/projects/karantin/1.jpg' },
                { type: 'image', src: 'assets/projects/karantin/2.jpg' },
                { type: 'image', src: 'assets/projects/karantin/3.jpg' }
            ]
        },
        'mudofaa': {
            title: 'Mudofaa [WEB]',
            tag: 'Boshqaruv Tizimlari',
            desc: 'Mudofaa tizimi uchun maxsus mo\'ljallangan, yopiq tarmoqlarda ishlovchi yuqori darajadagi xavfsiz boshqaruv loyihasi.',
            features: ['Yopiq aloqa kanallari', 'Resurslarni taqsimlash', 'Strategik hisobotlar'],
            media: [
                { type: 'video', src: 'assets/projects/mudofaa/video.mp4' },
                { type: 'video', src: 'assets/projects/mudofaa/video2.mp4' }
            ]
        },
        'modem': {
            title: 'MODEM [PLC]',
            tag: 'Sanoat Avtomatlashtirish',
            desc: 'Sanoat ob\'ektlari o\'rtasida ma\'lumot almashuvini ta\'minlovchi yuqori unumdorlikka ega modem tizimi.',
            features: ['Uzoq masofaga signal uzatish', 'Shovqindan himoyalangan kanal', 'PLC bilan integratsiya'],
            media: [
                { type: 'image', src: 'assets/projects/modem/1.jpg' },
                { type: 'image', src: 'assets/projects/modem/2.jpg' }
            ]
        }
    };

    // Generic defaults for projects without detailed media yet
    const GENERIC_DESC = "Ushbu loyiha bo'yicha batafsil ma'lumot va texnik hujjatlar tayyorlanmoqda. Raqamli Nazorat jamoasi ushbu yechimni to'liq raqamlashtirish va avtomatlashtirishga qaratgan.";
    const DEFAULT_FEATURES = ["Xavfsiz ma'lumotlar almashinuvi", "Zamonaviy UI/UX interfeys", "Yuqori unumdorlik", "24/7 texnik yordam"];

    // UI Elements
    const modal = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('close-modal');
    const header = document.getElementById('header');

    // Modal Elements
    const mTitle = document.getElementById('modal-title');
    const mTag = document.getElementById('modal-tag');
    const mDesc = document.getElementById('modal-desc');
    const mFeatures = document.getElementById('modal-features');
    const mMediaGrid = document.getElementById('modal-media-grid');

    // Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // Open Modal Function
    function openModal(projectId) {
        const data = PROJECT_DETAILS[projectId] || { 
            title: projectId.replace(/-/g, ' ').toUpperCase(),
            tag: 'Loyiha',
            desc: GENERIC_DESC,
            features: DEFAULT_FEATURES,
            media: []
        };

        mTitle.innerText = data.title;
        mTag.innerText = data.tag;
        mDesc.innerText = data.desc;

        // Clear and inject features
        mFeatures.innerHTML = '';
        data.features.forEach(f => {
            const li = document.createElement('li');
            li.innerText = f;
            mFeatures.appendChild(li);
        });

        // Clear and inject media
        mMediaGrid.innerHTML = '';
        if (data.media.length > 0) {
            data.media.forEach(item => {
                const div = document.createElement('div');
                div.className = 'modal-media-item';
                
                if (item.type === 'video') {
                    const video = document.createElement('video');
                    video.src = item.src;
                    video.controls = true;
                    video.muted = true;
                    video.loop = true;
                    div.appendChild(video);
                } else {
                    const img = document.createElement('img');
                    img.src = item.src;
                    img.alt = data.title;
                    div.appendChild(img);
                }
                mMediaGrid.appendChild(div);
            });
        } else {
            mMediaGrid.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">Loyiha videolari va rasmlari tez orada joylanadi...</p>';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Pause all videos in modal
        const videos = mMediaGrid.querySelectorAll('video');
        videos.forEach(v => v.pause());
    }

    // Event Listeners for Project Cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            openModal(card.id);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || filter === category) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400);
                }
            });
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
