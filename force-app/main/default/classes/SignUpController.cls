/*
*********************************************************
Apex Class Name    : SignUpController
Created Date       : March 18, 2025
@description       : This class is used for controlling Signup functionality in experience cloud
@author            : Milin Kapatel
@date			   : March 18, 2025
@JIRA			   : GT25-4
Modification Log:
Ver   Date         Author                               Modification
1.0   18-03-2025   Milin Kapatel                      Initial Version
2.0   18-03-2025   Milin Kapatel                      added try...catch blocks, changed timezone in createUser(), and checked for email duplication error for registration
*********************************************************
*/
public without sharing class SignUpController {
    /*
    *********************************************************
    @Class Name     : SignUpException
    @author         : Milin Kapatel
    @description    : Class is used for Creatin custom Error that can contain String in it
	@date			: March 18, 2025
	@JIRA			: GT25-4
    ********************************************************
	*/
    public class SignUpException extends Exception {}
    
    /*
    *********************************************************
    @Method Name    : createSiteUser
    @author         : Milin Kapatel
    @description    : method to is used for Creating A Person Account And a User of Profile Community User
    @param          : String firstName, String lastname, String email, String phone
    @return         : void
	@date			: March 18, 2025
	@JIRA			: GT25-4
    ********************************************************
	*/
	@AuraEnabled(cacheable = false)
    public static void createSiteUser(String firstName, String lastName, String email, String phone){
        //roll back...... Database.save
        try{
            System.debug('createSiteUser 1st try');
            Boolean isAccountCreated = false;
            Account accAfterInsert;
            try {
                System.debug('createSiteUser 2nd try');
                createPersonAccount(firstName, lastName, email, phone);
                isAccountCreated = true;
            } catch (Exception e) {
                System.debug('createSiteUser 1st catch');
                throw e;
            }
            if(isAccountCreated){
                try {
                    System.debug('createSiteUser 3rd try');
                    accAfterInsert = [select Id,PersonEmail,FirstName, LastName, PersonContactId from Account where PersonEmail = :email limit 1];
                    System.debug('Created Account Id : ' + accAfterInsert.Id);
                } catch (DMLException e) {
                    System.debug('createSiteUser 2nd catch');
                    throw e;
                }
            }
            if(accAfterInsert != null){
                try {
                    System.debug('createSiteUser 4th try');
                    createUser(accAfterInsert);
                } catch (Exception e) {
                    
                    System.debug('createSiteUser 3rd catch');
                    throw new SignUpException('User was not created successfully! please try again , acc Id : ' + accAfterInsert.Id + ' error msg : ' + e.getMessage() );
                }
            }
        }
        catch(Exception e){
            System.debug('createSiteUser 4th catch');
            throw new SignUpException(e.getMessage());
        }
    }
    
    
    /*
    *********************************************************
    @Method Name    : createPersonAccount
    @author         : Milin Kapatel
    @description    : method to is used for Creating A Person Account
    @param          : String firstName, String lastname, String email, String phone
    @return         : void
	@date			: March 18, 2025
	@JIRA			: GT25-4
    ********************************************************
	*/
    private static void createPersonAccount(String firstName, String lastName, String email, String phone){
        Id personAccountRecordTypeId =  Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('PersonAccount').getRecordTypeId();
        try {
            System.debug('createPersonAccount 1st try');
            Integer cnt = [select count() from Account where PersonEmail = :email];
            if(cnt == 0){
                Account  acc = new Account(FirstName = firstName, LastName = lastName, PersonEmail = email, Phone = phone);
                acc.RecordTypeId = personAccountRecordTypeId;
                
                try {
                    System.debug('createPersonAccount 2nd try');
                    insert as system acc; // insert try catch here........    
                }
                catch(DMLException e){
                    System.debug('createPersonAccount 1st catch');
                    throw e;
                }
            }
            else {
                throw new SignUpException('Account already exists');
            }
        }
        catch (Exception e) {
            System.debug('createPersonAccount 2nd catch');
            throw e;
        }
        
    }
    /*
    *********************************************************
    @Method Name    : createUser
    @author         : Milin Kapatel
    @description    : method to is used for Creating A User of Profile Community User
    @param          : Account accAfterInsert
    @return         : void
	@date			: March 18, 2025
	@JIRA			: GT25-4
    ********************************************************
	*/
    private static void createUser(Account accAfterInsert){
        String al = accAfterInsert.FirstName.left(1) + accAfterInsert.LastName.left(4) + String.valueOf(Integer.valueOf(Math.random() * 1000)); //check last name check length case
        String userName = accAfterInsert.PersonEmail + '.communityUser';
        try{
            System.debug('createUser 1st try');
            Profile p = [select Id from Profile where name = 'Community User'];
            User u = new User(FirstName = accAfterInsert.FirstName, LastName = accAfterInsert.LastName, Alias = al, Email = accAfterInsert.PersonEmail, EmailEncodingKey = 'UTF-8', 	LanguageLocaleKey = 'en_US', 	LocaleSidKey = 'en_US' , ProfileId = p.Id, TimeZoneSidKey = 'Asia/Kolkata', UserName = userName); //time zone India
            u.ContactId = accAfterInsert.PersonContactId;
            try {
                System.debug('createUser 2nd try');
                insert as system u;
            } catch (Exception e) {
                System.debug('createUser 1st catch');
                throw e;
            }
        }
        catch(DMLEXception e){
            System.debug('createUser 2nd catch');
            throw e;    
        }
        
    }
}