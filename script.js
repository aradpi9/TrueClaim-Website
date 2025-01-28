// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = '#ffffff';
        navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    } else {
        navbar.style.backgroundColor = 'transparent';
        navbar.style.boxShadow = 'none';
    }
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isOpen = answer.style.display === 'block';
        
        // Close all answers
        document.querySelectorAll('.faq-answer').forEach(item => {
            item.style.display = 'none';
        });
        
        // Toggle clicked answer
        if (!isOpen) {
            answer.style.display = 'block';
        }
    });
});

// Contact Form Submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Here you would typically send the form data to your server
    console.log('Form submitted:', formObject);
    
    // Show success message
    alert('Thank you for contacting us! We will get back to you shortly.');
    this.reset();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Testimonial Carousel
const testimonialSection = document.querySelector('.testimonials');
const testimonialTrack = document.querySelector('.testimonial-track');
const testimonials = document.querySelectorAll('.testimonial');
const prevButton = document.querySelector('.carousel-arrow.prev');
const nextButton = document.querySelector('.carousel-arrow.next');
const dotsContainer = document.querySelector('.carousel-dots');

let currentIndex = 0;
const slidesToShow = 2;
const totalSlides = testimonials.length;
let isAutoScrolling = false;

// Create dots
for (let i = 0; i < Math.ceil(totalSlides / slidesToShow); i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i * slidesToShow));
    dotsContainer.appendChild(dot);
}

// Initialize testimonial widths
testimonials.forEach(testimonial => {
    testimonial.style.width = `${100 / slidesToShow}%`;
});

// Auto-scroll interval
let autoScrollInterval;
const autoScrollDelay = 5000; // 5 seconds

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === Math.floor(currentIndex / slidesToShow));
    });
}

function goToSlide(index, smooth = true) {
    currentIndex = index;
    const slideWidth = testimonials[0].offsetWidth;
    const transitionDuration = smooth ? '0.5s' : '0s';
    testimonialTrack.style.transition = `transform ${transitionDuration} ease`;
    testimonialTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    updateDots();
}

function resetToBeginning() {
    // First, move to the last slide without animation
    goToSlide(totalSlides - slidesToShow, false);
    
    // Wait a brief moment, then smoothly transition to the first slide
    setTimeout(() => {
        goToSlide(0, true);
    }, 50);
}

function startAutoScroll() {
    if (autoScrollInterval) return;
    
    autoScrollInterval = setInterval(() => {
        if (currentIndex < totalSlides - slidesToShow) {
            goToSlide(currentIndex + slidesToShow);
        } else {
            resetToBeginning();
        }
    }, autoScrollDelay);
}

function stopAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
}

// Intersection Observer to detect when testimonial section is in view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !isAutoScrolling) {
            isAutoScrolling = true;
            startAutoScroll();
        } else if (!entry.isIntersecting && isAutoScrolling) {
            isAutoScrolling = false;
            stopAutoScroll();
        }
    });
}, {
    threshold: 0.3 // Start when 30% of the section is visible
});

observer.observe(testimonialSection);

// Event listeners for manual navigation
prevButton.addEventListener('click', () => {
    stopAutoScroll();
    if (currentIndex > 0) {
        goToSlide(currentIndex - slidesToShow);
    }
});

nextButton.addEventListener('click', () => {
    stopAutoScroll();
    if (currentIndex < totalSlides - slidesToShow) {
        goToSlide(currentIndex + slidesToShow);
    } else {
        resetToBeginning();
    }
});

// Restart auto-scroll after manual navigation
testimonialTrack.addEventListener('mouseenter', stopAutoScroll);
testimonialTrack.addEventListener('mouseleave', () => {
    if (isAutoScrolling) {
        startAutoScroll();
    }
});
