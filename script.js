    // ── Cursor ──
    const cursor = document.getElementById('cursor');
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // ── Nav scroll ──
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    // ── Intersection Observer: skill bars + project cards ──
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.classList.contains('skill-fill')) {
          el.style.transitionDelay = '0s';
          el.classList.add('visible');
          el.style.transform = `scaleX(${el.dataset.width})`;
        }
        if (el.classList.contains('project-card')) {
          const cards = document.querySelectorAll('.project-card');
          cards.forEach((c, i) => {
            setTimeout(() => c.classList.add('visible'), i * 120);
          });
        }
        observer.unobserve(el);
      });
    }, { threshold: 0.25 });

    document.querySelectorAll('.skill-fill, .project-card').forEach(el => observer.observe(el));

    // ── Form ──
    function handleSubmit(e) {
      e.preventDefault();
      const btn = e.target.querySelector('.btn-submit');
      btn.textContent = 'Mensagem enviada ✓';
      btn.style.background = '#4a7c5f';
      setTimeout(() => {
        btn.textContent = 'Enviar mensagem →';
        btn.style.background = '';
        e.target.reset();
      }, 3000);
    }