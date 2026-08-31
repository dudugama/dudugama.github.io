document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Menu mobile ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('nav-menu--open');
      menuToggle.classList.toggle('menu-toggle--active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('nav-menu--open');
        menuToggle.classList.remove('menu-toggle--active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Tema claro / escuro ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      themeToggle.innerHTML = '<iconify-icon icon="ph:sun-bold" width="20" height="20"></iconify-icon>';
    } else {
      root.removeAttribute('data-theme');
      themeToggle.innerHTML = '<iconify-icon icon="ph:moon-bold" width="20" height="20"></iconify-icon>';
    }
  };

  const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('theme', next);
    });
  }

  /* ---------- Alternância de idioma (PT / EN) ---------- */
  const langToggle = document.getElementById('langToggle');

  let currentLang = localStorage.getItem('lang') || 'pt';

  const translations = window.I18N || (typeof I18N !== 'undefined' ? I18N : null) || { pt: {}, en: {} };

  const t = (key) => (translations[currentLang] && translations[currentLang][key]) || translations.pt[key] || key;

  const applyTranslations = () => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (key) el.setAttribute('aria-label', t(key));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.setAttribute('placeholder', t(key));
    });
    document.documentElement.lang = currentLang === 'en' ? 'en' : 'pt-BR';
    if (langToggle) langToggle.textContent = currentLang === 'pt' ? 'EN' : 'PT';
  };

  applyTranslations();

  /* ---------- Formulário de contato (contato.html) ---------- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const submitBtn = document.getElementById('formSubmit');
    const submitLabel = document.getElementById('formSubmitLabel');
    const statusEl = document.getElementById('formStatus');

    const showStatus = (message, type) => {
      statusEl.textContent = message;
      statusEl.hidden = false;
      statusEl.className = 'form-status form-status--' + type;
    };

    // ---- Validação: campos obrigatórios e e-mail ----
    const fields = {
      name: contactForm.elements['name'],
      email: contactForm.elements['email'],
      message: contactForm.elements['message']
    };

    // Regex que pega erros de digitação comuns (sem @, sem domínio, espaço, etc.)
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const validateField = (field) => {
      const value = field.value.trim();
      if (!value) {
        return t('form.required');
      }
      if (field.type === 'email' && !EMAIL_REGEX.test(value)) {
        return t('form.emailInvalid');
      }
      return '';
    };

    const setFieldError = (field, message) => {
      const errorEl = document.getElementById(field.id + 'Error');
      field.classList.toggle('form-input--invalid', Boolean(message));
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (errorEl) {
        errorEl.textContent = message;
      }
    };

    const validateAllFields = () => {
      let firstInvalid = null;
      Object.entries(fields).forEach(([, field]) => {
        field.value = field.value.trim();
        const message = validateField(field);
        setFieldError(field, message);
        if (message && !firstInvalid) {
          firstInvalid = field;
        }
      });
      return firstInvalid;
    };

    // Feedback ao vivo: enquanto o usuário corrige um campo com erro, revalida na hora
    Object.values(fields).forEach((field) => {
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') {
          setFieldError(field, validateField(field));
        }
      });
      field.addEventListener('blur', () => {
        if (field.getAttribute('aria-invalid') === 'true' || field.value.trim()) {
          setFieldError(field, validateField(field));
        }
      });
    });

    // Consulta DNS leve para impedir e-mails com domínio inexistente (ex.: "gmail.con")
    const isDomainAvailable = async (domain) => {
      if (!domain) return null;
      try {
        const base = 'https://dns.google/resolve?name=' + encodeURIComponent(domain);
        const [mxRes, aRes] = await Promise.all([
          fetch(base + '&type=MX'),
          fetch(base + '&type=A')
        ]);
        const [mxData, aData] = await Promise.all([mxRes.json(), aRes.json()]);
        const mxOk = mxData?.Status === 0 && Array.isArray(mxData.Answer) && mxData.Answer.length > 0;
        const aOk = aData?.Status === 0 && Array.isArray(aData.Answer) && aData.Answer.length > 0;
        return mxOk || aOk;
      } catch (err) {
        return null; // sem confirmação — não bloqueia o envio
      }
    };

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      statusEl.hidden = true;

      // Honeypot: se o campo invisível foi preenchido, é bot e ignora silenciosamente
      if (contactForm.botcheck && contactForm.botcheck.checked) {
        return;
      }

      // 1. Impede o envio se faltar informação ou o e-mail tiver formato inválido
      const firstInvalid = validateAllFields();
      if (firstInvalid) {
        showStatus(t('form.fieldsError'), 'error');
        firstInvalid.focus();
        return;
      }

      // 2. Impede o envio se o domínio do e-mail não existir (digitado errado etc.)
      const domain = fields.email.value.split('@')[1];
      const domainOk = await isDomainAvailable(domain);
      if (domainOk === false) {
        const message = t('form.domainError');
        setFieldError(fields.email, message);
        showStatus(message, 'error');
        fields.email.focus();
        return;
      }

      const accessKey = contactForm.elements['access_key']?.value?.trim();

      if (!accessKey) {
        showStatus(t('form.notConfigured'), 'error');
        return;
      }

      submitBtn.disabled = true;
      submitLabel.textContent = t('form.sending');
      statusEl.hidden = true;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        const result = await response.json();

        if (result.success) {
          showStatus(t('form.success'), 'success');
          contactForm.reset();
          applyTranslations();
          Object.values(fields).forEach((field) => setFieldError(field, ''));
        } else {
          showStatus(t('form.fail'), 'error');
        }
      } catch (err) {
        showStatus(t('form.network'), 'error');
      } finally {
        submitBtn.disabled = false;
        submitLabel.textContent = t('form.submit');
      }
    });
  }

  /* ---------- Filtro de categorias (página "Todos os projetos") ---------- */
  const filterTabs = document.querySelectorAll('.filter-tabs .pill');
  const emptyState = document.getElementById('emptyState');
  // Cada seção de projetos (UX/UI e Data & Code) é um container [data-section]
  const projectSections = document.querySelectorAll('[data-section]');

  if (filterTabs.length && projectSections.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => {
          t.classList.remove('pill--active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('pill--active');
        tab.setAttribute('aria-selected', 'true');

        const filter = tab.dataset.filter;
        let visibleCount = 0;

        // Controla cada seção inteira (título + cards) conforme a categoria
        projectSections.forEach(section => {
          let sectionVisible = 0;

          section.querySelectorAll('.project-card').forEach(card => {
            const matches = filter === 'todos' || card.dataset.category === filter;
            card.hidden = !matches;
            if (matches) sectionVisible++;
          });

          // Oculta/exibe a seção (contêiner pai) junto com seus cards
          section.hidden = sectionVisible === 0;
          visibleCount += sectionVisible;
        });

        // Padroniza o respiro do topo: a primeira seção visível recebe
        // .is-first-visible para que o título fique a 40px dos filtros em
        // QUALQUER estado (Todos, UX/UI ou Data & Code) — sem acúmulo de
        // padding-top herdado de seções ocultas.
        let firstVisibleAssigned = false;
        projectSections.forEach(section => {
          if (!section.hidden && !firstVisibleAssigned) {
            section.classList.add('is-first-visible');
            firstVisibleAssigned = true;
          } else {
            section.classList.remove('is-first-visible');
          }
        });

        if (emptyState) emptyState.hidden = visibleCount !== 0;
      });
    });
  }

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'pt' ? 'en' : 'pt';
      localStorage.setItem('lang', currentLang);
      applyTranslations();
    });
  }

});
