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
*********************************************************
*/
public with sharing class RES_Utility {

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
}