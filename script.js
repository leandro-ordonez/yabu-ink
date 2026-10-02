const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (toggle && nav) {
  const closeMenu = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    nav.classList.toggle('open', !open);
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    closeMenu();
  }));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
}

const galleryPhotos = document.querySelectorAll('.gallery-photo');
galleryPhotos.forEach((photo) => {
  const openViewer = () => {
    const fullImage = photo.src;
    const viewer = document.createElement('div');
    viewer.className = 'image-viewer';
    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-modal', 'true');
    viewer.setAttribute('aria-label', photo.alt || 'Image viewer');
    viewer.innerHTML = `<button class="image-viewer-close" type="button" aria-label="Close image viewer"><span aria-hidden="true">&times;</span></button><img class="image-viewer-photo" src="${fullImage}" alt="${photo.alt}">`;

    const closeButton = viewer.querySelector('.image-viewer-close');
    const closeViewer = () => {
      if (viewer.classList.contains('is-closing')) return;
      viewer.classList.add('is-closing');
      const closeDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 200;
      window.setTimeout(() => {
        document.removeEventListener('keydown', handleKeydown);
        document.removeEventListener('focusin', keepFocusInViewer);
        viewer.remove();
        document.body.classList.remove('image-viewer-open');
        photo.focus();
      }, closeDelay);
    };
    const handleKeydown = (event) => {
      if (event.key === 'Escape') closeViewer();
      if (event.key === 'Tab') {
        const focusableItems = viewer.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
        const firstItem = focusableItems[0];
        const lastItem = focusableItems[focusableItems.length - 1];

        if (event.shiftKey && document.activeElement === firstItem) {
          event.preventDefault();
          lastItem.focus();
        } else if (!event.shiftKey && document.activeElement === lastItem) {
          event.preventDefault();
          firstItem.focus();
        }
      }
    };
    const keepFocusInViewer = (event) => {
      if (!viewer.contains(event.target)) closeButton.focus();
    };

    document.body.appendChild(viewer);
    document.body.classList.add('image-viewer-open');
    closeButton.addEventListener('click', closeViewer);
    viewer.addEventListener('click', (event) => {
      if (event.target === viewer) closeViewer();
    });
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('focusin', keepFocusInViewer);
    closeButton.focus();
  };

  photo.addEventListener('click', openViewer);
  photo.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openViewer();
    }
  });
});

const heroVideo = document.querySelector('.idea-film-video');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

if (heroVideo) {
  let heroVideoVisible = false;
  const updateHeroVideoMotion = () => {
    if (motionPreference.matches || !heroVideoVisible) {
      heroVideo.pause();
    } else {
      heroVideo.play().catch(() => {});
    }
  };

  if ('IntersectionObserver' in window) {
    const heroVideoObserver = new IntersectionObserver(([entry]) => {
      heroVideoVisible = entry.isIntersecting;
      updateHeroVideoMotion();
    }, { threshold: 0.1 });
    heroVideoObserver.observe(heroVideo);
  } else {
    heroVideoVisible = true;
    updateHeroVideoMotion();
  }

  if (motionPreference.addEventListener) {
    motionPreference.addEventListener('change', updateHeroVideoMotion);
  } else {
    motionPreference.addListener(updateHeroVideoMotion);
  }
}

const experienceItems = document.querySelectorAll('.experience-item');
const experiencePanels = document.querySelectorAll('.experience-panel');
const experienceHover = window.matchMedia('(hover: hover) and (pointer: fine)');

function activateExperience(key) {
  experienceItems.forEach((item) => {
    const active = item.dataset.experience === key;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });

  experiencePanels.forEach((panel) => {
    const active = panel.dataset.visual === key;
    const video = panel.querySelector('video');
    panel.classList.toggle('is-active', active);

    if (!video) return;
    if (active && !motionPreference.matches) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}

experienceItems.forEach((item) => {
  const activate = () => activateExperience(item.dataset.experience);
  item.addEventListener('click', activate);
  item.addEventListener('focus', activate);
  if (experienceHover.matches) item.addEventListener('mouseenter', activate);
});

const updateExperienceMotion = () => {
  const activeItem = document.querySelector('.experience-item.is-active');
  if (activeItem) activateExperience(activeItem.dataset.experience);
};

if (motionPreference.addEventListener) {
  motionPreference.addEventListener('change', updateExperienceMotion);
} else {
  motionPreference.addListener(updateExperienceMotion);
}
