document.addEventListener('DOMContentLoaded', function() {
    setupSmoothScrolling();
    setupNavbarScrollEffect();
    setupImageCarousel();
    setupTypewriter();
    setupMobileNav();
});

function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setupNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.backgroundColor = '#081420';
        } else {
            navbar.style.backgroundColor = '';
        }
        
        lastScrollTop = scrollTop;
    });
}

function setupTypewriter() {
    const line1El = document.getElementById('typewriter-line1');
    const line2El = document.getElementById('typewriter-line2');
    const titleEl = document.querySelector('.hero-title');
    if (!line1El || !line2El) return;

    const line1 = 'Achieve Your Dream Form';
    const line2 = 'Monona.ai analyzes your shooting form and matches it against Pro Players';
    const charDelay = 55;
    const pauseBetweenLines = 400;

    function typeText(el, text, delay, cb) {
        let i = 0;
        function tick() {
            if (i < text.length) {
                el.textContent += text[i];
                i++;
                setTimeout(tick, delay);
            } else if (cb) {
                setTimeout(cb, pauseBetweenLines);
            }
        }
        tick();
    }

    typeText(line1El, line1, charDelay, function() {
        typeText(line2El, line2, charDelay, function() {
            if (titleEl) titleEl.classList.add('done');
        });
    });
}

function setupMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', function() {
        toggle.classList.toggle('open');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            toggle.classList.remove('open');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

function setupImageCarousel() {
    const categories = document.querySelectorAll('.showcase-category');
    
    categories.forEach((category) => {
        const container = category.querySelector('.category-images');
        const prevBtn = category.querySelector('.book-nav.prev');
        const nextBtn = category.querySelector('.book-nav.next');
        
        let isScrolling = false;
        let startX = 0;
        let scrollLeft = 0;
        
        // Initialize all images as stacked except the first one
        initializeStack(container);
        
        // Horizontal scroll detection (left/right)
        category.addEventListener('wheel', function(e) {
            // Only handle horizontal scrolling or convert vertical to horizontal
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
                e.preventDefault();
                
                if (isScrolling) return;
                
                const categoryIndex = parseInt(container.dataset.category);
                
                if (e.deltaX > 0 || (e.shiftKey && e.deltaY > 0)) {
                    // Scroll right - next image
                    slideToNextImage(categoryIndex);
                } else if (e.deltaX < 0 || (e.shiftKey && e.deltaY < 0)) {
                    // Scroll left - previous image
                    slideToPrevImage(categoryIndex);
                }
                
                isScrolling = true;
                setTimeout(() => {
                    isScrolling = false;
                }, 550);
            }
        }, { passive: false });
        
        // Mouse drag support
        category.addEventListener('mousedown', function(e) {
            startX = e.pageX;
            category.style.cursor = 'grabbing';
        });
        
        category.addEventListener('mouseup', function(e) {
            const deltaX = e.pageX - startX;
            category.style.cursor = 'grab';
            
            if (Math.abs(deltaX) > 50) { // Minimum drag distance
                const categoryIndex = parseInt(container.dataset.category);
                
                if (deltaX < 0) {
                    // Dragged left - next image
                    slideToNextImage(categoryIndex);
                } else {
                    // Dragged right - previous image
                    slideToPrevImage(categoryIndex);
                }
            }
        });
        
        // Button clicks
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                const categoryIndex = parseInt(this.dataset.category);
                slideToPrevImage(categoryIndex);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                const categoryIndex = parseInt(this.dataset.category);
                slideToNextImage(categoryIndex);
            });
        }
    });
}

function initializeStack(container) {
    const items = container.querySelectorAll('.showcase-item');
    items.forEach((item, index) => {
        if (index === 0) {
            item.classList.add('active');
        } else {
            item.classList.add('stacked');
        }
    });
}

function slideToNextImage(categoryIndex) {
    const container = document.querySelector(`.category-images[data-category="${categoryIndex}"]`);
    const items = Array.from(container.querySelectorAll('.showcase-item'));
    const activeItem = container.querySelector('.showcase-item.active');
    const activeIndex = items.indexOf(activeItem);
    
    // Next image comes from the stacked images
    const nextIndex = (activeIndex + 1) % items.length;
    const nextItem = items[nextIndex];
    
    // Current active goes to back of stack
    activeItem.classList.remove('active');
    activeItem.classList.add('sliding-left');
    
    // Next item comes to front
    nextItem.classList.remove('stacked');
    nextItem.classList.add('sliding-right');
    
    setTimeout(() => {
        activeItem.classList.remove('sliding-left');
        activeItem.classList.add('stacked');
        
        nextItem.classList.remove('sliding-right');
        nextItem.classList.add('active');
        
        container.dataset.current = nextIndex;
        updatePageIndicator(categoryIndex, nextIndex, items.length);
    }, 500);
}

function slideToPrevImage(categoryIndex) {
    const container = document.querySelector(`.category-images[data-category="${categoryIndex}"]`);
    const items = Array.from(container.querySelectorAll('.showcase-item'));
    const activeItem = container.querySelector('.showcase-item.active');
    const activeIndex = items.indexOf(activeItem);
    
    // Previous image is the last stacked image
    const prevIndex = (activeIndex - 1 + items.length) % items.length;
    const prevItem = items[prevIndex];
    
    // Current active goes to stack
    activeItem.classList.remove('active');
    activeItem.classList.add('sliding-right');
    
    // Previous item comes from back to front
    prevItem.classList.remove('stacked');
    prevItem.classList.add('sliding-left');
    
    setTimeout(() => {
        activeItem.classList.remove('sliding-right');
        activeItem.classList.add('stacked');
        
        prevItem.classList.remove('sliding-left');
        prevItem.classList.add('active');
        
        container.dataset.current = prevIndex;
        updatePageIndicator(categoryIndex, prevIndex, items.length);
    }, 500);
}

function updatePageIndicator(categoryIndex, currentPage, totalPages) {
    const category = document.querySelectorAll('.showcase-category')[categoryIndex];
    const indicator = category.querySelector('.page-indicator');
    if (indicator) {
        const currentSpan = indicator.querySelector('.current-page');
        currentSpan.textContent = currentPage + 1;
    }
}