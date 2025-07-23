public without sharing class HotelWrapper {
    @AuraEnabled(cacheable=true)
    public static List<HotelWrapperData> getHotelWithRating(String hotelName){
        try {
            List<HotelWrapperData> hotelWrapList = new List<HotelWrapperData>();
            Hotel__c hotelList = [SELECT Id, Name, Banner_Photo_Url__c, Front_Img__c,Location__c, Includes__c, Not_Includes__c, Peripheral_Img__c, Safety_Rules__c,  Total_Reviews__c, Avg_Value_For_Money__c, Avg_Hospitality__c, Avg_Food_Quality__c, Avg_Cleanliness_And_Hygiene__c, Overall_Rating__c, City__c, State__c, Description__c, Unique_Hotel_Name__c, (SELECT Id, Avg_Rating__c, Reviewer_Name__c, CreatedDate, Review_Title__c, Description__c FROM Reviews__r) FROM Hotel__c WHERE Unique_Hotel_Name__c = :hotelName];

            hotelWrapList.add(new HotelWrapperData(hotelList, hotelList.Reviews__r));
            return hotelWrapList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class HotelWrapperData{
        @AuraEnabled public Hotel__c hotelRecord{get;set;}
        @AuraEnabled public List<Review__c> ratingList{get;set;}
        public HotelWrapperData(Hotel__c hotelRecord, List<Review__c> ratingList){
            this.hotelRecord = hotelRecord;
            this.ratingList = ratingList;
        }
    }
}