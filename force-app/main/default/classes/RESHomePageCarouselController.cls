public without sharing class RESHomePageCarouselController {
    @AuraEnabled(cacheable = false)
    public static List<Offer_Or_Quote__c> getOfferItems(){
        try {
            List<Offer_Or_Quote__c> carouselItems = new List<SObject>();
            carouselItems.addAll([SELECT Id, Type__c, Offer_Img_Url__c FROM Offer_Or_Quote__c WHERE Type__c = 'Offer' LIMIT 6]);
            return carouselItems;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable = false)
    public static List<Offer_Or_Quote__c> getQuoteItems(){
        try {
            List<Offer_Or_Quote__c> carouselItems = new List<SObject>();
            carouselItems.addAll([SELECT Id, Type__c,  Quote_Person_Name__c, Quote_Person_Img_Url__c, Quote_Description__c FROM Offer_Or_Quote__c WHERE Type__c = 'Quote' LIMIT 4]);
            return carouselItems;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}