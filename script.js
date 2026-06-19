import { Analytics } from "@vercel/analytics/next"

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

    // Infinite Scrolling Carousel with Arrows
    const projectsMarquee = document.querySelector('.projects-marquee');
    const projectsGrid = document.getElementById('projects-grid');
    const prevBtn = document.getElementById('prev-project');
    const nextBtn = document.getElementById('next-project');
    
    if (projectsMarquee && projectsGrid) {
        // Clone the content once to create a seamless loop
        const clone = projectsGrid.innerHTML;
        projectsGrid.innerHTML += clone;

        let scrollPos = 0;
        let targetScrollPos = null;
        let speed = 1; // Pixels per frame
        let isHovering = false;
        let isPausedByClick = false;
        let pauseTimeout;

        function scrollAnimation() {
            // Smoothly slide to target position if navigating via arrows
            if (targetScrollPos !== null) {
                scrollPos += (targetScrollPos - scrollPos) * 0.1; // Ease out
                if (Math.abs(targetScrollPos - scrollPos) < 1) {
                    scrollPos = targetScrollPos;
                    targetScrollPos = null;
                }
            } else if (!isHovering && !isPausedByClick) {
                scrollPos -= speed;
            }
            
            // Total width of original set
            const totalWidth = projectsGrid.scrollWidth / 2;
            
            // Seamless loop logic
            if (scrollPos <= -totalWidth) {
                scrollPos += totalWidth;
                if (targetScrollPos !== null) targetScrollPos += totalWidth;
            } else if (scrollPos > 0) {
                scrollPos -= totalWidth;
                if (targetScrollPos !== null) targetScrollPos -= totalWidth;
            }

            projectsGrid.style.transform = `translateX(${scrollPos}px)`;
            requestAnimationFrame(scrollAnimation);
        }

        // Start animation
        requestAnimationFrame(scrollAnimation);

        // Hover events
        projectsMarquee.addEventListener('mouseenter', () => isHovering = true);
        projectsMarquee.addEventListener('mouseleave', () => isHovering = false);

        // Manual Scroll via Arrows
        function handleManualScroll(direction) {
            // Get approximate width of one card + gap
            const card = projectsGrid.querySelector('.project-card');
            const style = window.getComputedStyle(projectsGrid);
            const gap = parseFloat(style.gap) || 0;
            const scrollAmount = card.offsetWidth + gap;

            const startPos = targetScrollPos !== null ? targetScrollPos : scrollPos;

            if (direction === 'next') {
                targetScrollPos = startPos - scrollAmount;
            } else {
                targetScrollPos = startPos + scrollAmount;
            }

            // Pause animation for 10 seconds
            isPausedByClick = true;
            clearTimeout(pauseTimeout);
            pauseTimeout = setTimeout(() => {
                isPausedByClick = false;
            }, 10000);
        }

        if (prevBtn) prevBtn.addEventListener('click', () => handleManualScroll('prev'));
        if (nextBtn) nextBtn.addEventListener('click', () => handleManualScroll('next'));
    }

    // --- Premium Features ---

    // Background Orb Tracking
    const backgroundOrb = document.querySelector('.background-orb');

    if (backgroundOrb) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let orbX = mouseX;
        let orbY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth follow for orb
        function animateOrb() {
            // Orb follows with delay
            orbX += (mouseX - orbX) * 0.05;
            orbY += (mouseY - orbY) * 0.05;
            backgroundOrb.style.left = `${orbX}px`;
            backgroundOrb.style.top = `${orbY}px`;

            requestAnimationFrame(animateOrb);
        }
        animateOrb();
    }

    // Scroll Reveals
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));

    // Typing Effect
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const textToType = typingText.getAttribute('data-text');
        let charIndex = 0;
        
        function type() {
            if (charIndex < textToType.length) {
                typingText.textContent += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(type, 30); // Typing speed
            }
        }
        
        // Start typing after a short delay
        setTimeout(type, 1000);
    }

    // Project Modal Logic
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (modal && closeModal) {
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalTechStack = document.getElementById('modal-tech-stack');
        const modalGithub = document.getElementById('modal-github');

        // Prevent original links from triggering if we want modal to open
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault(); // Stop default navigation so modal opens instead

                // Extract data
                const imgSrc = card.querySelector('img') ? card.querySelector('img').src : '';
                const title = card.querySelector('h3') ? card.querySelector('h3').textContent : 'Project';
                const descText = card.querySelector('p') ? card.querySelector('p').textContent : '';
                const githubLink = card.querySelector('.project-link') ? card.querySelector('.project-link').href : '#';
                
                const dataTech = card.getAttribute('data-tech');
                
                // Populate Modal
                if (imgSrc) {
                    modalImg.src = imgSrc;
                    modalImg.style.display = 'block';
                } else {
                    modalImg.style.display = 'none';
                }
                
                modalTitle.textContent = title;
                modalDesc.textContent = descText;
                modalGithub.href = githubLink;

                // Populate Tech Stack
                modalTechStack.innerHTML = '';
                if (dataTech) {
                    dataTech.split(',').forEach(tech => {
                        const span = document.createElement('span');
                        span.className = 'tech-badge';
                        span.textContent = tech.trim();
                        modalTechStack.appendChild(span);
                    });
                } else {
                     // Add some dummy ones if not present just for the wow factor
                     const dummyTechs = ['HTML', 'CSS', 'JavaScript'];
                     dummyTechs.forEach(tech => {
                        const span = document.createElement('span');
                        span.className = 'tech-badge';
                        span.textContent = tech;
                        modalTechStack.appendChild(span);
                     });
                }

                // Show Modal
                modal.classList.add('active');
            });
        });

        // Close functions
        const closeMod = () => modal.classList.remove('active');
        closeModal.addEventListener('click', closeMod);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeMod(); // Close if clicking background overlay
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMod();
        });
    }
});
