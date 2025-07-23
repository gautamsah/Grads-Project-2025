public without sharing class RESContactUs {
    @AuraEnabled
    public static List<Account> getAccountOfCurrentUser() {
    Id userId = UserInfo.getUserId();

    List<User> usr = [SELECT Id, AccountId FROM User WHERE Id = :userId LIMIT 1];

    List<Account> accList = [SELECT Id,FirstName,LastName,PersonEmail,Phone FROM Account WHERE Id =:usr[0].AccountId LIMIT 1];

    return accList;
    }
    
}