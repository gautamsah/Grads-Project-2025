/*
*********************************************************
Apex Class Name    : RES_Utility_Test
Created Date       : March 28, 2025
@description       : This Test Class For RES_Utility 
@author            : Jay patel
@date			   : March 28, 2025
@JIRA			   : GT25-32
Modification Log:
Ver   Date         Author                               Modification
1.0   28-03-2025   Jay Patel                           Initial Version
*********************************************************
*/
@isTest
public class RES_Utility_Test {
     /*
    *********************************************************
    @Method Name    : testFeature
    @author         : Jay Patel
    @description    : method to is used for creating record of hotels with enabled featured checkbox
    @param          : void
    @return         : Void
	@date			: March 28, 2025
	@JIRA			: GT25-32
    ********************************************************
	*/
	@isTest
    public static void testFeature(){
        List<Hotel__c> testresultList1 = new List<Hotel__c>();
        for(Integer i = 0;i < 4;i++){
            Hotel__c h1 = new Hotel__c();
            h1.Name = 'H'+i;
            h1.Featured__c = true;
            testresultList1.add(h1);
        }
       
		insert testresultList1;        
        Test.StartTest();
        List<Hotel__c> hotelList1 = RES_Utility.getFeatureHotelCards();
        Test.StopTest();
        
        System.assertEquals(testresultList1.size(),hotelList1.size());
		        
    }
    
     /*
    *********************************************************
    @Method Name    : testFeature
    @author         : Jay Patel
    @description    : method to is used for creating record of hotels.
    @param          : void
    @return         : Void
	@date			: March 28, 2025
	@JIRA			: GT25-32
    ********************************************************
	*/
    @isTest
    public static void testRating(){
        List<Hotel__c> testresultList2 = new List<Hotel__c>();
        for(Integer i = 0;i < 4;i++){
            Hotel__c h1 = new Hotel__c();
            h1.Name = 'H'+i;
            testresultList2.add(h1);
        }
       
		insert testresultList2;        
        Test.StartTest();
        List<Hotel__c> hotelList2 = RES_Utility.getRatingHotelCards();
        Test.StopTest();
        
        System.assertEquals(testresultList2.size(),hotelList2.size());
		        
    }

}