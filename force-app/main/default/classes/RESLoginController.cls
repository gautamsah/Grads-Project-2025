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
            PageReference loginPage = Site.login(username, password, startUrl);
            if (loginPage != null) {
                return 'https://respira-dev.my.site.com/respira';
            } else {
                throw new AuraHandledException('Invalid credentials');
            }
        } catch (Exception e) {
            throw new AuraHandledException('Error during login: ' + e.getMessage());
        }
    }
	 /*
    *********************************************************
    @Method Name    : forgotPassword
    @author         : Jay Patel
    @description    : method to is used for Forgot Password in salesforce Enviroment
    @param          : String username
    @return         : Boolean
	@date			: March 20, 2025
	@JIRA			: GT25-3
    ********************************************************
	*/
    @AuraEnabled
    public static Boolean forgotPassword(String username) {
        try {
            return Site.forgotPassword(username);
        }catch(Exception e){
            throw new AuraHandledException('Error on forgot password: ' + e.getMessage());
        }
    }
}