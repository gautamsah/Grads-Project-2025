public without sharing class RESBanquetController {
    /*
    *********************************************************
    @Method Name    : getAllBanquetsAndConferenceDetails
    @author         : Milin Kapatel
    @description    : method to is used for fetching all banquets and conference details
    @param          : Date startDate, Date endDate
    @return         : List<Product2>
	@date			: April 25, 2025
	@JIRA			: 
    ********************************************************
	*/

    @AuraEnabled
    public static List<Product2> getAllBanquetsAndConferenceDetails(Date startDate, Date endDate) {
        try{

            List<Product2> banqAndConfDetails = [SELECT Id, Name, ProductCode, Hotel__c, Hotel__r.Overall_Rating__c, Hotel__r.Unique_Hotel_Name__c, Hotel__r.Name, Hotel__r.City__c, Hotel__r.Total_Reviews__c, Room_Type__c, Hotel_Product_Type__c, Product_Unit_Price__c, Image_URL__c, Room_Area__c, Total_Quantity__c, Max_No_Of_Guest__c, Description , (SELECT Id, Start_Date__c, End_Date__c, Booked_Slots__c, Available_Slots__c FROM Booked_Dates__r WHERE Start_Date__c >=:startDate AND End_Date__c <=:endDate) FROM Product2 WHERE Hotel_Product_Type__c = 'Banquet Hall' OR Hotel_Product_Type__c = 'Conference Room'];
            
            return banqAndConfDetails;
        }
        catch(Exception e){
            System.debug('Error in getAllBanquetsAndConferenceDetails: ' + e.getMessage());
            throw new AuraHandledException('Error fetching banquet and conference details ' + e.getMessage());
        }
    }
}