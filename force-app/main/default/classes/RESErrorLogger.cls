/*
*********************************************************
Apex Class Name    : RESErrorLoggerTest
Created Date       : March 24, 2025
@description       : This class is used for creating a error log throughout the org.
@author            : Pritkumar Prajapati
@date			   : March 24, 2025
@JIRA			   : GT25-61
Revision Log:
Ver   Date         Author                               Modification
1.0   24-03-2025   Pritkumar Prajapati                 Initial Version
*********************************************************
*/

public without sharing class RESErrorLogger {
/*
    *********************************************************
    @Method Name    : createErrorLog
    @author         : Pritkumar Prajapati
    @description    : This method is used to create the error log for the DML operations
    @param          : String name, String message, String objectName, String objectRecordId
    @return         : void
	@date			: March 24, 2025
	@JIRA			: GT25-62
    ********************************************************
*/
    public static void createErrorLog(String name, String message, String objectName, String objectRecordId){
        Error_Logger__c errLog = new Error_Logger__c();
        errLog.Name = name;
        errLog.Message__c = message;
        errLog.Source_Object__c = objectName;
        errLog.Source_Record_Id__c = objectRecordId;

        try {
            insert errLog;
        } catch (DmlException e) {
            throw e;
        }
    }
}