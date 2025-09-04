document.addEventListener('DOMContentLoaded', () => {
    console.log('Website workspace loaded successfully.');

    // Login form submission with KeyAuth integration
    const loginFormEl = document.getElementById('login-form');
    if (loginFormEl) {
        loginFormEl.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const messageEl = document.getElementById('login-message');

            if (email && password) {
                messageEl.textContent = 'Authenticating...';
                messageEl.style.color = '#00ff00';

                try {
                    // First try KeyAuth API validation
                    const licenseResult = await keyAuth.validateLicenseEnhanced(password);

                    if (licenseResult.success) {
                        // Store user session
                        localStorage.setItem('loggedInUser', email);
                        messageEl.textContent = 'Login successful! Welcome back!';
                        messageEl.style.color = 'green';
                        loginFormEl.reset();

                        // Update navigation
                        updateNav(email);

                        // Redirect after success
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1500);
                    } else {
                        // Fallback to local authentication
                        const users = JSON.parse(localStorage.getItem('users')) || [];
                        const user = users.find(user => user.email === email && user.password === password);

                        if (user) {
                            localStorage.setItem('loggedInUser', email);
                            messageEl.textContent = 'Login successful!';
                            messageEl.style.color = 'green';
                            loginFormEl.reset();

                            // Update navigation
                            updateNav(email);

                            // Redirect or update UI
                            setTimeout(() => {
                                window.location.href = 'index.html';
                            }, 1000);
                        } else {
                            messageEl.textContent = 'Invalid credentials or license key!';
                            messageEl.style.color = 'red';
                        }
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    messageEl.textContent = 'Login failed. Please try again.';
                    messageEl.style.color = 'red';
                }
            } else {
                messageEl.textContent = 'Please fill all fields!';
                messageEl.style.color = 'red';
            }
        });
    }

    // Check if user is logged in and update nav
    const loggedInUser = localStorage.getItem('loggedInUser');
    updateNav(loggedInUser);

    function updateNav(user) {
        const navUl = document.querySelector('.nav-container ul');
        if (navUl) {
            const loginLi = navUl.querySelector('li a[href="login.html"]');
            if (user) {
                if (loginLi) {
                    loginLi.textContent = 'Logout';
                    loginLi.href = '#';
                    loginLi.addEventListener('click', (e) => {
                        e.preventDefault();
                        localStorage.removeItem('loggedInUser');
                        window.location.href = 'index.html';
                    });
                }
            } else {
                if (loginLi) {
                    loginLi.textContent = 'Login';
                    loginLi.href = 'login.html';
                }
            }
        }
    }

    // Typing Animation for Main Heading
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Scroll-triggered Animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, index * 200); // Stagger animations
                }
            });
        }, observerOptions);

        // Observe all cards and sections
        document.querySelectorAll('.card, .animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // Floating Particles Effect
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.id = 'particles';
        particlesContainer.style.position = 'fixed';
        particlesContainer.style.top = '0';
        particlesContainer.style.left = '0';
        particlesContainer.style.width = '100%';
        particlesContainer.style.height = '100%';
        particlesContainer.style.pointerEvents = 'none';
        particlesContainer.style.zIndex = '-2';
        document.body.appendChild(particlesContainer);

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 4 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 0.3)`;
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
            particle.style.animationDelay = Math.random() * 10 + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Enhanced Hover Effects
    function initHoverEffects() {
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.transform = `perspective(1000px) rotateX(${(y - rect.height / 2) / 10}deg) rotateY(${(x - rect.width / 2) / 10}deg) translateZ(20px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // Parallax Effect for Background
    function initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const bgVideo = document.getElementById('bg-video');
            if (bgVideo) {
                bgVideo.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }

    // Initialize on page load
    initScrollAnimations();
    initHoverEffects();
    initParallax();
    createParticles();

    // Advanced AI-Powered Animations
    const mainHeading = document.querySelector('header h1');
    if (mainHeading && mainHeading.textContent) {
        const originalText = mainHeading.textContent;
        setTimeout(() => {
            aiTypeWriter(mainHeading, originalText, 80);
        }, 500);
    }

    // Matrix Rain Effect
    function createMatrixRain() {
        const canvas = document.createElement('canvas');
        canvas.id = 'matrix-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        canvas.style.opacity = '0.1';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const matrix = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const matrixArray = matrix.split("");

        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff00';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(draw, 35);
    }

    // AI-Enhanced Typing Animation
    function aiTypeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        element.style.borderRight = '2px solid #00ff00';

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;

                // Add random typing variations
                const randomSpeed = speed + (Math.random() - 0.5) * 50;
                setTimeout(type, randomSpeed);
            } else {
                // Cursor blink effect
                setInterval(() => {
                    element.style.borderRight = element.style.borderRight === 'none' ? '2px solid #00ff00' : 'none';
                }, 500);
            }
        }
        type();
    }

    // Neural Network Particle System
    function createNeuralNetwork() {
        const container = document.createElement('div');
        container.id = 'neural-network';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '-1';
        document.body.appendChild(container);

        const nodes = [];
        const connections = [];

        // Create nodes
        for (let i = 0; i < 20; i++) {
            const node = document.createElement('div');
            node.className = 'neural-node';
            node.style.position = 'absolute';
            node.style.width = '4px';
            node.style.height = '4px';
            node.style.background = '#00ff00';
            node.style.borderRadius = '50%';
            node.style.left = Math.random() * 100 + '%';
            node.style.top = Math.random() * 100 + '%';
            node.style.boxShadow = '0 0 10px #00ff00';
            container.appendChild(node);
            nodes.push({
                element: node,
                x: parseFloat(node.style.left),
                y: parseFloat(node.style.top),
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }

        // Create connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (Math.random() > 0.8) {
                    connections.push({
                        from: nodes[i],
                        to: nodes[j],
                        strength: Math.random()
                    });
                }
            }
        }

        function updateNetwork() {
            // Update node positions
            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > 100) node.vx *= -1;
                if (node.y < 0 || node.y > 100) node.vy *= -1;

                node.element.style.left = node.x + '%';
                node.element.style.top = node.y + '%';
            });

            // Draw connections
            const canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            connections.forEach(conn => {
                const fromX = (conn.from.x / 100) * canvas.width;
                const fromY = (conn.from.y / 100) * canvas.height;
                const toX = (conn.to.x / 100) * canvas.width;
                const toY = (conn.to.y / 100) * canvas.height;

                ctx.strokeStyle = `rgba(0, 255, 0, ${conn.strength * 0.3})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(toX, toY);
                ctx.stroke();
            });

            container.appendChild(canvas);
            setTimeout(() => canvas.remove(), 100);
        }

        setInterval(updateNetwork, 50);
    }

    // Holographic Text Effect
    function createHolographicText() {
        const headings = document.querySelectorAll('h1, h2, h3');
        headings.forEach(heading => {
            heading.classList.add('holographic-text');
        });
    }

    // Quantum Particle Burst
    function createQuantumBurst() {
        const burst = document.createElement('div');
        burst.className = 'quantum-burst';
        burst.style.position = 'fixed';
        burst.style.top = '50%';
        burst.style.left = '50%';
        burst.style.width = '0px';
        burst.style.height = '0px';
        burst.style.borderRadius = '50%';
        burst.style.background = 'radial-gradient(circle, rgba(0,255,0,0.8) 0%, rgba(0,255,255,0.4) 50%, transparent 70%)';
        burst.style.transform = 'translate(-50%, -50%)';
        burst.style.pointerEvents = 'none';
        burst.style.zIndex = '1000';
        document.body.appendChild(burst);

        let size = 0;
        const maxSize = 500;
        const duration = 2000;

        const animate = () => {
            size += maxSize / (duration / 16);
            burst.style.width = size + 'px';
            burst.style.height = size + 'px';
            burst.style.opacity = 1 - (size / maxSize);

            if (size < maxSize) {
                requestAnimationFrame(animate);
            } else {
                burst.remove();
            }
        };

        animate();
    }

    // Initialize Advanced Effects
    createMatrixRain();
    createNeuralNetwork();
    createHolographicText();

    // Trigger quantum burst on page load
    setTimeout(createQuantumBurst, 1000);

    // YouTube Video Previewer Functionality
    function initYouTubePreviewer() {
        const videoGrid = document.getElementById('video-grid');
        const videoModal = document.getElementById('video-modal');
        const videoPlayer = document.getElementById('video-player');
        const closeModal = document.querySelector('.close-modal');

        // YouTube video data
        const videos = [
            {
                id: 'cD1YCAt3sks',
                title: 'Gaming Video 1',
                duration: '10:30'
            },
            {
                id: 'higfC1Kuj1o',
                title: 'Gaming Video 2',
                duration: '15:45'
            },
            {
                id: '-GCUKnpJoH8',
                title: 'Gaming Video 3',
                duration: '8:20'
            },
            {
                id: 'ZmbGYkId73c',
                title: 'Gaming Video 4',
                duration: '12:15'
            },
            {
                id: 'Zmx83JHuB_8',
                title: 'Gaming Video 5',
                duration: '18:50'
            }
        ];

        // Create video thumbnails
        videos.forEach(video => {
            const videoElement = document.createElement('div');
            videoElement.className = 'video-thumbnail';
            videoElement.innerHTML = `
                <div class="play-button"></div>
                <img src="https://img.youtube.com/vi/${video.id}/maxresdefault.jpg"
                     alt="${video.title}"
                     onerror="this.src='https://img.youtube.com/vi/${video.id}/hqdefault.jpg'">
                <div class="video-info">
                    <h4 class="video-title">${video.title}</h4>
                    <p class="video-duration">${video.duration}</p>
                </div>
            `;

            // Add click event to open modal
            videoElement.addEventListener('click', () => {
                openVideoModal(video.id);
            });

            videoGrid.appendChild(videoElement);
        });

        // Modal functionality
        function openVideoModal(videoId) {
            const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            videoPlayer.src = embedUrl;
            videoModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        function closeVideoModal() {
            videoModal.style.display = 'none';
            videoPlayer.src = '';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }

        // Close modal events
        closeModal.addEventListener('click', closeVideoModal);

        // Close modal when clicking outside
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.style.display === 'block') {
                closeVideoModal();
            }
        });
    }

    // Initialize YouTube previewer when DOM is loaded
    if (document.getElementById('video-grid')) {
        initYouTubePreviewer();
    }

    // Auto-resize functionality for responsive UI
    function initAutoResize() {
        let resizeTimeout;

        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateResponsiveLayout();
                updateVideoGridLayout();
                updateModalLayout();
            }, 250); // Debounce resize events
        }

        function updateResponsiveLayout() {
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Update main container max-width based on screen size
            const main = document.querySelector('main');
            if (main) {
                if (width <= 480) {
                    main.style.padding = '1rem';
                    main.style.maxWidth = '100%';
                } else if (width <= 768) {
                    main.style.padding = '1.5rem';
                    main.style.maxWidth = '100%';
                } else if (width <= 1024) {
                    main.style.padding = '2rem';
                    main.style.maxWidth = '1000px';
                } else {
                    main.style.padding = '2rem';
                    main.style.maxWidth = '1200px';
                }
            }

            // Update navigation for mobile
            const navContainer = document.querySelector('.nav-container');
            if (navContainer) {
                if (width <= 768) {
                    navContainer.style.padding = '1rem';
                    navContainer.style.flexDirection = 'column';
                    navContainer.style.gap = '1rem';
                } else {
                    navContainer.style.padding = '1rem 2rem';
                    navContainer.style.flexDirection = 'row';
                    navContainer.style.gap = '2rem';
                }
            }

            // Update header text size
            const headerTitle = document.querySelector('header h1');
            if (headerTitle) {
                if (width <= 480) {
                    headerTitle.style.fontSize = '2rem';
                } else if (width <= 768) {
                    headerTitle.style.fontSize = '2.5rem';
                } else {
                    headerTitle.style.fontSize = '3rem';
                }
            }

            // Update card padding and margins
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                if (width <= 480) {
                    card.style.padding = '1rem';
                    card.style.margin = '0.5rem 0';
                } else if (width <= 768) {
                    card.style.padding = '1.5rem';
                    card.style.margin = '0.75rem 0';
                } else {
                    card.style.padding = '2rem';
                    card.style.margin = '1rem 0';
                }
            });
        }

        function updateVideoGridLayout() {
            const videoGrid = document.getElementById('video-grid');
            if (!videoGrid) return;

            const width = window.innerWidth;
            const videoThumbnails = videoGrid.querySelectorAll('.video-thumbnail');

            if (width <= 480) {
                // Single column on mobile
                videoGrid.style.gridTemplateColumns = '1fr';
                videoGrid.style.gap = '1rem';

                videoThumbnails.forEach(thumbnail => {
                    const img = thumbnail.querySelector('img');
                    if (img) img.style.height = '150px';

                    const info = thumbnail.querySelector('.video-info');
                    if (info) info.style.padding = '0.75rem';

                    const title = thumbnail.querySelector('.video-title');
                    if (title) title.style.fontSize = '1rem';
                });
            } else if (width <= 768) {
                // Two columns on tablet
                videoGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                videoGrid.style.gap = '1rem';

                videoThumbnails.forEach(thumbnail => {
                    const img = thumbnail.querySelector('img');
                    if (img) img.style.height = '180px';

                    const info = thumbnail.querySelector('.video-info');
                    if (info) info.style.padding = '0.875rem';

                    const title = thumbnail.querySelector('.video-title');
                    if (title) title.style.fontSize = '1rem';
                });
            } else if (width <= 1024) {
                // Three columns on small desktop
                videoGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
                videoGrid.style.gap = '1.25rem';

                videoThumbnails.forEach(thumbnail => {
                    const img = thumbnail.querySelector('img');
                    if (img) img.style.height = '200px';

                    const info = thumbnail.querySelector('.video-info');
                    if (info) info.style.padding = '1rem';

                    const title = thumbnail.querySelector('.video-title');
                    if (title) title.style.fontSize = '1.1rem';
                });
            } else {
                // Four columns on large desktop
                videoGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
                videoGrid.style.gap = '1.5rem';

                videoThumbnails.forEach(thumbnail => {
                    const img = thumbnail.querySelector('img');
                    if (img) img.style.height = '200px';

                    const info = thumbnail.querySelector('.video-info');
                    if (info) info.style.padding = '1rem';

                    const title = thumbnail.querySelector('.video-title');
                    if (title) title.style.fontSize = '1.1rem';
                });
            }
        }

        function updateModalLayout() {
            const modal = document.getElementById('video-modal');
            if (!modal || modal.style.display === 'none') return;

            const width = window.innerWidth;
            const height = window.innerHeight;
            const modalContent = modal.querySelector('.video-modal-content');

            if (modalContent) {
                if (width <= 480) {
                    modalContent.style.width = '95%';
                    modalContent.style.margin = '5% auto';
                    modalContent.style.maxHeight = '90vh';
                } else if (width <= 768) {
                    modalContent.style.width = '90%';
                    modalContent.style.margin = '10% auto';
                    modalContent.style.maxHeight = '80vh';
                } else {
                    modalContent.style.width = '90%';
                    modalContent.style.margin = '5% auto';
                    modalContent.style.maxHeight = '80vh';
                }

                // Adjust video player aspect ratio for very small screens
                const videoContainer = modalContent.querySelector('.video-player-container');
                if (videoContainer) {
                    if (height < 600) {
                        videoContainer.style.paddingBottom = '50%'; // More square aspect ratio
                    } else {
                        videoContainer.style.paddingBottom = '56.25%'; // Standard 16:9
                    }
                }
            }
        }

        // Initial layout update
        updateResponsiveLayout();
        updateVideoGridLayout();
        updateModalLayout();

        // Add resize event listener
        window.addEventListener('resize', handleResize);

        // Also listen for orientation change on mobile devices
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                updateResponsiveLayout();
                updateVideoGridLayout();
                updateModalLayout();
            }, 100);
        });
    }

    // Initialize auto-resize functionality
    initAutoResize();
});
