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
2.0   01-04-2025   Pritkumar Prajapati                 Added testHotelWithRating method
3.0   02-04-2025   Pritkumar Prajapati                 Added testGetRelatedHotels method
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

    /*
    *********************************************************
    @Method Name    : testWrapperData
    @author         : Pritkumar Prajapati
    @description    : method is used to test the functionality of method getHotelWithRating
    @param          : void
    @return         : Void
	@date			: April 1, 2025
	@JIRA			: GT25-26
    ********************************************************
	*/

    @isTest
    private static void testHotelWithRating(){
        Hotel__c testHotel = new Hotel__c(
            Name = 'TestHotel',
            Unique_Hotel_Name__c = 'TestHotelUnique'
        );
        insert testHotel;

        Account acc = new Account(
            LastName = 'TestAcc'
        );
        insert acc;

        List<Review__c> reviewList = new List<Review__c>();
        for(Integer i = 0; i < 3; i++){
            Review__c testReview = new Review__c();
            testReview.Hotel__c = testHotel.Id;
            testReview.Account__c = acc.Id;
            testReview.Cleanliness_And_Hygiene__c = 5;
            testReview.Food_Quality__c = 5;
            testReview.Hospitality__c = 5;
            testReview.Value_For_Money__c = 5;
            reviewList.add(testReview);
        }

        if(!reviewList.isEmpty()){
            insert reviewList;
        }

        Test.startTest();
        List<RES_Utility.HotelWrapperData> result = RES_Utility.getHotelWithRating('TestHotelUnique');
        Test.stopTest();

        System.assertEquals(3, result[0].ratingList.size());
    }

    /*
    *********************************************************
    @Method Name    : testGetRelatedHotels
    @author         : Pritkumar Prajapati
    @description    : method is used to test the functionality of method getRelatedHotels
    @param          : void
    @return         : Void
	@date			: April 2, 2025
	@JIRA			: GT25-31
    ********************************************************
	*/

    @isTest
    private static void testGetRelatedHotels(){
        List<Hotel__c> testresultList = new List<Hotel__c>();
        for(Integer i = 0;i < 4;i++){
            Hotel__c h1 = new Hotel__c();
            h1.Name = 'H'+i;
            h1.City__c = 'testCity';
            testresultList.add(h1);
        }
        if(!testresultList.isEmpty()){
            insert testresultList;
        }

        test.StartTest();
        List<Hotel__c> relatedHotels = RES_Utility.getRelatedHotels('H1','testCity');
        test.StopTest();

        System.assertEquals(3, relatedHotels.size());
    }
}