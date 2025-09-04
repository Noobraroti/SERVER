// KeyAuth Admin Authentication System

class KeyAuthAdmin {
    constructor() {
        this.authModal = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        // Check if already authenticated
        this.checkAuthentication();

        // Create authentication modal
        this.createAuthModal();

        // Protect admin routes
        this.protectAdminRoutes();
    }

    checkAuthentication() {
        this.isAuthenticated = keyAuth.isAdminAuthenticated();
    }

    createAuthModal() {
        // Create modal HTML
        const modalHTML = `
            <div id="keyauth-admin-modal" class="keyauth-modal">
                <div class="keyauth-modal-content">
                    <div class="keyauth-modal-header">
                        <h2>🔐 Admin Authentication</h2>
                        <span class="keyauth-modal-close">&times;</span>
                    </div>
                    <div class="keyauth-modal-body">
                        <div class="keyauth-auth-form">
                            <div class="keyauth-input-group">
                                <label for="admin-master-key">Master Key</label>
                                <input type="password" id="admin-master-key" placeholder="Enter admin master key" required>
                            </div>
                            <button id="admin-auth-btn" class="keyauth-btn keyauth-btn-primary">
                                <span class="keyauth-btn-text">Authenticate</span>
                                <div class="keyauth-btn-spinner" style="display: none;"></div>
                            </button>
                            <div id="admin-auth-message" class="keyauth-message"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = `
            <style>
                .keyauth-modal {
                    display: none;
                    position: fixed;
                    z-index: 10000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.9);
                    backdrop-filter: blur(10px);
                }

                .keyauth-modal-content {
                    background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%);
                    margin: 10% auto;
                    padding: 0;
                    border: 1px solid rgba(0, 255, 0, 0.3);
                    border-radius: 15px;
                    width: 90%;
                    max-width: 500px;
                    box-shadow: 0 0 50px rgba(0, 255, 0, 0.3);
                    animation: keyauth-modal-appear 0.3s ease-out;
                }

                @keyframes keyauth-modal-appear {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }

                .keyauth-modal-header {
                    padding: 20px 30px;
                    border-bottom: 1px solid rgba(0, 255, 0, 0.2);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .keyauth-modal-header h2 {
                    margin: 0;
                    color: #00ff00;
                    font-size: 1.5rem;
                }

                .keyauth-modal-close {
                    color: #aaa;
                    font-size: 28px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: color 0.3s;
                }

                .keyauth-modal-close:hover {
                    color: #00ff00;
                }

                .keyauth-modal-body {
                    padding: 30px;
                }

                .keyauth-input-group {
                    margin-bottom: 20px;
                }

                .keyauth-input-group label {
                    display: block;
                    margin-bottom: 8px;
                    color: #00ff00;
                    font-weight: 500;
                }

                .keyauth-input-group input {
                    width: 100%;
                    padding: 12px 15px;
                    background: rgba(0, 255, 0, 0.1);
                    border: 1px solid rgba(0, 255, 0, 0.3);
                    border-radius: 8px;
                    color: #00ff00;
                    font-size: 16px;
                    transition: all 0.3s;
                }

                .keyauth-input-group input:focus {
                    outline: none;
                    border-color: #00ff00;
                    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
                    background: rgba(0, 255, 0, 0.15);
                }

                .keyauth-btn {
                    width: 100%;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    position: relative;
                    overflow: hidden;
                }

                .keyauth-btn-primary {
                    background: linear-gradient(135deg, #00ff00 0%, #00aa00 100%);
                    color: #000;
                }

                .keyauth-btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 255, 0, 0.4);
                }

                .keyauth-btn-spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid #000;
                    border-top: 2px solid transparent;
                    border-radius: 50%;
                    animation: keyauth-spin 1s linear infinite;
                    display: inline-block;
                    margin-left: 10px;
                }

                @keyframes keyauth-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .keyauth-message {
                    margin-top: 15px;
                    padding: 10px;
                    border-radius: 5px;
                    text-align: center;
                    font-weight: 500;
                }

                .keyauth-message.success {
                    background: rgba(0, 255, 0, 0.2);
                    color: #00ff00;
                    border: 1px solid rgba(0, 255, 0, 0.3);
                }

                .keyauth-message.error {
                    background: rgba(255, 0, 0, 0.2);
                    color: #ff4444;
                    border: 1px solid rgba(255, 0, 0, 0.3);
                }

                .keyauth-auth-form {
                    max-width: 400px;
                    margin: 0 auto;
                }
            </style>
        `;

        // Add to document
        document.head.insertAdjacentHTML('beforeend', modalStyles);
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        this.authModal = document.getElementById('keyauth-admin-modal');

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        const closeBtn = this.authModal.querySelector('.keyauth-modal-close');
        const authBtn = document.getElementById('admin-auth-btn');
        const masterKeyInput = document.getElementById('admin-master-key');

        // Close modal
        closeBtn.addEventListener('click', () => {
            this.hideAuthModal();
            // Redirect away from admin page on close
            if (window.location.pathname.includes('admin.html')) {
                window.location.href = 'index.html';
            }
        });

        // Click outside to close
        this.authModal.addEventListener('click', (e) => {
            if (e.target === this.authModal) {
                this.hideAuthModal();
                // Redirect away from admin page on close
                if (window.location.pathname.includes('admin.html')) {
                    window.location.href = 'index.html';
                }
            }
        });

        // Enter key to submit
        masterKeyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.authenticateAdmin();
            }
        });

        // Authenticate button
        authBtn.addEventListener('click', () => {
            this.authenticateAdmin();
        });
    }

    showAuthModal() {
        this.authModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        document.getElementById('admin-master-key').focus();
    }

    hideAuthModal() {
        this.authModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    async authenticateAdmin() {
        const masterKey = document.getElementById('admin-master-key').value;
        const authBtn = document.getElementById('admin-auth-btn');
        const btnText = authBtn.querySelector('.keyauth-btn-text');
        const spinner = authBtn.querySelector('.keyauth-btn-spinner');
        const messageEl = document.getElementById('admin-auth-message');

        if (!masterKey) {
            this.showMessage('Please enter the master key', 'error');
            return;
        }

        // Show loading
        btnText.textContent = 'Authenticating...';
        spinner.style.display = 'inline-block';
        authBtn.disabled = true;

        try {
            const result = await keyAuth.authenticateAdmin(masterKey);

            if (result.success) {
                this.isAuthenticated = true;
                this.showMessage(result.message, 'success');

                setTimeout(() => {
                    this.hideAuthModal();
                    this.onAuthenticationSuccess();
                }, 1000);
            } else {
                this.showMessage(result.message, 'error');
            }
        } catch (error) {
            this.showMessage('Authentication failed: ' + error.message, 'error');
        } finally {
            // Reset button
            btnText.textContent = 'Authenticate';
            spinner.style.display = 'none';
            authBtn.disabled = false;
        }
    }

    showMessage(message, type) {
        const messageEl = document.getElementById('admin-auth-message');
        messageEl.textContent = message;
        messageEl.className = `keyauth-message ${type}`;
    }

    protectAdminRoutes() {
        // Check if current page is admin panel
        if (window.location.pathname.includes('admin.html')) {
            if (!this.isAuthenticated) {
                // Show authentication modal
                setTimeout(() => {
                    this.showAuthModal();
                }, 500);
            }
        }
    }

    onAuthenticationSuccess() {
        // Reload the page to show authenticated content
        window.location.reload();
    }

    logout() {
        keyAuth.logoutAdmin();
        this.isAuthenticated = false;
        window.location.reload();
    }
}

// Initialize KeyAuth Admin System
const keyAuthAdmin = new KeyAuthAdmin();

// Export for global use
window.KeyAuthAdmin = KeyAuthAdmin;
window.keyAuthAdmin = keyAuthAdmin;
