import { LightningElement } from 'lwc';
import login from '@salesforce/apex/LoginControllerCustom.login';
import getIsSelfRegistrationEnabled from '@salesforce/apex/LoginControllerCustom.getIsSelfRegistrationEnabled';
import getSelfRegistrationUrl from '@salesforce/apex/LoginControllerCustom.getSelfRegistrationUrl';
import getForgotPasswordUrl from '@salesforce/apex/LoginControllerCustom.getForgotPasswordUrl';


export default class Loginnform extends LightningElement {

    username = '';
    password = '';
    errorMessage = '';
    forgotPasswordUrl = '';
    selfRegistrationUrl = '';

    connectedCallback() {
        console.log('[LWC] Component initialized');
        this.fetchAuthConfig();
    }

    async fetchAuthConfig() {
        try {
            console.log('[LWC] Fetching authentication config...');
            
            const isSelfRegEnabled = await getIsSelfRegistrationEnabled();
            this.selfRegistrationUrl = isSelfRegEnabled ? await getSelfRegistrationUrl() : '';

            this.forgotPasswordUrl = await getForgotPasswordUrl() || '';

            console.log('[LWC] Self-registration enabled:', isSelfRegEnabled);
            console.log('[LWC] Self-registration URL:', this.selfRegistrationUrl);
            console.log('[LWC] Forgot password URL:', this.forgotPasswordUrl);
        } catch (error) {
            console.error('[LWC] Error fetching authentication config:', error);
        }
    }

    handleUsernameChange(event) {
        this.username = event.target.value.trim();
        console.log('[LWC] Username updated:', this.username);
    }

    handlePasswordChange(event) {
        this.password = event.target.value.trim();
        console.log('[LWC] Password updated: ********'); // Masking password for security
    }

    async handleLogin() {
        console.log('[LWC] Login button clicked');

        if (!this.username || !this.password) {
            this.errorMessage = 'Username and password are required!';
            console.warn('[LWC] Missing username or password');
            return;
        }

        console.log('[LWC] Attempting login with:', this.username);

        try {
            const result = await login({ username: this.username, password: this.password, startUrl: '/' });
            console.log('[LWC] Login result:', result);

            if (result && result.startsWith('https')) {
                console.log('[LWC] Redirecting to:', result);
                window.location.replace(result);
            } else {
                this.errorMessage = result || 'Login failed. Please try again.';
                console.error('[LWC] Login error:', this.errorMessage);
            }
        } catch (error) {
            console.error('[LWC] Login failed:', error);
            this.errorMessage = 'Login failed. Please try again.';
        }
    }

}