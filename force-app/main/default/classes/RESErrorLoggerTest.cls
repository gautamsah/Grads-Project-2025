/*
*********************************************************
Apex Class Name    : RESErrorLoggerTest
Created Date       : March 24, 2025
@description       : This is the Test class of RESErrorLogger
@author            : Pritkumar Prajapati
@date			   : March 24, 2025
@JIRA			   : GT25-61
Revision Log:
Ver   Date         Author                               Modification
1.0   24-03-2025   Pritkumar Prajapati                 Initial Version
*********************************************************
*/

@isTest
public class RESErrorLoggerTest {
    @isTest
    private static void testRESErrorLoggerFunctionality_errorLogCreation(){
        String err;
        String caughtErr;

        Test.startTest();
        try{
            RESErrorLogger.createErrorLog('Test Name', 'Test Message', 'Test Object', 'Test Object RecordId');
        } catch (DmlException e) {
            caughtErr = e.getMessage();
        }
        Test.stopTest();
        
        System.assertEquals(caughtErr, err);
    }

    @isTest
    private static void testRESErrorLoggerFunctionality_errorLogCreation(){
        String err;
        String caughtErr;

        Test.startTest();
        try{
            RESErrorLogger.createErrorLog('Test Name', 'Test Message', 'Test Object', 'Test Object RecordId');
        } catch (DmlException e) {
            caughtErr = e.getMessage();
        }
        Test.stopTest();
        
        System.assertEquals(caughtErr, err);
    }
}