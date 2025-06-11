@isTest
public class RESFeaturedHotelTest {
	@isTest
    public static void testFeature(){
        List<Hotel__c> testresultList = new List<Hotel__c>();
        for(Integer i = 0;i < 4;i++){
            Hotel__c h1 = new Hotel__c();
            h1.Name = 'H'+i;
            // h1.Feature__c = true;
            testresultList.add(h1);
        }
       
		insert testresultList;        
        Test.StartTest();
        List<Hotel__c> hotelList = RESFeaturedHotel.getHotelDetails();
        Test.StopTest();
        
        System.assertEquals(testresultList.size(),hotelList.size());
		        
    }
}