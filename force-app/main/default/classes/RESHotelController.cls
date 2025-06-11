public without sharing class RESHotelController{
    
    @AuraEnabled
    public static List<Hotel__c> getHotelDetails() {

        List<Hotel__c> hoteldetails = [SELECT Id,Name,City__c,State__c,Banner_Photo_Url__c,Price__c,Overall_Rating__c FROM Hotel__c ORDER BY Rating__c DESC LIMIT 4];

        return hoteldetails;
    }

}