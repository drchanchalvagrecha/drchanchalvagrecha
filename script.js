document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       Navigation & Header
       ========================================================================== */
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    // Sticky Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close Mobile Menu on Link Click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            
            // Highlight active link
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    /* ==========================================================================
       Scroll Reveal Animations
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    // Initial check on load
    revealOnScroll();

    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);

    /* ==========================================================================
       Services View More Toggle
       ========================================================================== */
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            const hiddenServices = document.querySelectorAll('.hidden-service');
            hiddenServices.forEach(service => {
                service.classList.remove('hidden-service');
            });
            viewMoreBtn.style.display = 'none';
            setTimeout(revealOnScroll, 100);
        });
    }

    /* ==========================================================================
       Form Submission Handling
       ========================================================================== */
    const appointmentForm = document.getElementById('appointmentForm');
    
    if (appointmentForm) {
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const loader = submitBtn.querySelector('.loader');
        const successMessage = document.getElementById('form-success-message');
        
        // Error elements
        const nameError = document.getElementById('name-error');
        const phoneError = document.getElementById('phone-error');
        const emailError = document.getElementById('email-error');
        const dateError = document.getElementById('date-error');
        const timeError = document.getElementById('time-error');

        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        if (dateInput) dateInput.setAttribute('min', today);

        // Validation Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        // State trackers
        let isNameValid = false;
        let isPhoneValid = false;
        let isEmailValid = false;
        let isDateValid = false;
        let isTimeValid = false;

        const checkFormValidity = () => {
            if (isNameValid && isPhoneValid && isEmailValid && isDateValid && isTimeValid) {
                submitBtn.disabled = false;
            } else {
                submitBtn.disabled = true;
            }
        };

        // Name Validation
        nameInput.addEventListener('input', () => {
            if (nameInput.value.trim().length >= 2) {
                nameInput.classList.remove('error');
                nameInput.classList.add('success');
                nameError.classList.remove('active');
                isNameValid = true;
            } else {
                nameInput.classList.remove('success');
                if (nameInput.value.length > 0) {
                    nameInput.classList.add('error');
                    nameError.classList.add('active');
                } else {
                    nameInput.classList.remove('error');
                    nameError.classList.remove('active');
                }
                isNameValid = false;
            }
            checkFormValidity();
        });

        // Phone Validation
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
            if (phoneRegex.test(e.target.value)) {
                phoneInput.classList.remove('error');
                phoneInput.classList.add('success');
                phoneError.classList.remove('active');
                isPhoneValid = true;
            } else {
                phoneInput.classList.remove('success');
                if (e.target.value.length > 0) {
                    phoneInput.classList.add('error');
                    phoneError.classList.add('active');
                } else {
                    phoneInput.classList.remove('error');
                    phoneError.classList.remove('active');
                }
                isPhoneValid = false;
            }
            checkFormValidity();
        });

        // Email Validation
        emailInput.addEventListener('input', (e) => {
            if (emailRegex.test(e.target.value)) {
                emailInput.classList.remove('error');
                emailInput.classList.add('success');
                emailError.classList.remove('active');
                isEmailValid = true;
            } else {
                emailInput.classList.remove('success');
                if (e.target.value.length > 0) {
                    emailInput.classList.add('error');
                    emailError.classList.add('active');
                } else {
                    emailInput.classList.remove('error');
                    emailError.classList.remove('active');
                }
                isEmailValid = false;
            }
            checkFormValidity();
        });

        // Date Validation
        dateInput.addEventListener('change', (e) => {
            const selectedDate = new Date(e.target.value);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            if (selectedDate >= currentDate) {
                dateInput.classList.remove('error');
                dateInput.classList.add('success');
                dateError.classList.remove('active');
                isDateValid = true;
            } else {
                dateInput.classList.remove('success');
                dateInput.classList.add('error');
                dateError.classList.add('active');
                isDateValid = false;
            }
            checkFormValidity();
        });

        // Time Validation
        timeInput.addEventListener('change', () => {
            if (timeInput.value !== "") {
                timeInput.classList.add('success');
                timeError.classList.remove('active');
                isTimeValid = true;
            } else {
                timeInput.classList.remove('success');
                isTimeValid = false;
            }
            checkFormValidity();
        });

        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show Loading State
            btnText.innerText = 'Processing...';
            loader.style.display = 'inline-block';
            submitBtn.disabled = true;
            appointmentForm.style.opacity = '0.7';
            appointmentForm.style.pointerEvents = 'none';

            const name = nameInput.value;
            const phone = phoneInput.value;
            const email = emailInput.value;
            const date = dateInput.value;
            const time = timeInput.value;
            const message = document.getElementById('message').value || 'No additional message';
            
            const whatsappNumber = '919820903741';
            
            const whatsappText = `Hello Dr. Chanchal Vagrecha Ma'am, I would like to book an appointment.

*Details:*
- *Name:* ${name}
- *Phone:* ${phone}
- *Email:* ${email}
- *Preferred Date:* ${date}
- *Preferred Time:* ${time}
- *Message:* ${message}`;

            const encodedText = encodeURIComponent(whatsappText);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
            
            // Simulate short loading for "SaaS feel"
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                
                appointmentForm.reset();
                appointmentForm.style.opacity = '1';
                appointmentForm.style.pointerEvents = 'auto';
                
                successMessage.style.display = 'block';
                btnText.innerText = 'Book Appointment';
                loader.style.display = 'none';

                // Reset states
                [nameInput, phoneInput, emailInput, dateInput, timeInput].forEach(el => {
                    el.classList.remove('success', 'error');
                });
                [nameError, phoneError, emailError, dateError, timeError].forEach(error => {
                    error.classList.remove('active');
                });
                isNameValid = isPhoneValid = isEmailValid = isDateValid = isTimeValid = false;

                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            }, 1200);
        });
    }

    /* ==========================================================================
       Update Copyright Year Automatically
       ========================================================================== */
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        if (currentYear > 2024) { // Only update if it's past the initial launch year
            footerYear.innerHTML = footerYear.innerHTML.replace('2024', `2024-${currentYear}`);
        }
    }
});
