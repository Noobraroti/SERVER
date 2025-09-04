// KeyAuth Configuration System
// Integrated with real KeyAuth API

class KeyAuthSystem {
    constructor() {
        // KeyAuth API Configuration
        this.apiUrl = 'https://keyauth.win/api/1.2/';
        this.appName = "Adityagallexy's Application";
        this.ownerid = 'juukBWLmUl';
        this.appSecret = 'a54c235f8863ec80dff6099d7ffd9eef23b89f5722ea73fa6e00bb80aebab320';
        this.appVersion = '1.0.0';

        // Local fallback storage for offline functionality
        this.initializeStorage();

        // API session data
        this.sessionId = null;
        this.enckey = null;
    }

    initializeStorage() {
        if (!localStorage.getItem('keyauth_sessions')) {
            localStorage.setItem('keyauth_sessions', JSON.stringify({}));
        }
        if (!localStorage.getItem('keyauth_licenses')) {
            localStorage.setItem('keyauth_licenses', JSON.stringify({}));
        }
        if (!localStorage.getItem('keyauth_users')) {
            localStorage.setItem('keyauth_users', JSON.stringify({}));
        }
    }

    // Admin Authentication (using ownerid as master key)
    async authenticateAdmin(masterKey) {
        if (masterKey === this.ownerid) {
            const sessionToken = this.generateSessionToken();
            const sessions = JSON.parse(localStorage.getItem('keyauth_sessions'));
            sessions.admin = {
                token: sessionToken,
                expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
                type: 'admin'
            };
            localStorage.setItem('keyauth_sessions', JSON.stringify(sessions));
            return { success: true, token: sessionToken, message: 'Admin authenticated successfully' };
        }
        return { success: false, message: 'Invalid admin credentials' };
    }

    // User License Validation
    async validateLicense(licenseKey, hwid = null) {
        const licenses = JSON.parse(localStorage.getItem('keyauth_licenses'));

        if (!licenses[licenseKey]) {
            return { success: false, message: 'Invalid license key' };
        }

        const license = licenses[licenseKey];

        // Check if license is expired
        if (license.expires && Date.now() > license.expires) {
            return { success: false, message: 'License expired' };
        }

        // Check HWID binding if required
        if (license.hwidRequired && hwid && license.hwid !== hwid) {
            return { success: false, message: 'HWID mismatch' };
        }

        // Update last used
        license.lastUsed = Date.now();
        localStorage.setItem('keyauth_licenses', JSON.stringify(licenses));

        return {
            success: true,
            user: license.user,
            subscription: license.subscription,
            message: 'License validated successfully'
        };
    }

    // Create License Key
    async createLicense(userEmail, subscription = 'basic', duration = 30, hwidRequired = false) {
        const licenseKey = this.generateLicenseKey();
        const licenses = JSON.parse(localStorage.getItem('keyauth_licenses'));

        licenses[licenseKey] = {
            user: userEmail,
            subscription: subscription,
            created: Date.now(),
            expires: duration > 0 ? Date.now() + (duration * 24 * 60 * 60 * 1000) : null,
            hwidRequired: hwidRequired,
            hwid: hwidRequired ? this.getHWID() : null,
            lastUsed: null,
            status: 'active'
        };

        localStorage.setItem('keyauth_licenses', JSON.stringify(licenses));

        // Store user license mapping
        const users = JSON.parse(localStorage.getItem('keyauth_users'));
        users[userEmail] = users[userEmail] || {};
        users[userEmail].license = licenseKey;
        users[userEmail].subscription = subscription;
        localStorage.setItem('keyauth_users', JSON.stringify(users));

        return { success: true, licenseKey: licenseKey, message: 'License created successfully' };
    }

    // Get Hardware ID (simplified)
    getHWID() {
        // In a real implementation, this would get actual hardware fingerprint
        return btoa(navigator.userAgent + navigator.language + screen.width + screen.height);
    }

    // Generate Session Token
    generateSessionToken() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Generate License Key
    generateLicenseKey() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 16; i++) {
            if (i > 0 && i % 4 === 0) result += '-';
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Check Admin Session
    isAdminAuthenticated() {
        const sessions = JSON.parse(localStorage.getItem('keyauth_sessions'));
        if (!sessions.admin) return false;

        if (Date.now() > sessions.admin.expires) {
            delete sessions.admin;
            localStorage.setItem('keyauth_sessions', JSON.stringify(sessions));
            return false;
        }

        return true;
    }

    // Check User License
    isUserLicensed(userEmail) {
        const users = JSON.parse(localStorage.getItem('keyauth_users'));
        if (!users[userEmail] || !users[userEmail].license) return false;

        const licenses = JSON.parse(localStorage.getItem('keyauth_licenses'));
        const licenseKey = users[userEmail].license;

        return licenses[licenseKey] && licenses[licenseKey].status === 'active';
    }

    // Get User Subscription
    getUserSubscription(userEmail) {
        const users = JSON.parse(localStorage.getItem('keyauth_users'));
        return users[userEmail] ? users[userEmail].subscription : null;
    }

    // Logout Admin
    logoutAdmin() {
        const sessions = JSON.parse(localStorage.getItem('keyauth_sessions'));
        delete sessions.admin;
        localStorage.setItem('keyauth_sessions', JSON.stringify(sessions));
    }

    // Get All Licenses (Admin only)
    getAllLicenses() {
        if (!this.isAdminAuthenticated()) {
            return { success: false, message: 'Admin authentication required' };
        }
        return { success: true, licenses: JSON.parse(localStorage.getItem('keyauth_licenses')) };
    }

    // Revoke License (Admin only)
    revokeLicense(licenseKey) {
        if (!this.isAdminAuthenticated()) {
            return { success: false, message: 'Admin authentication required' };
        }

        const licenses = JSON.parse(localStorage.getItem('keyauth_licenses'));
        if (licenses[licenseKey]) {
            licenses[licenseKey].status = 'revoked';
            localStorage.setItem('keyauth_licenses', JSON.stringify(licenses));
            return { success: true, message: 'License revoked successfully' };
        }
        return { success: false, message: 'License not found' };
    }

    // ===== KEYAUTH API INTEGRATION METHODS =====

    // Initialize application with KeyAuth
    async initializeApp() {
        try {
            const response = await this.makeApiRequest('init', {
                name: this.appName,
                ownerid: this.ownerid,
                secret: this.appSecret,
                version: this.appVersion
            });

            if (response.success) {
                this.sessionId = response.sessionid;
                this.enckey = response.enckey;
                console.log('KeyAuth initialized successfully');
                return { success: true, message: 'Application initialized' };
            } else {
                console.error('KeyAuth initialization failed:', response.message);
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('KeyAuth API error:', error);
            return { success: false, message: 'API connection failed' };
        }
    }

    // Login user with license key
    async loginWithLicense(licenseKey, hwid = null) {
        try {
            const hwidValue = hwid || this.getHWID();

            const response = await this.makeApiRequest('license', {
                key: licenseKey,
                hwid: hwidValue
            });

            if (response.success) {
                // Store user session
                const userSession = {
                    username: response.username,
                    email: response.email,
                    subscription: response.subscription,
                    expires: response.expires,
                    hwid: hwidValue,
                    ip: response.ip,
                    lastLogin: new Date().toISOString()
                };

                localStorage.setItem('keyauth_user_session', JSON.stringify(userSession));
                localStorage.setItem('loggedInUser', response.username || response.email);

                return {
                    success: true,
                    user: userSession,
                    message: 'License validated successfully'
                };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('License validation error:', error);
            return { success: false, message: 'License validation failed' };
        }
    }

    // Register new user
    async registerUser(username, email, password, licenseKey) {
        try {
            const response = await this.makeApiRequest('register', {
                username: username,
                email: email,
                password: password,
                key: licenseKey,
                hwid: this.getHWID()
            });

            if (response.success) {
                return { success: true, message: 'User registered successfully' };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Registration failed' };
        }
    }

    // Upgrade user license
    async upgradeLicense(licenseKey, newSubscription) {
        try {
            const response = await this.makeApiRequest('upgrade', {
                key: licenseKey,
                subscription: newSubscription
            });

            if (response.success) {
                // Update local user data
                const userSession = JSON.parse(localStorage.getItem('keyauth_user_session') || '{}');
                userSession.subscription = newSubscription;
                localStorage.setItem('keyauth_user_session', JSON.stringify(userSession));

                return { success: true, message: 'License upgraded successfully' };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Upgrade error:', error);
            return { success: false, message: 'License upgrade failed' };
        }
    }

    // Get user data
    async getUserData() {
        try {
            const response = await this.makeApiRequest('userData', {});

            if (response.success) {
                return { success: true, data: response };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Get user data error:', error);
            return { success: false, message: 'Failed to get user data' };
        }
    }

    // Check if user is logged in
    isUserLoggedIn() {
        const userSession = localStorage.getItem('keyauth_user_session');
        if (!userSession) return false;

        const session = JSON.parse(userSession);
        const loggedInUser = localStorage.getItem('loggedInUser');

        return session && loggedInUser && session.username === loggedInUser;
    }

    // Get current user session
    getCurrentUser() {
        const userSession = localStorage.getItem('keyauth_user_session');
        return userSession ? JSON.parse(userSession) : null;
    }

    // Logout user
    logoutUser() {
        localStorage.removeItem('keyauth_user_session');
        localStorage.removeItem('loggedInUser');
    }

    // Make API request to KeyAuth
    async makeApiRequest(type, data) {
        const payload = {
            type: type,
            ...data
        };

        // Add session ID if available
        if (this.sessionId) {
            payload.sessionid = this.sessionId;
        }

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            return result;
        } catch (error) {
            throw new Error('Network request failed: ' + error.message);
        }
    }

    // ===== ENHANCED LOCAL FALLBACK METHODS =====

    // Enhanced license validation with API fallback
    async validateLicenseEnhanced(licenseKey, hwid = null) {
        // Try API first
        try {
            const apiResult = await this.loginWithLicense(licenseKey, hwid);
            if (apiResult.success) {
                return apiResult;
            }
        } catch (error) {
            console.warn('API validation failed, using local fallback:', error.message);
        }

        // Fallback to local validation
        return this.validateLicense(licenseKey, hwid);
    }

    // Enhanced user license check
    isUserLicensedEnhanced(userEmail) {
        // Check API session first
        if (this.isUserLoggedIn()) {
            const userSession = this.getCurrentUser();
            return userSession && userSession.subscription;
        }

        // Fallback to local check
        return this.isUserLicensed(userEmail);
    }
}

// Initialize KeyAuth System
const keyAuth = new KeyAuthSystem();

// Export for use in other scripts
window.KeyAuthSystem = KeyAuthSystem;
window.keyAuth = keyAuth;
