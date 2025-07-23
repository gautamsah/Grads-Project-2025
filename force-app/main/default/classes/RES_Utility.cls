/*
*********************************************************
Apex Class Name    : RES_Utility
Created Date       : March 28, 2025
@description       : This class is used for Fetching the Hotel Details on Specific Criteria
@author            : Jay patel
@date			   : March 28, 2025
@JIRA			   : GT25-32
Modification Log:
Ver   Date         Author                               Modification
1.0   28-03-2025   Jay Patel                           Initial Version
2.0   01-04-2025   Pritkumar Prajapati                 Added getHotelWithRating method
*********************************************************
*/
public without sharing class RES_Utility {

    /*
    *********************************************************
    @Method Name    : getFeatureHotelCards
    @author         : Jay Patel
    @description    : method to is used for Fetching that hotel whose featured checkbox is checked
    @param          : void
    @return         : List<Hotel__c>
	@date			: March 28, 2025
	@JIRA			: GT25-32
    ********************************************************
	*/
    @AuraEnabled
    public static List<Hotel__c> getFeatureHotelCards() {

        List<Hotel__c> hoteldetails = [SELECT Id,Name,City__c,State__c,Banner_Photo_Url__c,Price__c,Overall_Rating__c,Unique_Hotel_Name__c FROM Hotel__c Where Featured__c = true ORDER BY Rating__c DESC LIMIT 4];

        return hoteldetails;
    }

      /*
    *********************************************************
    @Method Name    : getAllHotelsProductsWithRoomAvailibility
    @author         : Jay Patel
    @description    : method to is used for Fetching all the hotel record
    @param          : void
    @return         : List<Hotel__c>
	@date			: April 3, 2025
	@JIRA			: GT25-
    ********************************************************
	*/
    @AuraEnabled(cacheable=true)
    public static List<hotelDetail> getAllHotelsProductsWithRoomAvailibility(Date startDate, Date endDate) {

        List<hotelDetail> hotelList = new List<hotelDetail>();
        Set<Id> hotelIds = new Set<Id>();


        Map<Hotel__c,Boolean> hotelDetailsResultMap = new Map<Hotel__c,Boolean>();
        List<Hotel__c> hotelDetailsResult = new List<Hotel__c>();
        Boolean isRoomFull = false;

        List<Product2> roomDetails = [SELECT Id, Name, ProductCode, Hotel__c, Hotel__r.Overall_Rating__c, Hotel__r.Unique_Hotel_Name__c, Hotel__r.Name, Hotel__r.City__c, Hotel__r.Total_Reviews__c, Room_Type__c, Hotel_Product_Type__c, Product_Unit_Price__c, Image_URL__c, Room_Area__c, Total_Quantity__c, Max_No_Of_Guest__c, Description , (SELECT Id,Available_Slots__c FROM Booked_Dates__r  WHERE Start_Date__c >= :startDate AND End_Date__c <= :endDate) FROM Product2 WHERE Hotel_Product_Type__c = 'Room'];

        System.debug('Start Date...'+startDate);
        System.debug('ended Date...'+endDate);
        System.debug('Room Details...'+roomDetails);
        
        if(!roomDetails.isEmpty()){
            For(Product2 room : roomDetails){
                System.debug('roomDetails' + roomDetails);
                System.debug('inside for');
                if(room.Booked_Dates__r.isEmpty()){
                    System.debug('inside if');
                    hotelIds.add(room.Hotel__c);
                }
                else{
                    System.debug('inside else if');
                    isRoomFull = false;
                    For(Booked_Date__c bookedDate : room.Booked_Dates__r){
                        System.debug('inside second For');
                        if(bookedDate.Available_Slots__c == 0){
                            System.debug('inside 2nd if');
                            isRoomFull = true;
                            break;
                        }
                        else{
                            System.debug('inside second else');
                            continue;
                        }
                    }
                    if(!isRoomFull){
                        System.debug('inside last if');
                        hotelIds.add(room.Hotel__c);
                    }
                }
            }
            if(!hotelIds.isEmpty()) {
                hotelDetailsResult = [SELECT Id,Name,City__c,State__c,Banner_Photo_Url__c,Price__c,Overall_Rating__c,Unique_Hotel_Name__c,Number_Of_Rooms__c,Rooms_With_Capacity_Of__c FROM Hotel__c ORDER BY Rating__c DESC];
                for(Hotel__c hotel : hotelDetailsResult){
                    hotelDetail hotelRecord = new hotelDetail();
                    hotelRecord.details = hotel;
                    if(hotelIds.contains(hotel.Id)){
                        hotelDetailsResultMap.put(hotel,true);
                        hotelRecord.availability = true;
                    }
                    else{
                        hotelDetailsResultMap.put(hotel,false);
                        hotelRecord.availability = false;
                    }
                    hotelList.add(hotelRecord);
                }
            }
        }
        

        return hotelList;
    }



    public class hotelDetail {
        @AuraEnabled public Hotel__c details;
        @AuraEnabled public Boolean availability;
    }
     /*
    *********************************************************
    @Method Name    : getAllHotelsWithRoomAvailibility
    @author         : Jay Patel
    @description    : method to is used for Fetching all the hotel record
    @param          : void
    @return         : List<Hotel__c>
	@date			: April 9, 2025
	@JIRA			: GT25-
    ********************************************************
	*/
    @AuraEnabled
    public static List<Product2> getAllHotelsWithRoomAvailibility(Date startDate, Date endDate) {

        List<Product2> roomDetails = [SELECT Id, Name, ProductCode, Hotel__c, Hotel__r.Overall_Rating__c, Hotel__r.Unique_Hotel_Name__c, Hotel__r.Name, Hotel__r.City__c, Hotel__r.Total_Reviews__c, Room_Type__c, Hotel_Product_Type__c, Product_Unit_Price__c, Image_URL__c, Room_Area__c, Total_Quantity__c, Max_No_Of_Guest__c, Description , (SELECT Id, Start_Date__c, End_Date__c, Booked_Slots__c, Available_Slots__c FROM Booked_Dates__r WHERE Start_Date__c >= 2025-04-11 AND End_Date__c <= 2025-04-12) FROM Product2 WHERE Hotel__c IN (SELECT Id FROM Hotel__c)];

        return roomDetails;
    }

    @AuraEnabled
    public static Map<Hotel__c,Boolean> getAllHotels() {
        Map<Hotel__c,Boolean> hotelMap = new Map<Hotel__c,Boolean>();
        List<Hotel__c> allHotels = [SELECT Id,Name,City__c,State__c,Banner_Photo_Url__c,Price__c,Overall_Rating__c,Unique_Hotel_Name__c,Number_Of_Rooms__c,Rooms_With_Capacity_Of__c FROM Hotel__c ORDER BY Rating__c DESC];
        
        for(Hotel__c hotel : allHotels){
            hotelMap.put(hotel,true);
        }
        return hotelMap;
        
    }

        /*
    *********************************************************
    @Method Name    : getRelatedHotels
    @author         : Pritkumar Prajapati
    @description    : method to is used for Fetching related hotels based on city
    @param          : String hotelName, String cityName
    @return         : List<Hotel__c>
	@date			: April 2, 2025
	@JIRA			: GT25-31
    ********************************************************
	*/

    @AuraEnabled
    public static List<Hotel__c> getRelatedHotels(String hotelName, String cityName) {

        List<Hotel__c> relatedHotelList = [SELECT Id,Name,City__c,State__c,Banner_Photo_Url__c,Price__c,Overall_Rating__c,Unique_Hotel_Name__c FROM Hotel__c WHERE City__c =:cityName AND (NOT Name =:hotelName) ORDER BY Rating__c DESC LIMIT 4];

        return relatedHotelList;
    }

    /*
    *********************************************************
    @Method Name    : getHotelWithRating
    @author         : Pritkumar Prajapati
    @description    : method to is used for Fetching Hotel with related ratings
    @param          : String hotelName
    @return         : List<HotelWrapperData>
	@date			: April 1, 2025
	@JIRA			: GT25-26
    ********************************************************
	*/

    @AuraEnabled
    public static List<HotelWrapperData> getHotelWithRating(String hotelName){
        try {
            List<HotelWrapperData> hotelWrapList = new List<HotelWrapperData>();
            Hotel__c hotelList = [SELECT Id, Name, Banner_Photo_Url__c,Activities__c, Highlights__c, Google_Map_Link__c, Activity_One_Img__c, Activity_One_Name__c, Activity_Three_Img__c, Activity_Three_Name__c, Activity_Two_Img__c, Activity_Two_Name__c, Address__c, Front_Img__c,Location__c, Includes__c, Not_Includes__c, Peripheral_Img__c, Safety_Rules__c,  Total_Reviews__c, Avg_Value_For_Money__c, Avg_Hospitality__c, Avg_Food_Quality__c, Avg_Cleanliness_And_Hygiene__c, Overall_Rating__c, City__c, State__c, Description__c, Unique_Hotel_Name__c, (SELECT Id, Avg_Rating__c, Reviewer_Name__c, CreatedDate, Review_Title__c, Description__c FROM Reviews__r) FROM Hotel__c WHERE Unique_Hotel_Name__c = :hotelName];

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

     /*
    *********************************************************
    @Method Name    : getRatingHotelCards
    @author         : Jay Patel
    @description    : method to is used for Fetching hotels of top rating
    @param          : void
    @return         : List<Hotel__c>
	@date			: March 28, 2025
	@JIRA			: GT25-32
    ********************************************************
	*/
    @AuraEnabled
    public static List<Hotel__c> getRatingHotelCards() {

        List<Hotel__c> hoteldetails = [SELECT Id,Name,City__c,State__c,Banner_Photo_Url__c,Price__c,Overall_Rating__c,Unique_Hotel_Name__c FROM Hotel__c ORDER BY Rating__c DESC LIMIT 4];

        return hoteldetails;
    }

    /*
    *********************************************************
    @Method Name    : getHotelRooms
    @author         : Pritkumar Prajapati
    @description    : method to is used for fetching rooms according to hotelname
    @param          : hotelname
    @return         : List<Product2>
	@date			: April 4, 2025
	@JIRA			: GT25-32
    ********************************************************
	*/

    @AuraEnabled
    public static List<Product2> getHotelRooms(String hotelName,Date startDate, Date endDate) {

        List<Product2> roomDetails = [SELECT Id, Name, ProductCode, Hotel__c, Hotel__r.Overall_Rating__c, Hotel__r.Unique_Hotel_Name__c, Hotel__r.Name, Hotel__r.City__c, Hotel__r.Total_Reviews__c, Room_Type__c, Hotel_Product_Type__c, Product_Unit_Price__c, Image_URL__c, Room_Area__c, Total_Quantity__c, Max_No_Of_Guest__c, Description , (SELECT Id, Start_Date__c, End_Date__c, Booked_Slots__c, Available_Slots__c FROM Booked_Dates__r WHERE Start_Date__c >=:startDate AND End_Date__c <=:endDate) FROM Product2 WHERE Hotel__r.Unique_Hotel_Name__c =: hotelName];

        return roomDetails;
    }

    /*
    *********************************************************
    @Method Name    : getHotelRooms
    @author         : Pritkumar Prajapati
    @description    : method to is used for fetching rooms according to hotelname
    @param          : hotelname
    @return         : List<Product2>
	@date			: April 4, 2025
	@JIRA			: GT25-32
    ********************************************************
	*/

    
}