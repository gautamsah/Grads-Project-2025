/*
*********************************************************
Apex Class Name    : RESSignUpControllerTest
Created Date       : March 19, 2025
@description       : This is the Test class of RESSignUpController
@author            : Milin Kapatel
@date			   : March 19, 2025
@JIRA			   : GT25-4
Revision Log:
Ver   Date         Author                               Modification
1.0   18-03-2025   Milin Kapatel                      Initial Version
*********************************************************
*/
@isTest
public class RESSignUpControllerTest {
    
    /*
    *********************************************************
    @Method Name    : setup
    @author         : Milin Kapatel
    @description    : method to is used for Creating test data for the test class and using it in test methods
    @param          : void
    @return         : void
	@date			: March 19, 2025
	@JIRA			: GT25-4
    ********************************************************
	*/
    @testSetup
    static void setup(){
        Id personAccountRecordTypeId =  Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('PersonAccount').getRecordTypeId();
        Account acc = new Account(FirstName = 'Test', LastName = 'Name', PersonEmail = 'testAcc@gmail.com', Phone = '974932', RecordTypeId = personAccountRecordTypeId);
        insert acc;
        
        Account acctest = new Account(FirstName = 'Test1', LastName = 'Name1', PersonEmail = 'testAcc2@gmail.com', Phone = '974932', RecordTypeId = personAccountRecordTypeId);
        insert acctest;
        Account acc1 = [select Id, PersonContactId from Account where PersonEmail = :acctest.PersonEmail limit 1];
        String profileId = [select Id from Profile where name = 'Community User RES'].Id;
        User u = new User(FirstName = 'test' , LastName = 'user', Alias = 'tuser', Email = 'testUser@gmail.com', EmailEncodingKey = 'UTF-8', 	LanguageLocaleKey = 'en_US', 	LocaleSidKey = 'en_US' , ProfileId = profileId, TimeZoneSidKey = 'Asia/Kolkata', UserName = 'testUser@gmail.com.test', ContactId = acc1.PersonContactId); //time zone India
        insert u;
    }
    
    /*
    *********************************************************
    @Method Name    : testRESSignUpFunctionality_withAccWithoutUser
    @author         : Milin Kapatel
    @description    : method to is used for checking the case, when Account already exist and User is not Created for that Account
    @param          : void
    @return         : void
	@date			: March 19, 2025
	@JIRA			: GT25-4
    ********************************************************
	*/    
    @isTest
    private static void testRESSignUpFunctionality_withAccWithoutUser() {
        String actualError;
        String expectedError = 'Account already exists';
        Test.startTest();
        try {
            RESSignUpController.createSiteUser('', 'sah', 'testAcc@gmail.com', '785651254');
        } catch (Exception e) {
            actualError = e.getMessage();
        }
        Test.stopTest();

        System.assertEquals(expectedError, actualError);
    }
    
    /*
    *********************************************************
    @Method Name    : testRESSignUpFunctionality_withUserWithoutAcc
    @author         : Milin Kapatel
    @description    : method to is used for checking the case, when User already exist and Account is not existing for that User 
    @param          : void
    @return         : void
	@date			: March 19, 2025
	@JIRA			: GT25-4
    ********************************************************
	*/
    @isTest
    private static void testRESSignUpFunctionality_withUserWithoutAcc() {
        String actualError;
        String expectedError = 'User was not created successfully due to following reason :  error msg : User already exists';
        Test.startTest();
        try {
            RESSignUpController.createSiteUser('', 'sah', 'testUser@gmail.com', '785651254');
        } catch (Exception e) {
            actualError = e.getMessage();
        }
        Test.stopTest();

        System.assertEquals(expectedError, actualError);
    }
    
    /*
    *********************************************************
    @Method Name    : testRESSignUpFunctionality_withoutFirstNameTest
    @author         : Milin Kapatel
    @description    : method to is used for checking the case, when there is no first name in the input data
    @param          : void
    @return         : void
	@date			: March 19, 2025
	@JIRA			: GT25-4
    ********************************************************
	*/
    @isTest
    private static void testRESSignUpFunctionality_withoutFirstNameTest() {
        String actualError;
        String expectedError = null;
        Test.startTest();
        try {
            RESSignUpController.createSiteUser('', 'sah', 'gsah2@horizontal.com', '785651254');
        } catch (Exception e) {
            actualError = e.getMessage();
        }
        Test.stopTest();
		User u = [select id from User where Email = 'gsah2@horizontal.com' limit 1];
        PermissionSetAssignment psa = [select AssigneeId, PermissionSetId from PermissionSetAssignment where AssigneeId = :u.Id limit 1];
        PermissionSet ps = [select id,Name from PermissionSet where id = :psa.PermissionSetId];
        System.debug('ps name : ' + ps.name);
        System.assertEquals(expectedError, actualError);
    }
    
    /*
    *********************************************************
    @Method Name    : testRESSignUpFunctionality_withoutLastNameTest
    @author         : Milin Kapatel
    @description    : method to is used for checking the case, when there is no last name in the input data
    @param          : void
    @return         : void
	@date			: March 19, 2025
	@JIRA			: GT25-4
    ********************************************************
	*/
    @isTest
    private static void testRESSignUpFunctionality_withoutLastNameTest() {
        String actualError;
        String expectedError = 'Insert failed. First exception on row 0; first error: REQUIRED_FIELD_MISSING, Required fields are missing: [LastName]: [LastName]';
        Test.startTest();
        try {
            RESSignUpController.createSiteUser('gsah', '', 'gsah2@horizontal.com', '785651254');
        } catch (Exception e) {
            actualError = e.getMessage();
        }
        Test.stopTest();
        
        System.assertEquals(expectedError, actualError);
    }
    
    /*
    *********************************************************
    @Method Name    : testRESSignUpFunctionality_sameEmail
    @author         : Milin Kapatel
    @description    : method to is used for checking the case, when there an Account or email same as the input email
    @param          : void
    @return         : void
	@date			: March 19, 2025
	@JIRA			: GT25-4
    ********************************************************
	*/
    @isTest
    private static void testRESSignUpFunctionality_sameEmail() {
        String actualError;
        String expectedError = 'Account already exists';
        Test.startTest();
        try {
            RESSignUpController.createSiteUser('', 'sah', 'gsah2@horizontal.com', '785651254');
        } catch (Exception e) {
            actualError = e.getMessage();
        }
        try {
            RESSignUpController.createSiteUser('', 'sah', 'gsah2@horizontal.com', '785651254');
        } catch (Exception e) {
            actualError = e.getMessage();
        }
        Test.stopTest();
        System.assertEquals(expectedError, actualError);
    }
}