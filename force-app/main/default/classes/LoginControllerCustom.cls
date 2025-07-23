global class LoginControllerCustom {
    
    public LoginControllerCustom() {}

    @AuraEnabled
    public static String login(String username, String password, String startUrl) {
        try {
            System.debug('[Apex] Attempting login for: ' + username);
            ApexPages.PageReference lgn = Site.login(username, password, startUrl);
            
            if (lgn != null) {
                System.debug('[Apex] Login successful! Redirecting to: ' + lgn.getUrl());
                return lgn.getUrl();
            }
            
            return 'Invalid login credentials. Please check your username and password.';
        } catch (Exception ex) {
            System.debug('[Apex] Login failed: ' + ex.getMessage());
            return 'An error occurred during login: ' + ex.getMessage();
        }
    }

    @AuraEnabled
    public static Boolean getIsUsernamePasswordEnabled() {
        Auth.AuthConfiguration authConfig = getAuthConfig();
        return authConfig != null && authConfig.getUsernamePasswordEnabled();
    }

    @AuraEnabled
    public static Boolean getIsSelfRegistrationEnabled() {
        Auth.AuthConfiguration authConfig = getAuthConfig();
        return authConfig != null && authConfig.getSelfRegistrationEnabled();
    }

    @AuraEnabled
    public static String getSelfRegistrationUrl() {
        Auth.AuthConfiguration authConfig = getAuthConfig();
        return (authConfig != null && authConfig.getSelfRegistrationEnabled()) ? authConfig.getSelfRegistrationUrl() : null;
    }

    @AuraEnabled
    public static String getForgotPasswordUrl() {
        Auth.AuthConfiguration authConfig = getAuthConfig();
        return authConfig != null ? authConfig.getForgotPasswordUrl() : null;
    }
    
    @TestVisible
    private static Auth.AuthConfiguration getAuthConfig() {
        Id networkId = Network.getNetworkId();
        if (networkId == null) {
            System.debug('[Apex] No Network ID found.');
            return null;
        }
        return new Auth.AuthConfiguration(networkId, '');
    }

    @AuraEnabled
    global static String setExperienceId(String expId) {
        try {
            if (expId != null) {
                Site.setExperienceId(expId);
            }
            return null; 
        } catch (Exception ex) {
            return 'Error setting Experience ID: ' + ex.getMessage();            
        }
    }   
}