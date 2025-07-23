/*
*********************************************************
Apex Class Name    : RESLoginControllerTest
Created Date       : March 20, 2025
@description       : This is the Test class of CommunityLoginController
@author            : Jay Patel
@date			   : March 20, 2025
@JIRA			   : GT25-3
Revision Log:
Ver   Date         Author                               Modification
1.0   20-03-2025   Jay Patel                           Initial Version
*********************************************************
*/

@isTest
public class RESLoginControllerTest {
    /*
    *********************************************************
    @Class Name     : RESSignUpException
    @author         : Jay Patel
    @description    : Class is used for Creatin custom Error that can contain String in it
	@date			: March 20, 2025
	@JIRA			: GT25-3
    ********************************************************
	*/
    
    public class RESSignUpException extends Exception {}
    
    /*
    *********************************************************
    @Method Name    : setup
    @author         : Jay Patel
    @description    : method to is used for Creating test data for the test class and using it in test methods
    @param          : void
    @return         : void
	@date			: March 20, 2025
	@JIRA			: GT25-3
    ********************************************************
	*/
    @testSetup
	static void setup(){
    	createPersonAccount('Milin','Kapatel','milinkapatel007@something.com','58403584');
        Account acc = [select Id,PersonEmail,FirstName, LastName, PersonContactId from Account where PersonEmail = 'milinkapatel007@something.com' limit 1];
        createUser(acc);
        System.debug(acc);
        User u = [select Id,Username from User where Email = 'milinkapatel007@something.com'];
        System.setPassword(u.Id, 'Abcd@1234');
        System.debug(u);
        
	}
    
     /*
    *********************************************************
    @Method Name    : createPersonAccount
    @author         : Jay Patel
    @description    : method to is used for Creating A Person Account
    @param          : String firstName, String lastname, String email, String phone
    @return         : void
	@date			: March 20, 2025
	@JIRA			: GT25-3
    ********************************************************
	*/
     private static Boolean createPersonAccount(String firstName, String lastName, String email, String phone){
        Id personAccountRecordTypeId =  Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('PersonAccount').getRecordTypeId();
        Boolean isAccountCreated = true;
        try {
            Integer cnt = [select count() from Account where PersonEmail = :email];
            if(cnt == 0){
                Account  acc = new Account(FirstName = firstName, LastName = lastName, PersonEmail = email, Phone = phone, RecordTypeId = personAccountRecordTypeId);
                
                try {
                    insert acc;   
                }
                catch(DMLException e){
                    isAccountCreated = false;
                    throw e;
                }
            }
            else {
                isAccountCreated = false;
                throw new RESSignUpException('Account already exists');
            }
        }
        catch (Exception e) {
            isAccountCreated = false;
            throw e;
        }
        return isAccountCreated;
    }
    
    
    /*
    *********************************************************
    @Method Name    : createUser
    @author         : Jay Patel
    @description    : method to is used for Creating A User of Profile Community User
    @param          : Account accAfterInsert
    @return         : void
	@date			: March 20, 2025
	@JIRA			: GT25-3
    ********************************************************
	*/
     private static void createUser(Account accAfterInsert){
        Integer cnt = [select count() from User where Email = :accAfterInsert.PersonEmail];
        if(cnt == 0){
        	String al = ( accAfterInsert.FirstName == '' ? accAfterInsert.FirstName.left(1) : '') + accAfterInsert.LastName.left(4) + String.valueOf(Integer.valueOf(Math.random() * 1000)); //check last name check length case
	        String userName = accAfterInsert.PersonEmail + RESConstantUtil.userNamePostFix;
        	String profileName = RESConstantUtil.communityUserProfileName;
        	try{
            	String profileId = [select Id from Profile where name = :profileName].Id;
            
            	if(profileId != null){
            		User u = new User(FirstName = accAfterInsert.FirstName, LastName = accAfterInsert.LastName, Alias = al, Email = accAfterInsert.PersonEmail, EmailEncodingKey = 'UTF-8', 	LanguageLocaleKey = 'en_US', 	LocaleSidKey = 'en_US' , ProfileId = profileId, TimeZoneSidKey = 'Asia/Kolkata', UserName = userName, ContactId = accAfterInsert.PersonContactId); //time zone India
                
                	insert u;
            	
            	}

            
        	}
        	catch(DMLEXception e){
            	throw e;    
        	}
    	}
        else{
            throw new RESSignUpException('User already exists');
        }
    }
	 /*
    *********************************************************
    @Method Name    : testLoginUser
    @author         : Jay Patel
    @description    : This method will test the Login Functionality
    @param          : void
    @return         : void
	@date			: March 20, 2025
	@JIRA			: GT25-3
    ********************************************************
	*/
     @isTest
    private static void testLoginUser() {
        String actualError;
        String expectedError = 'https://respira-dev.my.site.com/respira';
        User u = [select Id,Username from User where Email = 'milinkapatel007@something.com'];
        Test.startTest();
        try {
            RESLoginController.login(u.Username, 'Abcd@1234', '');
        } catch (Exception e) {
            actualError = e.getMessage();
        }
        Test.stopTest();
        System.assertEquals(expectedError, actualError);
    }
     /*
    *********************************************************
    @Method Name    : testForgotPassword
    @author         : Jay Patel
    @description    : This method will test the Forgot Password Functionality
    @param          : void
    @return         : void
	@date			: March 20, 2025
	@JIRA			: GT25-3
    ********************************************************
	*/
    //  @isTest
    // private static void testForgotPassword() {
    //     Boolean actualError;
    //     Boolean expectedError = false;
    //     User u = [select Id,Username from User where Email = 'milinkapatel007@something.com'];

    //     Test.startTest();
    //     try {
    //         actualError = RESLoginController.forgotPassword(u.Username);
    //     } catch (Exception e) {
    //         e.getMessage();
    //     }
    //     Test.stopTest();
    //     System.assertEquals(expectedError, actualError);
    // }
}