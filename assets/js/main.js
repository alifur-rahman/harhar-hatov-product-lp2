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
