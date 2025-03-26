/*
*********************************************************
Apex Class Name    : CommunityLoginControllerTest
Created Date       : March 20, 2025
@description       : This is the Test class of CommunityLoginController
@author            : Jay Patel
@date			   : March 20, 2025
@JIRA			   : GT25-3
Revision Log:
Ver   Date         Author                               Modification
1.0   18-03-2025   Jay Patel                           Initial Version
*********************************************************
*/
@isTest
public class CommunityLoginControllerTest {
     /*
    *********************************************************
    @Method Name    : testLogin
    @author         : Jay Patel
    @description    : This method will test the Login Functionality
    @param          : void
    @return         : void
	@date			: March 20, 2025
	@JIRA			: GT25-3
    ********************************************************
	*/
    @isTest
    public static void testLogin(){
        String actualError;
        String expectedError = 'Login Successfully';
        Test.startTest();
        try{
             actualError = CommunityLoginController.login('kapatelmilinh@gmail.com.communityuser', 'Jay@326#','');
        }catch(Exception e){
             actualError = e.getMessage();
        }
        
        Test.stopTest();
        System.assertEquals(actualError, expectedError);
       
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
    @isTest
    public static void testForgotPassword(){
        
        Boolean actualError;
        Boolean expectedError = false;
        Test.startTest();
        try{
           actualError = CommunityLoginController.forgotPassword('kapatelmilinh@gmail.com.communityuser');
        }catch(Exception e){
              e.getMessage();
        }
        
        Test.stopTest();
        System.assertEquals(actualError, expectedError);
       
    }
    


    
}