public with sharing class RESCommunityLoginController {
    @AuraEnabled
    public static String login(String username, String password, String startUrl) {
        try {
            PageReference loginPage = Site.login(username, password, startUrl);
            if (loginPage != null) {
                return loginPage.getUrl();
            } else {
                throw new AuraHandledException('Invalid credentials');
            }
        } catch (Exception e) {
            throw new AuraHandledException('Error during login: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static Boolean forgotPassword(String username) {
        try {
            return Site.forgotPassword(username);
        }catch(Exception e){
            throw new AuraHandledException('Error on forgot password: ' + e.getMessage());
        }
    }
}