const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    nav.classList.toggle('open', !open);
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }));
}

const galleryPhotos = document.querySelectorAll('.gallery-photo');
galleryPhotos.forEach((photo) => {
  photo.addEventListener('click', () => {
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
      document.removeEventListener('keydown', handleKeydown);
      const closeDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 200;
      window.setTimeout(() => viewer.remove(), closeDelay);
    };
    const handleKeydown = (event) => {
      if (event.key === 'Escape') closeViewer();
    };

    document.body.appendChild(viewer);
    closeButton.addEventListener('click', closeViewer);
    viewer.addEventListener('click', (event) => {
      if (event.target === viewer) closeViewer();
    });
    document.addEventListener('keydown', handleKeydown);
    closeButton.focus();
  });
});

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
    if (active) {
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
