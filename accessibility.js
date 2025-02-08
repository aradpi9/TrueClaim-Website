// Accessibility Widget
document.addEventListener('DOMContentLoaded', function() {
    const widget = document.getElementById('accessibility-widget');
    const toggle = document.getElementById('accessibility-toggle');
    const menu = document.getElementById('accessibility-menu');
    const closeBtn = menu.querySelector('.close-menu');
    
    // Store initial font size
    const initialFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    let currentFontSize = initialFontSize;
    
    // Toggle menu
    toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        menu.hidden = isExpanded;
    });
    
    closeBtn.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
    });
    
    // Handle clicks outside the menu
    document.addEventListener('click', (e) => {
        if (!widget.contains(e.target)) {
            toggle.setAttribute('aria-expanded', 'false');
            menu.hidden = true;
        }
    });
    
    // Text size controls
    document.querySelector('[data-action="increase-text"]').addEventListener('click', () => {
        currentFontSize = Math.min(currentFontSize + 2, initialFontSize * 1.5);
        document.documentElement.style.fontSize = `${currentFontSize}px`;
    });
    
    document.querySelector('[data-action="decrease-text"]').addEventListener('click', () => {
        currentFontSize = Math.max(currentFontSize - 2, initialFontSize * 0.75);
        document.documentElement.style.fontSize = `${currentFontSize}px`;
    });
    
    document.querySelector('[data-action="reset-text"]').addEventListener('click', () => {
        currentFontSize = initialFontSize;
        document.documentElement.style.fontSize = `${initialFontSize}px`;
    });
    
    // Toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const isPressed = btn.getAttribute('aria-pressed') === 'true';
            
            btn.setAttribute('aria-pressed', !isPressed);
            
            switch(action) {
                case 'high-contrast':
                    document.body.classList.toggle('high-contrast');
                    break;
                case 'highlight-links':
                    document.body.classList.toggle('highlight-links');
                    break;
                case 'dyslexia-font':
                    document.body.classList.toggle('dyslexia-font');
                    // Load OpenDyslexic font if not already loaded
                    if (!isPressed) {
                        const fontLink = document.createElement('link');
                        fontLink.href = 'https://cdn.jsdelivr.net/npm/opendyslexic@1.0.3/open-dyslexic.min.css';
                        fontLink.rel = 'stylesheet';
                        document.head.appendChild(fontLink);
                    }
                    break;
                case 'focus-mode':
                    document.body.classList.toggle('focus-mode');
                    break;
            }
            
            // Save preferences to localStorage
            localStorage.setItem(`a11y_${action}`, !isPressed);
        });
    });
    
    // Load saved preferences
    const loadSavedPreferences = () => {
        const actions = ['high-contrast', 'highlight-links', 'dyslexia-font', 'focus-mode'];
        actions.forEach(action => {
            const isEnabled = localStorage.getItem(`a11y_${action}`) === 'true';
            if (isEnabled) {
                const btn = document.querySelector(`[data-action="${action}"]`);
                btn.setAttribute('aria-pressed', 'true');
                
                switch(action) {
                    case 'high-contrast':
                        document.body.classList.add('high-contrast');
                        break;
                    case 'highlight-links':
                        document.body.classList.add('highlight-links');
                        break;
                    case 'dyslexia-font':
                        document.body.classList.add('dyslexia-font');
                        const fontLink = document.createElement('link');
                        fontLink.href = 'https://cdn.jsdelivr.net/npm/opendyslexic@1.0.3/open-dyslexic.min.css';
                        fontLink.rel = 'stylesheet';
                        document.head.appendChild(fontLink);
                        break;
                    case 'focus-mode':
                        document.body.classList.add('focus-mode');
                        break;
                }
            }
        });
    };
    
    // Load saved preferences on page load
    loadSavedPreferences();
});
