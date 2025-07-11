/*
*********************************************************
Apex Class Name    : RES_OTP_Service
Created Date       : April 14, 2025
@description       : This class is used for generating and verifying OTP.
@author            : Pritkumar Prajapati
@date			   : April 14, 2025
@JIRA			   : 
Modification Log:
Ver   Date         Author                               Modification
1.0   14-04-2025   Pritkumar Prajapati                 Initial Version
*********************************************************
*/

public without sharing class RES_OTP_Service {

    private static final Integer OTP_LENGTH = 6;
    private static final Integer OTP_EXPIRATION_MINUTES = 2;
    private static final Integer MAX_VERIFICATION_ATTEMPTS = 3;

    /*
    *********************************************************
    @Method Name    : generateOTP
    @author         : Pritkumar Prajapati
    @description    : method to is used to generate the OTP and sen it to the provided email.
    @param          : String emailAddress
    @return         : void
	@date			: April 14, 2025
	@JIRA			: 
    ********************************************************
	*/

    @AuraEnabled
    public static void generateOTP(String emailAddress) {
        String plainOTP = generateRandomOTP(OTP_LENGTH);
        String hashedOTP = generateHashedOTP(plainOTP);

        Id currentUserId = UserInfo.getUserId();
        OTP__c otp = OTP__c.getInstance(currentUserId);
        if (otp == null) {
            otp = new OTP__c(Name = String.valueOf(currentUserId));
        }
        otp.OTP_Code__c = hashedOTP;
        otp.Expiration_Time__c = System.now().addMinutes(OTP_EXPIRATION_MINUTES);
        otp.No_of_Trials__c = 0;
        otp.Is_Expired__c = 'false';

        try {
            if (otp.Id == null) {
                insert otp;
            } else {
                update otp;
                system.debug('OTP result: '+ otp);
            }
            sendOTP(emailAddress, plainOTP);
        } catch (DmlException e) {
            System.debug('Error inserting/updating OTP Custom Setting: ' + e.getMessage());
        }
    }

    /*
    *********************************************************
    @Method Name    : verifyOTP
    @author         : Pritkumar Prajapati
    @description    : method to is used to verify the OTP and return the result.
    @param          : String enteredOTP
    @return         : Boolean
	@date			: April 14, 2025
	@JIRA			: 
    ********************************************************
	*/

    @AuraEnabled
    public static Boolean verifyOTP(String enteredOTP) {
        Id currentUserId = UserInfo.getUserId();
        OTP__c otp = OTP__c.getInstance(currentUserId);

        if (otp == null || otp.Is_Expired__c == 'true') {
            System.debug('OTP check');
            throw new AuraHandledException('No OTP found, request a new one.');
        }

        if (otp.Expiration_Time__c < System.now()) {
            otp.Is_Expired__c = 'true';
            System.debug('Expiration check');
            update otp;
            system.debug('OTP result: '+ otp);
            throw new AuraHandledException('The OTP has expired. Please request a new one.');
        }

        if (otp.No_of_Trials__c >= MAX_VERIFICATION_ATTEMPTS) {
            otp.Is_Expired__c = 'true';
            System.debug('Trial check');
            update otp;
            system.debug('OTP result: '+ otp);
            throw new AuraHandledException('Too many incorrect attempts. Please request a new OTP.');
        }

        String hashedEnteredOTP = generateHashedOTP(enteredOTP);

        System.debug('Hash value: ' + hashedEnteredOTP);

        if (hashedEnteredOTP.equals(otp.OTP_Code__c)) {
            System.debug('Correction check');
            otp.No_of_Trials__c = 0;
            otp.Is_Expired__c = 'true';
            update otp;
            system.debug('OTP result: '+ otp);
            return true;
        } else {
            otp.No_of_Trials__c = otp.No_of_Trials__c+ 1;
            System.debug('Increasing count');
            update otp;
            system.debug('OTP result: '+ otp);
            throw new AuraHandledException('Incorrect OTP. Please try again.');
            //return false;
        }
    }

    /*
    *********************************************************
    @Method Name    : generateRandomOTP
    @author         : Pritkumar Prajapati
    @description    : method to is used to generate the OTP based on the number of digits.
    @param          : Integer length
    @return         : String
	@date			: April 14, 2025
	@JIRA			: 
    ********************************************************
	*/

    private static String generateRandomOTP(Integer length) {
        String otp = '';
        for (Integer i = 0; i < length; i++) {
            otp += String.valueOf(Math.round(Math.random() * 9));
        }
        return otp;
    }

    /*
    *********************************************************
    @Method Name    : generateHashedOTP
    @author         : Pritkumar Prajapati
    @description    : method to is used to generate the hashed OTP from the string OTP.
    @param          : String plainOTP
    @return         : String
	@date			: April 14, 2025
	@JIRA			: 
    ********************************************************
	*/

    private static String generateHashedOTP(String plainOTP) {
        Blob hash = Crypto.generateDigest('SHA-256', Blob.valueOf(plainOTP));
        return EncodingUtil.convertToHex(hash);
    }

    /*
    *********************************************************
    @Method Name    : sendOTP
    @author         : Pritkumar Prajapati
    @description    : method to is used to send the OTP via email.
    @param          : String toAddress, String otp
    @return         : void
	@date			: April 14, 2025
	@JIRA			: 
    ********************************************************
	*/

    private static void sendOTP(String toAddress, String otp) {
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[]{toAddress});
        mail.setSubject('Your One-Time Password');
        mail.setPlainTextBody('Your one-time password is: ' + otp + '. This OTP will expire in ' + OTP_EXPIRATION_MINUTES + ' minutes.');

        OrgWideEmailAddress[] oweaList = [SELECT Id FROM OrgWideEmailAddress WHERE Address = 'respirahotels@gmail.com' LIMIT 1];
        if (!oweaList.isEmpty()) {
            mail.setOrgWideEmailAddressId(oweaList[0].Id);
        } else {
            System.debug('Org-Wide Email Address not found or not verified.');
        }

        try {
            Messaging.sendEmail(new Messaging.SingleEmailMessage[]{mail});
            System.debug('OTP email sent successfully to: ' + toAddress);
        } catch (Exception e) {
            System.debug('Error sending OTP email: ' + e.getMessage());
            throw new AuraHandledException('Failed to send OTP email.');
        }
    }

}