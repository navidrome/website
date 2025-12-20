// App gallery lightbox functionality
(function() {
  'use strict';

  const modal = document.getElementById('app-gallery-modal');
  if (!modal) return;

  const overlay = modal.querySelector('.app-gallery-overlay');
  const closeBtn = modal.querySelector('.app-gallery-close');
  const prevBtn = modal.querySelector('.app-gallery-prev');
  const nextBtn = modal.querySelector('.app-gallery-next');
  const image = document.getElementById('app-gallery-image');
  const counter = modal.querySelector('.app-gallery-counter');

  let currentImages = [];
  let currentIndex = 0;

  // Open gallery
  function openGallery(appId, startIndex = 0) {
    // Get thumbnail
    const card = document.querySelector(`[data-app-id="${appId}"]`);
    if (!card) return;

    const thumbnail = card.querySelector('.app-thumbnail');
    if (!thumbnail) return;

    // Build images array starting with thumbnail
    currentImages = [thumbnail.src];

    // Add gallery images if they exist
    const galleryData = document.querySelector(`.app-gallery-data[data-app-id="${appId}"]`);
    if (galleryData) {
      const gallerySources = galleryData.querySelectorAll('[data-src]');
      gallerySources.forEach(source => {
        currentImages.push(source.getAttribute('data-src'));
      });
    }

    currentIndex = startIndex;
    showImage();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close gallery
  function closeGallery() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentImages = [];
    currentIndex = 0;
  }

  // Show current image
  function showImage() {
    if (currentImages.length === 0) return;

    image.src = currentImages[currentIndex];
    
    // Update counter
    if (currentImages.length > 1) {
      counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
      counter.style.display = 'block';
    } else {
      counter.style.display = 'none';
    }

    // Update navigation buttons
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === currentImages.length - 1;

    // Hide nav buttons if only one image
    if (currentImages.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    }
  }

  // Navigate to previous image
  function prevImage() {
    if (currentIndex > 0) {
      currentIndex--;
      showImage();
    }
  }

  // Navigate to next image
  function nextImage() {
    if (currentIndex < currentImages.length - 1) {
      currentIndex++;
      showImage();
    }
  }

  // Event listeners for thumbnails
  document.addEventListener('click', function(e) {
    const thumbnailContainer = e.target.closest('.app-thumbnail-container');
    if (thumbnailContainer) {
      const appId = thumbnailContainer.getAttribute('data-app-id');
      if (appId) {
        openGallery(appId, 0);
      }
    }
  });

  // Event listeners for controls
  closeBtn.addEventListener('click', closeGallery);
  overlay.addEventListener('click', closeGallery);
  prevBtn.addEventListener('click', prevImage);
  nextBtn.addEventListener('click', nextImage);

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!modal.classList.contains('active')) return;

    switch(e.key) {
      case 'Escape':
        closeGallery();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
    }
  });
})();
