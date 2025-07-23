/*
*********************************************************
Apex Class Name    : RESSignUpController
Created Date       : March 18, 2025
@description       : This class is used for controlling Signup functionality in experience cloud
@Testclass		   : Test the edge cases like firstName is Empty, lastName is Empty, same Email
@author            : Milin Kapatel
@date			   : March 18, 2025
@JIRA			   : GT25-4
Revision Log:
Ver   Date         Author                               Modification
1.0   18-03-2025   Milin Kapatel                      Initial Version
*********************************************************
*/
public without sharing class RESSignUpController {
    /*
    *********************************************************
    @Class Name     : RESSignUpException
    @author         : Milin Kapatel
    @description    : Class is used for Creatin custom Error that can contain String in it
	@date			: March 18, 2025
	@JIRA			: GT25-4
    ********************************************************
	*/
    public class RESSignUpException extends Exception {}


    
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
        
        Savepoint sp = Database.setSavepoint();
        try{
            Boolean isAccountCreated;
            Boolean isCommunityUser;
            Boolean isPersonAccount;
            Account accAfterInsert;
            isAccountCreated = createPersonAccount(firstName, lastName, email, phone);
            
            if(isAccountCreated){
                accAfterInsert = [select Id,PersonEmail,FirstName, LastName, PersonContactId from Account where PersonEmail = :email limit 1];
            }
            if(accAfterInsert != null){
                try {
                    createUser(accAfterInsert);
                } catch (Exception e) {
                    throw new RESSignUpException('User was not created successfully due to following reason : ' + ' error msg : ' + e.getMessage() );
                }
            }
        }
        catch(Exception e){
            Database.rollback(sp);
            Database.releaseSavepoint(sp);
            throw new RESSignUpException(e.getMessage());
        }
    }

    /*
    *********************************************************
    @Method Name    : getQuotes
    @author         : Pritkumar Prajapati
    @description    : This method is used to get the quotes list.
    @param          : none
    @return         : List<SObject>
	@date			: March 25, 2025
	@JIRA			: GT25-4
    ********************************************************
	*/

    @AuraEnabled(cacheable = false)
    public static List<SObject> getQuotes(){
        List<SObject> quoteList = [SELECT Id, Type__c, Offer_Img_Url__c, Quote_Person_Name__c, Quote_Person_Img_Url__c, Quote_Description__c FROM Offer_Or_Quote__c WHERE 	Type__c = 'Quote'  LIMIT 6];
        try {
            return quoteList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
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
    private static Boolean createPersonAccount(String firstName, String lastName, String email, String phone){
        Id personAccountRecordTypeId =  Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('PersonAccount').getRecordTypeId();
        Boolean isAccountCreated = true;
        try {
            Integer cnt = [select count() from Account where PersonEmail = :email];
            if(cnt == 0){
                Account  acc = new Account(FirstName = firstName, LastName = lastName, PersonEmail = email, Phone = phone, RecordTypeId = personAccountRecordTypeId,isCommunityUser__c=true);
                
                try {
                    insert acc;   
                }
                catch(DMLException e){
                    isAccountCreated = false;
                    throw e;
                }
            }
            else {
                List<Account> acc = [select Id,isCommunityUser__c,PersonEmail from Account where PersonEmail = :email limit 1];
                if(acc[0].isCommunityUser__c == false){
                    acc[0].OwnerId = '005Hr00000IRd7pIAD';
                    acc[0].isCommunityUser__c = true;
                    acc[0].FirstName = firstName;
                    acc[0].LastName = lastName;
                    acc[0].Phone = phone;
                    update acc;
                    isAccountCreated = true;
                }
                else {
                    isAccountCreated = false;
                    throw new RESSignUpException('Account already exists');
                }
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
    @author         : Milin Kapatel
    @description    : method to is used for Creating A User of Profile Community User
    @param          : Account accAfterInsert
    @return         : void
	@date			: March 18, 2025
	@JIRA			: GT25-4
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
}