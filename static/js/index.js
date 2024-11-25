window.HELP_IMPROVE_VIDEOJS = false;


$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 5000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();

})

document.addEventListener('DOMContentLoaded', function() {
  const elements = {
    wrapper: document.querySelector('.image-wrapper'),
    handle: document.querySelector('.slider-handle'),
    sliderLine: document.querySelector('.slider-line'),
    overlay: document.querySelector('.image-overlay')
  };

  if (!Object.values(elements).every(Boolean)) return;

  let isDragging = false;
  
  const getPosition = (e) => {
    const rect = elements.wrapper.getBoundingClientRect();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    return Math.max(0, Math.min(clientX - rect.left, rect.width));
  };
  
  const updatePositions = (percentage) => {
    const pos = `${percentage}%`;
    elements.handle.style.left = pos;
    elements.sliderLine.style.left = pos;
    elements.overlay.style.width = pos;
  };
  
  const syncHandleToOverlay = () => {
	if (isDragging) return;
	const overlayWidth = parseFloat(getComputedStyle(elements.overlay).width);
	const percentage = (overlayWidth / elements.wrapper.offsetWidth) * 100;
	updatePositions(percentage);
  };

  const setDragging = (dragging) => {
    isDragging = dragging;
    elements.overlay.style.animationPlayState = dragging ? 'paused' : 'running';
  };
  
  const move = (e) => {
    if (!isDragging) return;
    const position = getPosition(e);
    const percentage = (position / elements.wrapper.offsetWidth) * 100;
    updatePositions(percentage);
  };

  // Event listeners
  ['mousedown', 'touchstart'].forEach(event => 
    elements.handle.addEventListener(event, () => setDragging(true)));

  ['mouseup', 'touchend'].forEach(event => 
    document.addEventListener(event, () => setDragging(false)));

  ['mousemove', 'touchmove'].forEach(event => 
    document.addEventListener(event, move));

  // Animation sync
  elements.overlay.addEventListener('animationstart', syncHandleToOverlay);
  elements.overlay.addEventListener('animationiteration', syncHandleToOverlay);

  // Use RAF for smooth animation
  let rafId;
  const updateHandle = () => {
    syncHandleToOverlay();
    rafId = requestAnimationFrame(updateHandle);
  };
  rafId = requestAnimationFrame(updateHandle);

  // Cleanup on page unload
  window.addEventListener('unload', () => cancelAnimationFrame(rafId));

  // Pause videos when they're not in viewport
  // Get all video elements
  const videos = document.getElementsByTagName('video');
  
  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Play video if in view, pause if not
      if (entry.isIntersecting) {
        entry.target.play();
      } else {
        entry.target.pause();
      }
    });
  }, {
    threshold: 0.2  // 20% of the video must be visible
  });

  // Observe each video
  Array.from(videos).forEach(video => {
    observer.observe(video);
  });
});