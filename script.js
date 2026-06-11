document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.querySelector('.nav-links');
    
    menuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuIcon.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('bx-menu');
            icon.classList.add('bx-x');
        } else {
            icon.classList.remove('bx-x');
            icon.classList.add('bx-menu');
        }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuIcon.querySelector('i');
            icon.classList.remove('bx-x');
            icon.classList.add('bx-menu');
        });
    });

    // Sticky Navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Draggable and Infinite Scrolling Marquee
    const projectsMarquee = document.querySelector('.projects-marquee');
    const projectsGrid = document.getElementById('projects-grid');
    
    if (projectsMarquee && projectsGrid) {
        // Clone the content once to create a seamless loop
        const clone = projectsGrid.innerHTML;
        projectsGrid.innerHTML += clone;

        let isDown = false;
        let startX;
        let scrollPos = 0;
        let speed = 1; // Pixels per frame
        let isHovering = false;

        function scrollAnimation() {
            if (!isDown && !isHovering) {
                scrollPos -= speed;
            }
            
            // Total width of original set
            const totalWidth = projectsGrid.scrollWidth / 2;
            
            // Seamless loop logic
            if (Math.abs(scrollPos) >= totalWidth) {
                scrollPos += totalWidth; // Wrap backwards
            } else if (scrollPos > 0) {
                scrollPos -= totalWidth; // Wrap forwards
            }

            projectsGrid.style.transform = `translateX(${scrollPos}px)`;
            requestAnimationFrame(scrollAnimation);
        }

        // Start animation
        requestAnimationFrame(scrollAnimation);

        // Hover events
        projectsMarquee.addEventListener('mouseenter', () => isHovering = true);
        projectsMarquee.addEventListener('mouseleave', () => {
            isHovering = false;
            isDown = false; // Cancel drag if cursor leaves
        });

        // Mouse Drag events
        projectsMarquee.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - scrollPos;
        });
        
        projectsMarquee.addEventListener('mouseup', () => {
            isDown = false;
        });

        projectsMarquee.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX;
            scrollPos = x - startX;
        });

        // Touch Swipe events
        projectsMarquee.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - scrollPos;
        });

        projectsMarquee.addEventListener('touchend', () => {
            isDown = false;
        });

        projectsMarquee.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX;
            scrollPos = x - startX;
        });
        
        // Prevent default drag behavior on links to allow swiping
        projectsGrid.querySelectorAll('a, img').forEach(el => {
            el.addEventListener('dragstart', (e) => e.preventDefault());
        });
    }
});
