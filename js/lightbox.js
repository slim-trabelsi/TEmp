/* ==========================================================================
   MIND — Visionneuse Plein Écran (Lightbox JS Vanilla Haute Performance)
   Navigation Fluide Clavier / Clic, Compteur & Légende Dynamique
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const galleryItems = Array.from(document.querySelectorAll('[data-gallery]'));
  let lightbox = document.getElementById('lightbox');

  // Si la structure HTML de la lightbox n'existe pas encore dans la page, on la crée automatiquement
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-label', 'Visionneuse de réalisation');
    lightbox.innerHTML = `
      <button class="lb-btn lb-close" aria-label="Fermer la vue plein écran">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <button class="lb-btn lb-prev" aria-label="Photo précédente">
        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <div class="lightbox-content">
        <img class="lb-img" src="" alt="">
        <div class="lightbox-caption-bar">
          <div class="lb-title"></div>
          <div class="lb-counter"></div>
        </div>
      </div>
      <button class="lb-btn lb-next" aria-label="Photo suivante">
        <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    `;
    document.body.appendChild(lightbox);
  }

  const lbImg = lightbox.querySelector('.lb-img');
  const lbTitle = lightbox.querySelector('.lb-title');
  const lbCounter = lightbox.querySelector('.lb-counter');
  const closeBtn = lightbox.querySelector('.lb-close');
  const prevBtn = lightbox.querySelector('.lb-prev');
  const nextBtn = lightbox.querySelector('.lb-next');

  let currentIndex = 0;
  let activeGallery = [];

  const getVisibleGallery = () => {
    // Récupérer uniquement les éléments actuellement visibles (respectant les filtres actifs)
    return Array.from(document.querySelectorAll('[data-gallery]')).filter(el => {
      const parent = el.closest('.bento-item, .activity-card, figure');
      if (!parent) return true;
      return window.getComputedStyle(parent).display !== 'none';
    });
  };

  const showImage = (index) => {
    if (!activeGallery.length) return;
    currentIndex = (index + activeGallery.length) % activeGallery.length;
    const currentEl = activeGallery[currentIndex];

    const src = currentEl.getAttribute('data-full') || currentEl.getAttribute('src');
    const alt = currentEl.getAttribute('alt') || 'Réalisation Mind for New Designs';
    const title = currentEl.getAttribute('data-title') || alt;

    // Transition subtile
    lbImg.style.opacity = '0.4';
    lbImg.style.transform = 'scale(0.98)';

    const tempImg = new Image();
    tempImg.onload = () => {
      lbImg.src = src;
      lbImg.alt = alt;
      if (lbTitle) lbTitle.textContent = title;
      if (lbCounter) lbCounter.textContent = `${currentIndex + 1} / ${activeGallery.length}`;
      lbImg.style.opacity = '1';
      lbImg.style.transform = 'scale(1)';
    };
    tempImg.src = src;
  };

  const openLightbox = (clickedEl) => {
    activeGallery = getVisibleGallery();
    const index = activeGallery.indexOf(clickedEl);
    currentIndex = index !== -1 ? index : 0;

    showImage(currentIndex);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Attacher le clic sur tous les éléments portant l'attribut data-gallery
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-gallery]');
    if (target) {
      e.preventDefault();
      openLightbox(target);
    }
  });

  // Boutons de contrôle
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(currentIndex - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(currentIndex + 1);
    });
  }

  // Clic en dehors de l'image pour fermer
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Contrôle au clavier
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  // Support tactile basique (swipe gauche / droite sur mobile)
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        showImage(currentIndex - 1); // Swipe vers la droite -> image précédente
      } else {
        showImage(currentIndex + 1); // Swipe vers la gauche -> image suivante
      }
    }
  }, { passive: true });
});
