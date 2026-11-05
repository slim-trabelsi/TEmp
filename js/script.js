/* ==========================================================================
   MIND — Mind for New Designs
   Comportements interactifs : Navigation, Scroll Reveal, Filtrage & Formulaire
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. HEADER SCROLL EFFECT
     ------------------------------------------------------------------------ */
  const header = document.querySelector('.site-header');
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ------------------------------------------------------------------------
     2. MENU MOBILE BURGER & TIROIR
     ------------------------------------------------------------------------ */
  const burger = document.querySelector('.burger');
  const panel  = document.querySelector('.mobile-nav-panel');
  const scrim  = document.querySelector('.scrim');

  const closeNav = () => {
    if (!burger || !panel) return;
    burger.setAttribute('aria-expanded', 'false');
    panel.classList.remove('open');
    if (scrim) scrim.classList.remove('open');
    document.body.style.overflow = '';
  };

  const toggleNav = () => {
    if (!burger || !panel) return;
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!isOpen));
    panel.classList.toggle('open', !isOpen);
    if (scrim) scrim.classList.toggle('open', !isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  };

  if (burger) {
    burger.addEventListener('click', toggleNav);
  }
  if (scrim) {
    scrim.addEventListener('click', closeNav);
  }
  if (panel) {
    panel.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel && panel.classList.contains('open')) {
      closeNav();
    }
  });

  /* ------------------------------------------------------------------------
     3. ANIMATIONS AU DÉFILEMENT (SCROLL REVEAL VIA INTERSECTION OBSERVER)
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback immédiat si IntersectionObserver non disponible
    revealElements.forEach(el => el.classList.add('active'));
  }

  /* ------------------------------------------------------------------------
     4. SYSTÈME DE FILTRAGE DES RÉALISATIONS (GALERIE D'ACCUEIL)
     ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const bentoItems = document.querySelectorAll('.bento-grid [data-category]');

  if (filterBtns.length > 0 && bentoItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Changement de bouton actif
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedFilter = btn.getAttribute('data-filter');

        bentoItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (selectedFilter === 'all' || itemCategory === selectedFilter) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.96)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. GESTION DES ERREURS DE CHARGEMENT D'IMAGES
     ------------------------------------------------------------------------ */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      const parent = img.closest('.bento-item, .card-thumb, .frame');
      if (parent) {
        parent.classList.add('img-missing');
      }
    }, { once: true });
  });

  /* ------------------------------------------------------------------------
     6. FORMULAIRE DE DEVIS (FEEDBACK INTERACTIF)
     ------------------------------------------------------------------------ */
  const quoteForm = document.querySelector('form.quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg> Envoi en cours...
      `;

      setTimeout(() => {
        submitBtn.innerHTML = `✓ Demande transmise avec succès !`;
        submitBtn.style.background = '#10B981';
        submitBtn.style.borderColor = '#10B981';
        quoteForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
        }, 4000);
      }, 900);
    });
  }
});
