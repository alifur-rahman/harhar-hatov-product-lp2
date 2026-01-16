// <!-- Initialize AOS -->

    // Initialize AOS with custom settings for fast animations on scroll down only
    AOS.init({
        duration: 600, // Faster animations
        offset: 100, // Trigger animations a bit earlier
        easing: 'ease-out-cubic', // Smooth easing
        once: true, // Animation happens only once
        disable: function() {
            // Disable AOS on mobile for better performance
            return window.innerWidth < 768;
        },
        // Custom condition to trigger only on scroll down
        startEvent: 'DOMContentLoaded',
        disableMutationObserver: false,
        debounceDelay: 50,
        throttleDelay: 99,
        
        // Settings for scroll direction detection
        initClassName: 'aos-init',
        animatedClassName: 'aos-animate',
        useClassNames: false,
    });
    
    // Enhance AOS to only trigger on scroll down
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        
        // If scrolling down, refresh AOS to trigger animations
        if (st > lastScrollTop) {
            AOS.refresh();
        }
        
        lastScrollTop = st <= 0 ? 0 : st;
    }, false);


    document.addEventListener('DOMContentLoaded', function() {
        const contactForm = document.querySelector('.subcription_form');
        const submitBtn = document.getElementById('submit_form');
        
        if (!contactForm) {
            console.error('Form not found!');
            return;
        }
        
        // Handle form submission via AJAX
        if (submitBtn) {
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get form values
                const fullName = document.getElementById('full_name').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const marketing = document.getElementById('marketing')?.checked || false;
                
                // Validation
                if (!fullName || !email || !phone) {
                    showMessage(`Please fill in all required fields`, 'error');
                    return;
                }
                
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showMessage(`Email is not valid`, 'error');
                    return;
                }
                
                // Disable submit button to prevent multiple submissions
                submitBtn.disabled = true;
                // submitBtn.textContent = 'Sending...';
                
                // Prepare form data
                const formData = new FormData();
                formData.append('full_name', fullName);
                formData.append('email', email);
                formData.append('phone', phone);
                formData.append('marketing', marketing);
                
                // Send AJAX request to PHP
                fetch('contact_form.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Reset form
                        contactForm.reset();
                        showMessage(data.message, 'success');
                    } else {
                        showMessage(data.message, 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showMessage('An error occurred. Please try again.', 'error');
                })
                .finally(() => {
                    // Re-enable submit button
                    submitBtn.disabled = false;
                    // submitBtn.textContent = 'Submit';
                });
            });
        }
        
        // Function to show messages
        function showMessage(text, type) {
            // Remove existing messages
            const existingMsg = document.querySelector('.form-message');
            if (existingMsg) existingMsg.remove();
            
            // Create message element
            const messageDiv = document.createElement('div');
            messageDiv.className = `form-message ${type}`;
            messageDiv.textContent = text;
            
            // Style it
            messageDiv.style.cssText = `
                padding: 15px;
                margin-top: 20px;
                border-radius: 8px;
                text-align: center;
                font-weight: bold;
                animation: fadeIn 0.5s;
                ${type === 'success' 
                    ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
                    : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'}
            `;
            
            // Add to page
            const msgSIdentifier = document.querySelector('.contact_fromarea');
            
            if (msgSIdentifier) {
                msgSIdentifier.parentNode.insertBefore(messageDiv, msgSIdentifier.nextSibling);
            } else {
                // Fallback if element not found
                contactForm.appendChild(messageDiv);
            }
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    });
