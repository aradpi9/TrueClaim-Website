// Accessibility Widget
document.addEventListener('DOMContentLoaded', function() {
    const widget = document.getElementById('accessibility-widget');
    const toggle = document.getElementById('accessibility-toggle');
    const menu = document.getElementById('accessibility-menu');
    
    // Toggle menu
    toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        menu.hidden = isExpanded;
    });
    
    // Handle clicks outside the menu
    document.addEventListener('click', (e) => {
        if (!widget.contains(e.target)) {
            toggle.setAttribute('aria-expanded', 'false');
            menu.hidden = true;
        }
    });

    // Action buttons
    document.querySelector('[data-action="reset"]').addEventListener('click', resetSettings);
    document.querySelector('[data-action="hide"]').addEventListener('click', () => {
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
    });

    // Profile handlers
    const profiles = {
        'seizure-safe': {
            apply: () => {
                document.body.classList.toggle('seizure-safe');
                // Remove flashing elements, reduce animations
                document.querySelectorAll('*').forEach(el => {
                    if (window.getComputedStyle(el).animation !== 'none') {
                        el.style.animation = 'none';
                    }
                });
            }
        },
        'vision-impaired': {
            apply: () => {
                document.body.classList.toggle('vision-impaired');
                // Increase contrast and font size
                document.documentElement.style.fontSize = 
                    document.body.classList.contains('vision-impaired') ? '120%' : '';
            }
        },
        'adhd-friendly': {
            apply: () => {
                document.body.classList.toggle('adhd-friendly');
                // Reduce distractions
                document.querySelectorAll('video, .carousel').forEach(el => {
                    el.style.display = document.body.classList.contains('adhd-friendly') ? 'none' : '';
                });
            }
        },
        'cognitive-disability': {
            apply: () => {
                document.body.classList.toggle('cognitive-disability');
                // Simplify content and increase readability
                if (document.body.classList.contains('cognitive-disability')) {
                    document.body.style.lineHeight = '1.8';
                    document.body.style.wordSpacing = '0.16em';
                    document.body.style.letterSpacing = '0.12em';
                } else {
                    document.body.style.lineHeight = '';
                    document.body.style.wordSpacing = '';
                    document.body.style.letterSpacing = '';
                }
            }
        },
        'keyboard-navigation': {
            apply: () => {
                document.body.classList.toggle('keyboard-navigation');
                // Enhance focus indicators
                if (document.body.classList.contains('keyboard-navigation')) {
                    const style = document.createElement('style');
                    style.id = 'keyboard-nav-styles';
                    style.textContent = `
                        *:focus {
                            outline: 3px solid var(--primary-color) !important;
                            outline-offset: 3px !important;
                        }
                    `;
                    document.head.appendChild(style);
                } else {
                    document.getElementById('keyboard-nav-styles')?.remove();
                }
            }
        },
        'blind-users': {
            apply: () => {
                document.body.classList.toggle('blind-users');
                // Optimize for screen readers
                document.querySelectorAll('img').forEach(img => {
                    if (!img.alt) img.alt = img.src.split('/').pop() || 'Image';
                });
                document.querySelectorAll('a').forEach(link => {
                    if (!link.getAttribute('aria-label')) {
                        link.setAttribute('aria-label', link.textContent);
                    }
                });
            }
        }
    };

    // Handle profile toggles
    document.querySelectorAll('[data-profile]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const profile = e.target.dataset.profile;
            if (profiles[profile]) {
                profiles[profile].apply();
                // Save to localStorage
                localStorage.setItem(`a11y_${profile}`, e.target.checked);
            }
        });
    });

    // Load saved preferences
    function loadSavedPreferences() {
        Object.keys(profiles).forEach(profile => {
            const isEnabled = localStorage.getItem(`a11y_${profile}`) === 'true';
            if (isEnabled) {
                const checkbox = document.querySelector(`[data-profile="${profile}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    profiles[profile].apply();
                }
            }
        });
    }

    // Reset all settings
    function resetSettings() {
        document.querySelectorAll('[data-profile]').forEach(checkbox => {
            checkbox.checked = false;
        });
        Object.keys(profiles).forEach(profile => {
            if (document.body.classList.contains(profile)) {
                profiles[profile].apply();
            }
            localStorage.removeItem(`a11y_${profile}`);
        });
        document.documentElement.style.fontSize = '';
        document.body.style.lineHeight = '';
        document.body.style.wordSpacing = '';
        document.body.style.letterSpacing = '';
        document.getElementById('keyboard-nav-styles')?.remove();
    }

    // Search functionality
    const searchInput = document.querySelector('.accessibility-search input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.profile-item').forEach(item => {
            const content = item.textContent.toLowerCase();
            item.style.display = content.includes(searchTerm) ? '' : 'none';
        });
    });

    // Load saved preferences on page load
    loadSavedPreferences();
});
