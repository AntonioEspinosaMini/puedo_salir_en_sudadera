// ********** Codigo para cambiar de idioma *******
let translations = {};
let currentLangCode = 'es';

export async function initI18n() {
    const languageToggle = document.getElementById('languageToggle');
    const languageFlag = document.getElementById('languageFlag');

    const languages = [
        { code: 'es', flag: '/assets/flags/es.png', alt: 'Español' },
        { code: 'en', flag: '/assets/flags/gb.png', alt: 'English' },
        { code: 'fr', flag: '/assets/flags/fr.png', alt: 'Français' }
    ];

    let currentLangIndex = 0;
    currentLangCode = localStorage.getItem('lang') || 'es';

    window.addEventListener('DOMContentLoaded', async () => {
        const savedLang = localStorage.getItem('lang');
        if (savedLang) {
            const index = languages.findIndex(lang => lang.code === savedLang);
            if (index !== -1) {
                currentLangIndex = index;
                currentLangCode = languages[index].code;
            }
        }

        await loadTranslations(currentLangCode);
        setLanguage(currentLangIndex);
    });

    languageToggle.addEventListener('click', async () => {
        currentLangIndex = (currentLangIndex + 1) % languages.length;
        currentLangCode = languages[currentLangIndex].code;
        await loadTranslations(currentLangCode);
        setLanguage(currentLangIndex);
    });

    function setLanguage(index) {
        const lang = languages[index];
        languageFlag.src = lang.flag;
        languageFlag.alt = lang.alt;
        localStorage.setItem('lang', lang.code);
        updateTexts();
    }

    async function loadTranslations(langCode) {
        try {
            const response = await fetch('/assets/lang.json');
            const data = await response.json();
            translations = data[langCode] || {};
        } catch (error) {
            console.error('Error al cargar las traducciones:', error);
            translations = {};
        }
    }

    function updateTexts() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                el.textContent = translations[key];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[key]) {
                el.setAttribute('placeholder', translations[key]);
            }
        });
    }
}

export function getTranslation(key) {
    return translations[key] || key;
}