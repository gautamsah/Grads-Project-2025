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
1.0   18-03-2025   Jay Patel                           Initial Version
*********************************************************
*/
@isTest
public class RESLoginControllerTest {
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
        String expectedError = 'Login';
        Test.startTest();
        try {
            RESLoginController.login('kapatelmilinh@gmail.com.communityuser', 'Abcd@1234', 'https://respira-dev.my.site.com/respira');
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
     @isTest
    private static void testForgotPassword() {
        Boolean actualError;
        Boolean expectedError = false;
        Test.startTest();
        try {
            actualError = RESLoginController.forgotPassword('kapatelmilinh@gmail.com.communityuser');
        } catch (Exception e) {
            e.getMessage();
        }
        Test.stopTest();
        System.assertEquals(expectedError, actualError);
    }
}