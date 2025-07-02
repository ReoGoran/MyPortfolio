// Initialize AOS Animation
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
            mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
        });

        // Close menu when clicking on a link
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-btn')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            }
        });
    }
}

// Form Validation and Submission
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    // Form validation
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        let isValid = true;
        const formData = new FormData(contactForm);
        const formElements = contactForm.elements;
        
        // Reset error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
            el.textContent = '';
        });
        
        // Validate each field
        for (let element of formElements) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                const fieldName = element.name;
                const value = element.value.trim();
                const errorElement = element.nextElementSibling;
                
                if (element.required && !value) {
                    showError(element, 'Field ini wajib diisi');
                    isValid = false;
                } else if (fieldName === 'email' && value && !isValidEmail(value)) {
                    showError(element, 'Masukkan alamat email yang valid');
                    isValid = false;
                }
            }
        }
        
        // If form is valid, submit it
        if (isValid) {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            try {
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
                
                // Debug: Log form data
                console.log('Mengirim data:', Object.fromEntries(formData));
                
                // Create FormData object for file uploads
                const formDataToSend = new FormData();
                formDataToSend.append('name', formData.get('name'));
                formDataToSend.append('email', formData.get('email'));
                formDataToSend.append('subject', formData.get('subject'));
                formDataToSend.append('message', formData.get('message'));
                
                // Dapatkan base URL dari lokasi halaman saat ini
                const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '');
                const adminPath = baseUrl.replace(/\/pages\/contact$/, '/admin');
                const url = `${adminPath}/save-message.php`;
                
                console.log('Base URL:', window.location.origin);
                console.log('Current path:', window.location.pathname);
                console.log('Calculated admin path:', adminPath);
                console.log('Mengirim request ke:', url);
                
                // Send data to server
                const response = await fetch(url, {
                    method: 'POST',
                    body: formDataToSend,
                    headers: {
                        'Accept': 'application/json'
                    },
                    credentials: 'same-origin'
                });
                
                // Debug: Log response status and headers
                console.log('Status response:', response.status);
                console.log('Response headers:');
                response.headers.forEach((value, key) => {
                    console.log(`  ${key}: ${value}`);
                });
                
                // Get response as text first
                const responseText = await response.text();
                console.log('Raw response:', responseText);
                
                // Try to parse as JSON
                let result;
                try {
                    result = JSON.parse(responseText);
                } catch (e) {
                    console.error('Failed to parse JSON:', e);
                    console.error('Response was:', responseText);
                    throw new Error('Format respons tidak valid dari server: ' + responseText.substring(0, 100));
                }
                
                console.log('Parsed response:', result);
                
                if (response.ok && result.success) {
                    // Show success message
                    showNotification(result.message || 'Pesan berhasil dikirim!', 'success');
                    // Reset form
                    contactForm.reset();
                } else {
                    throw new Error(result.message || 'Terjadi kesalahan saat mengirim pesan');
                }
            } catch (error) {
                console.error('Error:', error);
                let errorMessage = error.message || 'Terjadi kesalahan. Silakan coba lagi nanti.';
                
                // Handle network errors
                if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                    errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
                }
                
                showNotification(errorMessage, 'error');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        }
    });
    
    // Helper function to show error messages
    function showError(element, message) {
        const errorElement = element.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            element.style.borderColor = '#f87171';
        }
    }
    
    // Show notification message
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotif = document.querySelector('.notification');
        if (existingNotif) {
            existingNotif.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// Back to Top Button
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Set current year in footer
document.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
});

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initContactForm();
    initBackToTop();
});
