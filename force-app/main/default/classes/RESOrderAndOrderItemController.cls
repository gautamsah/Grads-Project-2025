/*
*********************************************************
Apex Class Name    : RESOrderAndOrderItemController
Created Date       : April 11, 2025
@description       : This class is used for controlling Order and OrderItem creation
@Testclass		   : 
@author            : Milin Kapatel
@date			   : April 11, 2025
@JIRA			   : 
Revision Log:
Ver   Date         Author                               Modification
1.0   11-04-2025   Milin Kapatel                      Initial Version
*********************************************************
*/
public with sharing class RESOrderAndOrderItemController {
    /*
    *********************************************************
    @Class Name     : MyException
    @author         : Milin Kapatel
    @description    : Class is used for Creatin custom Error that can contain String in it
	@date			: April 11, 2025
    ********************************************************
	*/
    public class MyException extends Exception {}

    /*
    *********************************************************
    @Method Name    : createOrderAndOrderItem
    @author         : Milin Kapatel
    @description    : method to is used for Creating Order and OrderItem
    @param          : String myObjectJson
    @return         : string
	@date			: April 11, 2025
	@JIRA			: 
    ********************************************************
	*/
    @AuraEnabled
    public static string createOrderAndOrderItem(String myObjectJson){
        Savepoint sp = Database.setSavepoint();
        try {
            Map<String, Object> obj = (Map<String, Object>) JSON.deserializeUntyped(myObjectJson);
            // System.debug(obj.get('userId'));
            // System.debug(obj.get('rooms'));
            // System.debug(obj.get('checkinDate'));
            // System.debug(obj.get('checkoutDate'));
            Id accId;
            Id orderCreatedId;
            List<Object> rooms = (List<Object>) obj.get('rooms');
            Id pbId = getStandardPriceBook();
            // for(Object roomObj : rooms){
            //     Map<String, Object> room = (Map<String, Object>) roomObj;
            //     System.debug(room.get('Id'));
            //     System.debug(room.get('count'));
            // }
            try {
                accId = getAccountIdForUser((Id) obj.get('userId'));
            } catch (MyException e) {
                throw e;
            }
            if(accId != null){
                try {
                    orderCreatedId = createOrder(accId,pbId);
                } catch (MyException e) {
                    throw new MyException('Unable to Create Order');
                }
            }
            if (orderCreatedId != null) {
                for(Object roomObj : rooms){
                    Map<String, Object> room = (Map<String, Object>) roomObj;
                    try {
                        Id pbeId = getPriceBookEntry(pbId, (Id) room.get('Id'));
                        createOrderItem((Id) orderCreatedId,(Id) room.get('Id'), (Integer) room.get('count'), (Integer) room.get('Product_Unit_Price__c'), (Date) date.valueOf((string)obj.get('checkinDate')), (Date) date.valueOf((string)obj.get('checkoutDate')), pbeId);
                    } catch (Exception e) {
                        throw e;
                    }
                }
            }
            else{
                throw new MyException('Unable to create order');
            }
            return 'Received: ' + obj.get('userId') + ' '  + obj.get('rooms') + ' ' + obj.get('checkinDate') + ' ' + obj.get('checkoutDate')  ;
    
        } catch (MyException e) {
            Database.rollback(sp);
            Database.releaseSavepoint(sp);
            throw new MyException(e.getMessage());
        }
    }

    /*
    *********************************************************
    @Method Name    : getAccountIdForUser
    @author         : Milin Kapatel
    @description    : method to is used for getting accountId for User
    @param          : Id userId
    @return         : Id
	@date			: April 11, 2025
	@JIRA			: 
    ********************************************************
	*/
    private static Id getAccountIdForUser(Id userId) {
        // Fetch the user and related account id
        List<User> usr = [
            SELECT Id, AccountId
            FROM User
            WHERE Id = :userId
            LIMIT 1
        ];
        if(!usr.isEmpty()){
            return usr[0].AccountId;
        }
        else{
            throw new MyException('account Id not found');
        }
    }

    /*
    *********************************************************
    @Method Name    : createOrder
    @author         : Milin Kapatel
    @description    : method to is used for Creating Order
    @param          : Id accountId,Id pricebook2Id
    @return         : Id
	@date			: April 11, 2025
	@JIRA			: 
    ********************************************************
	*/
    private static Id createOrder(Id accountId,Id pricebook2Id){
        Order ordr = new Order(AccountId = accountId, EffectiveDate = System.today(), 	Status = 'Shipped',Pricebook2Id = pricebook2Id);
        try {
            insert ordr;
            return ordr.Id;
        } catch (MyException e) {
            System.debug('Error ' + e.getMessage());
        }
        return null;
    }

    /*
    *********************************************************
    @Method Name    : createOrderItem
    @author         : Milin Kapatel
    @description    : method to is used for Creating OrderItem
    @param          : Id orderId, Id productId, Integer quantity,Integer unitPrice, Date checkin, Date checkout, Id pricebookEntryId
    @return         : Boolean
	@date			: April 11, 2025
	@JIRA			: 
    ********************************************************
	*/
    private static boolean createOrderItem(Id orderId, Id productId, Integer quantity,Integer unitPrice, Date checkin, Date checkout, Id pricebookEntryId){
        OrderItem ordrItm = new OrderItem(OrderId = orderId, Product2Id = productId, Quantity = quantity, UnitPrice = unitPrice, checkin__c = checkin, checkout__c = checkout,PricebookEntryId = pricebookEntryId);
        try {
            insert ordrItm;
            return true;
        } catch (Exception e) {
            throw e;
        }
    }

    /*
    *********************************************************
    @Method Name    : getStandardPriceBook
    @author         : Milin Kapatel
    @description    : method to is used for getting Id of standard Pricebook
    @param          : void
    @return         : Id
	@date			: April 11, 2025
	@JIRA			: 
    ********************************************************
	*/
    private static Id getStandardPriceBook(){
        try {
            List<Pricebook2> standardPb = [SELECT Id,IsActive FROM Pricebook2 WHERE IsStandard = true LIMIT 1];
            if (!standardPb[0].IsActive) {
                standardPb[0].IsActive = true;
                update standardPb[0];
            }
            return standardPb[0].Id;
        } catch (Exception e) {
            throw e;
        }
    }

    /*
    *********************************************************
    @Method Name    : getPriceBookEntry
    @author         : Milin Kapatel
    @description    : method to is used for getting Id of perticular pricebook entry
    @param          : Id pbId, Id productId
    @return         : Id
	@date			: April 11, 2025
	@JIRA			: 
    ********************************************************
	*/
    private static Id getPriceBookEntry(Id pbId, Id productId){
        try {
            List<PricebookEntry> pbe = [
                SELECT Id
                FROM PricebookEntry
                WHERE Pricebook2Id = :pbId
                AND Product2Id = :productId
                AND IsActive = true
                LIMIT 1
            ];
            return pbe[0].Id;
        } catch (Exception e) {
            throw e;
        }

    }
}


