public without sharing class RESHotelCard {
    
    @AuraEnabled
    public static List<Hotel__c> getHotelDetails() {

        List<Hotel__c> hoteldetails = [SELECT Id,Name,Rating__c,City__c,State__c,Banner_Photo_Url__c,Price__c FROM Hotel__c];

        return hoteldetails;
    }

}