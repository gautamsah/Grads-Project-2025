public with sharing class ReviewController {
    
    @AuraEnabled
    public static void addReview(String reviewDetails){
       
        Map<String, String> jsonMap = (Map<String, String>) JSON.deserializeUntyped(reviewDetails);

        Integer valueForMoney = Integer.valueOf(jsonMap.get('ValueForMoney'));
        Integer foodQuality = Integer.valueOf(jsonMap.get('FoodQuality'));
        Integer hospitality = Integer.valueOf(jsonMap.get('Hospitality'));
        Integer cleanlinessAndHygiene = Integer.valueOf(jsonMap.get('CleanlinessAndHygiene'));
        String reviewHeading = (String)jsonMap.get('ReviewHeading');
        String reviewDescription = (String)jsonMap.get('ReviewDescription');

        Review__c  review = new Review__c(Value_For_Money__c = valueForMoney,Food_Quality__c = foodQuality,Hospitality__c=hospitality,Cleanliness_And_Hygiene__c=cleanlinessAndHygiene ,Description__c =reviewDescription,Review_Title__c = reviewHeading);

        try {
            insert review;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}