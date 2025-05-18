// DOM Elements
const elements = {
    navLinks: document.querySelectorAll('a[href^="#"]'),
    contactForm: document.querySelector('.contact-form'),
    serviceCards: document.querySelectorAll('.service-card'),
    pricingCards: document.querySelectorAll('.pricing-card')
};

// Configuration
const config = {
    whatsapp: {
        phoneNumber: '09126116913',
        countryCode: '63' // Philippines country code
    },
    animation: {
        threshold: 0.1,
        rootMargin: '0px'
    }
};

// Navigation
function initializeNavigation() {
    elements.navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form Handling
function initializeForm() {
    if (!elements.contactForm) return;

    elements.contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const name = formData.get('name') || '';
        const email = formData.get('email') || '';
        const phone = formData.get('phone') || '';
        const message = formData.get('message') || '';

        // Minimal validation: just check that all fields are filled
        if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        // WhatsApp message
        const waMessage = 
            `Laundry Service Inquiry%0A` +
            `Name: ${encodeURIComponent(name)}%0A` +
            `Email: ${encodeURIComponent(email)}%0A` +
            `Phone: ${encodeURIComponent(phone)}%0A` +
            `Message: ${encodeURIComponent(message)}`;

        // WhatsApp URL (change country code if needed)
        const whatsappUrl = `https://wa.me/2349053054831?text=${waMessage}`;

        window.open(whatsappUrl, '_blank');
        showNotification('Redirecting to WhatsApp...', 'success');
        this.reset();
    });
}

// Form Validation
function validateFormData(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s-+()]{10,}$/;

    console.log('Validation Debug:', data);

    if (!data.name || data.name.trim().length < 2) {
        showNotification('Name is invalid or too short.', 'error');
        return false;
    }

    if (!data.email || !emailRegex.test(data.email)) {
        showNotification('Email is invalid.', 'error');
        return false;
    }

    if (!data.phone || !phoneRegex.test(data.phone)) {
        showNotification('Phone number is invalid. Use at least 10 digits.', 'error');
        return false;
    }

    if (!data.message || data.message.trim().length < 10) {
        showNotification('Message is too short (min 10 characters).', 'error');
        return false;
    }

    return true;
}

// WhatsApp Integration
function sendToWhatsApp(formData) {
    // Format the message
    const message = `New Laundry Service Inquiry%0A%0A` +
        `Name: ${encodeURIComponent(formData.name)}%0A` +
        `Email: ${encodeURIComponent(formData.email)}%0A` +
        `Phone: ${encodeURIComponent(formData.phone)}%0A` +
        `Message: ${encodeURIComponent(formData.message)}`;

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${config.whatsapp.countryCode}${config.whatsapp.phoneNumber}?text=${message}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
}

// Form State Management
function setFormState(form, isSubmitting, buttonText) {
    const submitButton = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input, textarea');
    
    submitButton.disabled = isSubmitting;
    submitButton.textContent = buttonText;
    
    inputs.forEach(input => {
        input.disabled = isSubmitting;
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    
    // Add background color based on type
    const colors = {
        success: '#2ecc71',
        error: '#e74c3c',
        info: '#3498db'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-in';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// Animation System
function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, config.animation);

    // Observe service cards
    elements.serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Observe pricing cards
    elements.pricingCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// Add animation styles
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .animate {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Animate sections on scroll
const animateOnScroll = () => {
    const sections = document.querySelectorAll('.section-animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });
};

// Handle form submission
const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate form
    let isValid = true;
    const requiredFields = ['name', 'email', 'phone', 'message'];
    
    requiredFields.forEach(field => {
        const input = form.querySelector(`[name="${field}"]`);
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#e74c3c';
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    if (!isValid) {
        return;
    }
    
    // Create WhatsApp message
    const message = `
Name: ${formData.get('name')}
Email: ${formData.get('email')}
Phone: ${formData.get('phone')}
Message: ${formData.get('message')}
    `.trim();
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp number (replace with your actual number)
    const whatsappNumber = '09053054831';
    
    // Create WhatsApp link
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappLink, '_blank');
    
    // Reset form
    form.reset();
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeForm();
    initializeAnimations();
    addAnimationStyles();
    animateOnScroll();
    
    // Add form submit handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});
