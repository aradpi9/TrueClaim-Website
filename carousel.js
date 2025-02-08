// Carousel Accessibility
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.testimonial-carousel');
    const track = carousel.querySelector('.testimonial-track');
    const slides = Array.from(track.children);
    const prevButton = carousel.querySelector('.prev');
    const nextButton = carousel.querySelector('.next');
    const dotsNav = carousel.querySelector('.carousel-dots');
    
    // Clear existing dots
    dotsNav.innerHTML = '';
    
    let currentSlide = 0;
    const slidesPerView = 2;
    const totalSlides = Math.ceil(slides.length / slidesPerView);

    // Generate exactly 3 dots
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', i === 0);
        dot.setAttribute('aria-label', `Slide ${i + 1} of 3`);
        dotsNav.appendChild(dot);
    }

    const dots = Array.from(dotsNav.children);
    const slideWidth = slides[0].getBoundingClientRect().width;

    // Arrange slides next to each other
    slides.forEach((slide, index) => {
        slide.style.left = slideWidth * index + 'px';
        slide.setAttribute('role', 'tabpanel');
        slide.setAttribute('aria-label', `Testimonial ${index + 1}`);
        slide.setAttribute('tabindex', '0');
    });

    // Move slide
    const moveToSlide = (track, currentIndex, targetIndex) => {
        if (targetIndex < 0 || targetIndex >= totalSlides) return;
        
        const offset = targetIndex * (slideWidth * slidesPerView);
        track.style.transform = `translateX(-${offset}px)`;
        
        // Update visibility for screen readers
        slides.forEach((slide, index) => {
            const isVisible = Math.floor(index / slidesPerView) === targetIndex;
            slide.setAttribute('aria-hidden', !isVisible);
        });
        
        // Update dots
        dots[currentIndex].setAttribute('aria-selected', 'false');
        dots[currentIndex].classList.remove('active');
        dots[targetIndex].setAttribute('aria-selected', 'true');
        dots[targetIndex].classList.add('active');
        
        // Update button states
        prevButton.disabled = targetIndex === 0;
        nextButton.disabled = targetIndex === totalSlides - 1;
        
        currentSlide = targetIndex;
    };

    // Click handlers
    prevButton.addEventListener('click', () => {
        moveToSlide(track, currentSlide, currentSlide - 1);
    });

    nextButton.addEventListener('click', () => {
        moveToSlide(track, currentSlide, currentSlide + 1);
    });

    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;

        const targetIndex = dots.indexOf(targetDot);
        moveToSlide(track, currentSlide, targetIndex);
    });

    // Keyboard navigation
    carousel.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            moveToSlide(track, currentSlide, currentSlide - 1);
            if (currentSlide > 0) {
                slides[currentSlide * slidesPerView].focus();
            }
        }
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            moveToSlide(track, currentSlide, currentSlide + 1);
            if (currentSlide < totalSlides - 1) {
                slides[currentSlide * slidesPerView].focus();
            }
        }
    });

    // Initialize first slide
    moveToSlide(track, 0, 0);
});
