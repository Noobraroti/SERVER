// KeyAuth User License Validation System

class KeyAuthUser {
    constructor() {
        this.licenseModal = null;
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is already licensed
        this.checkUserLicense();

        // Create license validation modal
        this.createLicenseModal();

        // Protect premium content
        this.protectPremiumContent();
    }

    checkUserLicense() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            this.currentUser = loggedInUser;
            // Check if user has valid license
            const isLicensed = keyAuth.isUserLicensed(loggedInUser);
            if (isLicensed) {
                this.onLicenseValidated();
            }
        }
    }

    createLicenseModal() {
        // Create modal HTML
        const modalHTML = `
            <div id="keyauth-license-modal" class="keyauth-modal">
                <div class="keyauth-modal-content">
                    <div class="keyauth-modal-header">
                        <h2>🔑 License Required</h2>
                        <span class="keyauth-modal-close">&times;</span>
                    </div>
                    <div class="keyauth-modal-body">
                        <div class="keyauth-license-form">
                            <div class="keyauth-license-info">
                                <h3>Premium Access Required</h3>
                                <p>This feature requires a valid license key. Please enter your license key below or purchase one from our store.</p>
                            </div>

                            <div class="keyauth-input-group">
                                <label for="user-license-key">License Key</label>
                                <input type="text" id="user-license-key" placeholder="XXXX-XXXX-XXXX-XXXX" required>
                                <small class="keyauth-help-text">Enter your 16-character license key</small>
                            </div>

                            <div class="keyauth-license-actions">
                                <button id="validate-license-btn" class="keyauth-btn keyauth-btn-primary">
                                    <span class="keyauth-btn-text">Validate License</span>
                                    <div class="keyauth-btn-spinner" style="display: none;"></div>
                                </button>
                                <button id="purchase-license-btn" class="keyauth-btn keyauth-btn-secondary">
                                    Purchase License
                                </button>
                            </div>

                            <div id="license-message" class="keyauth-message"></div>

                            <div class="keyauth-license-details" id="license-details" style="display: none;">
                                <h4>License Information</h4>
                                <div class="keyauth-license-info-grid">
                                    <div class="keyauth-info-item">
                                        <span class="keyauth-info-label">Subscription:</span>
                                        <span class="keyauth-info-value" id="license-subscription">N/A</span>
                                    </div>
                                    <div class="keyauth-info-item">
                                        <span class="keyauth-info-label">Expires:</span>
                                        <span class="keyauth-info-value" id="license-expires">N/A</span>
                                    </div>
                                    <div class="keyauth-info-item">
                                        <span class="keyauth-info-label">Status:</span>
                                        <span class="keyauth-info-value" id="license-status">N/A</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = `
            <style>
                .keyauth-license-form {
                    max-width: 500px;
                    margin: 0 auto;
                }

                .keyauth-license-info {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .keyauth-license-info h3 {
                    color: #00ff00;
                    margin-bottom: 10px;
                }

                .keyauth-license-info p {
                    color: #ccc;
                    line-height: 1.6;
                }

                .keyauth-help-text {
                    display: block;
                    margin-top: 5px;
                    font-size: 0.9rem;
                    color: #888;
                }

                .keyauth-license-actions {
                    display: flex;
                    gap: 15px;
                    margin: 20px 0;
                }

                .keyauth-btn-secondary {
                    background: linear-gradient(135deg, #666 0%, #444 100%);
                    color: #fff;
                    flex: 1;
                }

                .keyauth-btn-secondary:hover {
                    background: linear-gradient(135deg, #777 0%, #555 100%);
                }

                .keyauth-license-details {
                    margin-top: 30px;
                    padding: 20px;
                    background: rgba(0, 255, 0, 0.05);
                    border: 1px solid rgba(0, 255, 0, 0.2);
                    border-radius: 8px;
                }

                .keyauth-license-details h4 {
                    color: #00ff00;
                    margin-bottom: 15px;
                    text-align: center;
                }

                .keyauth-license-info-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 10px;
                }

                .keyauth-info-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid rgba(0, 255, 0, 0.1);
                }

                .keyauth-info-label {
                    font-weight: 500;
                    color: #ccc;
                }

                .keyauth-info-value {
                    font-weight: 600;
                    color: #00ff00;
                }

                @media (min-width: 768px) {
                    .keyauth-license-actions {
                        flex-direction: row;
                    }

                    .keyauth-license-info-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            </style>
        `;

        // Add to document
        document.head.insertAdjacentHTML('beforeend', modalStyles);
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        this.licenseModal = document.getElementById('keyauth-license-modal');

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        const closeBtn = this.licenseModal.querySelector('.keyauth-modal-close');
        const validateBtn = document.getElementById('validate-license-btn');
        const purchaseBtn = document.getElementById('purchase-license-btn');
        const licenseInput = document.getElementById('user-license-key');

        // Close modal
        closeBtn.addEventListener('click', () => {
            this.hideLicenseModal();
        });

        // Click outside to close
        this.licenseModal.addEventListener('click', (e) => {
            if (e.target === this.licenseModal) {
                this.hideLicenseModal();
            }
        });

        // Enter key to submit
        licenseInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.validateLicense();
            }
        });

        // Auto-format license key
        licenseInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
            if (value.length > 16) value = value.substr(0, 16);

            // Add dashes every 4 characters
            let formatted = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) formatted += '-';
                formatted += value[i];
            }

            e.target.value = formatted;
        });

        // Validate license button
        validateBtn.addEventListener('click', () => {
            this.validateLicense();
        });

        // Purchase license button
        purchaseBtn.addEventListener('click', () => {
            this.showPurchaseOptions();
        });
    }

    showLicenseModal() {
        this.licenseModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        document.getElementById('user-license-key').focus();
    }

    hideLicenseModal() {
        this.licenseModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    async validateLicense() {
        const licenseKey = document.getElementById('user-license-key').value.replace(/-/g, '');
        const validateBtn = document.getElementById('validate-license-btn');
        const btnText = validateBtn.querySelector('.keyauth-btn-text');
        const spinner = validateBtn.querySelector('.keyauth-btn-spinner');

        if (licenseKey.length !== 16) {
            this.showMessage('Please enter a valid 16-character license key', 'error');
            return;
        }

        // Show loading
        btnText.textContent = 'Validating...';
        spinner.style.display = 'inline-block';
        validateBtn.disabled = true;

        try {
            const hwid = keyAuth.getHWID();
            const result = await keyAuth.validateLicense(licenseKey, hwid);

            if (result.success) {
                // Store license validation for current user
                if (this.currentUser) {
                    const users = JSON.parse(localStorage.getItem('keyauth_users'));
                    users[this.currentUser] = users[this.currentUser] || {};
                    users[this.currentUser].license = licenseKey;
                    users[this.currentUser].subscription = result.subscription;
                    users[this.currentUser].validated = Date.now();
                    localStorage.setItem('keyauth_users', JSON.stringify(users));
                }

                this.showMessage(result.message, 'success');
                this.showLicenseDetails(result);

                setTimeout(() => {
                    this.hideLicenseModal();
                    this.onLicenseValidated();
                }, 2000);
            } else {
                this.showMessage(result.message, 'error');
            }
        } catch (error) {
            this.showMessage('License validation failed: ' + error.message, 'error');
        } finally {
            // Reset button
            btnText.textContent = 'Validate License';
            spinner.style.display = 'none';
            validateBtn.disabled = false;
        }
    }

    showMessage(message, type) {
        const messageEl = document.getElementById('license-message');
        messageEl.textContent = message;
        messageEl.className = `keyauth-message ${type}`;
    }

    showLicenseDetails(licenseData) {
        const detailsEl = document.getElementById('license-details');
        const subscriptionEl = document.getElementById('license-subscription');
        const expiresEl = document.getElementById('license-expires');
        const statusEl = document.getElementById('license-status');

        subscriptionEl.textContent = licenseData.subscription || 'N/A';
        expiresEl.textContent = licenseData.expires ? new Date(licenseData.expires).toLocaleDateString() : 'Never';
        statusEl.textContent = 'Active';

        detailsEl.style.display = 'block';
    }

    showPurchaseOptions() {
        // Redirect to purchase page or show purchase modal
        alert('Redirecting to purchase page...');
        // window.location.href = 'purchase.html';
    }

    protectPremiumContent() {
        // Add premium content protection logic here
        const premiumElements = document.querySelectorAll('.premium-content');

        premiumElements.forEach(element => {
            if (!this.isUserLicensed()) {
                element.style.display = 'none';

                // Add premium overlay
                const overlay = document.createElement('div');
                overlay.className = 'premium-overlay';
                overlay.innerHTML = `
                    <div class="premium-message">
                        <h3>🔒 Premium Feature</h3>
                        <p>This feature requires a valid license.</p>
                        <button onclick="keyAuthUser.showLicenseModal()" class="keyauth-btn keyauth-btn-primary">
                            Enter License Key
                        </button>
                    </div>
                `;
                overlay.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(5px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 100;
                    border-radius: inherit;
                `;

                element.style.position = 'relative';
                element.appendChild(overlay);
            }
        });
    }

    isUserLicensed() {
        if (!this.currentUser) return false;
        return keyAuth.isUserLicensed(this.currentUser);
    }

    onLicenseValidated() {
        // Show premium content
        const premiumElements = document.querySelectorAll('.premium-content');
        premiumElements.forEach(element => {
            element.style.display = 'block';
            // Remove premium overlays
            const overlays = element.querySelectorAll('.premium-overlay');
            overlays.forEach(overlay => overlay.remove());
        });

        // Update UI to show licensed status
        this.updateUIForLicensedUser();
    }

    updateUIForLicensedUser() {
        // Add licensed user indicators
        const subscription = keyAuth.getUserSubscription(this.currentUser);
        if (subscription) {
            // Add subscription badge to nav
            const nav = document.querySelector('.nav-container');
            if (nav) {
                const badge = document.createElement('span');
                badge.className = 'subscription-badge';
                badge.textContent = `⭐ ${subscription.toUpperCase()}`;
                badge.style.cssText = `
                    background: linear-gradient(135deg, #00ff00 0%, #00aa00 100%);
                    color: #000;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 0.8rem;
                    font-weight: bold;
                    margin-left: 10px;
                `;
                nav.appendChild(badge);
            }
        }
    }

    requireLicense() {
        if (!this.isUserLicensed()) {
            this.showLicenseModal();
            return false;
        }
        return true;
    }
}

// Initialize KeyAuth User System
const keyAuthUser = new KeyAuthUser();

// Export for global use
window.KeyAuthUser = KeyAuthUser;
window.keyAuthUser = keyAuthUser;
