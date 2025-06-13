/*
*********************************************************
Apex Class Name    : RESLoginController
Created Date       : March 18, 2025
@description       : This class is used for controlling Login functionality in experience cloud
@author            : Jay patel
@date			   : March 19, 2025
@JIRA			   : GT25-3
Modification Log:
Ver   Date         Author                               Modification
1.0   19-03-2025   Jay Patel                           Initial Version
2.0   20-03-2025   Jay Patel                           Adding Forgot Password Functionality
*********************************************************
*/
public with sharing class RESLoginController {
   
    /*
    *********************************************************
    @Method Name    : login
    @author         : Jay Patel
    @description    : method to is used for Login In salesforce Enviroment
    @param          : String username, String password, String startUrl
    @return         : String
	@date			: March 19, 2025
	@JIRA			: GT25-3
    ********************************************************
	*/
    @AuraEnabled
    public static String login(String username, String password, String startUrl) {
        try {
            ApexPages.PageReference lgn = Site.login(username, password, startUrl);          
            if (lgn != null) {

                System.debug('[Apex] Login successful! Redirecting to: ' + lgn.getUrl());

                return lgn.getUrl();

            }

            

            return 'Invalid login credentials. Please check your username and password.';

        } catch (Exception ex) {

            System.debug('[Apex] Login failed: ' + ex.getMessage());

            return 'An error occurred during login: ' + ex.getMessage();
        }
    }
}