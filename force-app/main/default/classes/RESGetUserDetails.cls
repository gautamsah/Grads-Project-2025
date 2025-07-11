public without sharing class RESGetUserDetails {
	@AuraEnabled
    public static String getUserName(){
        return UserInfo.getFirstName();
    }
}