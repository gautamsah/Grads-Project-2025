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
public without sharing class RESOrderAndOrderItemController {
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
            Decimal tax =  Integer.valueOf(System.Label.Respira_Room_Tax);
            Id accId;
            Id orderCreatedId;
            List<Object> rooms = (List<Object>) obj.get('rooms');
            String firstName = (String) obj.get('firstName');
            String lastName = (String) obj.get('lastName');
            String email = (String) obj.get('email');
            String phone = (String) obj.get('phone');
            String spReq = (String) obj.get('spReq');
            Date checkin = (Date) date.valueOf((string)obj.get('checkinDate'));
            Date checkout = (Date) date.valueOf((string)obj.get('checkoutDate'));
            Id pbId = getStandardPriceBook();
            Decimal totalOrderCost = 0;
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
            if (!rooms.isEmpty()) {
                for(Object roomObj : rooms){
                    Map<String, Object> room = (Map<String, Object>) roomObj;
                    Date checkinDate = (Date) date.valueOf((string)obj.get('checkinDate'));
                    Date checkoutDate = (Date) date.valueOf((string)obj.get('checkoutDate'));
                    Integer count = (Integer) room.get('count');
                    Integer daysToStay = checkinDate.daysBetween(checkoutDate);
                    System.debug('dae : ' + daysToStay);
                    try {
                        Decimal roomUnitPrice = getPriceBookEntry(pbId, (Id) room.get('Id')).UnitPrice;
                        totalOrderCost += (roomUnitPrice * daysToStay) * count ;

                    } catch (Exception e) {
                        throw e;
                    }
                }
                totalOrderCost += (totalOrderCost * tax/100);
                System.debug('tax : ' + tax);

                Account acc = [SELECT Id, Wallet__c FROM Account WHERE Id =:accId];
                Decimal walletMoney = acc.Wallet__c;
                System.debug('wallet money before update : ' + walletMoney);
                System.debug('to money before update : ' + totalOrderCost);
                if (walletMoney >= totalOrderCost) {
                    walletMoney = walletMoney - totalOrderCost;
                    acc.Wallet__c = walletMoney;
                    System.debug('wallet money after update : ' + walletMoney);
                    update acc;
                }
                else {
                    throw new MyException('Wallet Money is not enough');
                }
            }
            if(accId != null){
                try {
                    orderCreatedId = createOrder(accId, pbId, firstName, lastName, email, phone, spReq, checkin, checkout);
                } catch (MyException e) {
                    throw new MyException('Unable to Create Order');
                }
            }
            if (orderCreatedId != null) {
                for(Object roomObj : rooms){
                    Map<String, Object> room = (Map<String, Object>) roomObj;
                    try {
                        Id pbeId = getPriceBookEntry(pbId, (Id) room.get('Id')).Id;

                        createOrderItem((Id) orderCreatedId,(Id) room.get('Id'), (Integer) room.get('count'), (Integer) room.get('Product_Unit_Price__c'), (Date) date.valueOf((string)obj.get('checkinDate')), (Date) date.valueOf((string)obj.get('checkoutDate')), pbeId);
                        

                    } catch (Exception e) {
                        throw e;
                    }
                }

                List<Order> ordrList = [select Id,IsOrderItemsCreated__c,(select Id from OrderItems) from Order where Id =: orderCreatedId Limit 1];
                if(!ordrList.isEmpty()){
                    Order ordr = ordrList[0];
                    if(!ordr.OrderItems.isEmpty()){
                        ordr.IsOrderItemsCreated__c = true;
                        update ordr;
                    }
                }
                // EmailTemplate et = [SELECT Id FROM EmailTemplate WHERE DeveloperName ='Order_Creation_1744793411095'];
                // System.debug(et +' '+ et.Id);
                // List<Messaging.SingleEmailMessage> allmsg = new List<Messaging.SingleEmailMessage>();
                // List<string> toAddress = new List<string>();
                // String guestEmail = [select Id, Guest_Email__c from Order where Id =: orderCreatedId limit 1].Guest_Email__c;
                // String contactId = [select Id, AccountId from Contact where AccountId =: accId limit 1].Id;
                // toAddress.add(guestEmail);
                // Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                //     mail.setTemplateId(et.Id);
                //     System.debug(mail.getTemplateId());
                //     System.debug(mail.getSubject());
                //     mail.setToAddresses(toAddress);
                //     mail.setSubject('Your booking has been confirmed!');
                //     mail.setTargetObjectId(contactId);
                //     mail.setWhatId(orderCreatedId);
                //     mail.setSaveAsActivity(false);
                //     mail.setUseSignature(false);
                // System.debug('single mail : '+mail);
                // allmsg.add(mail);
                // System.debug('all mail : '+allmsg);

                // try {
                //     Messaging.SendEmailResult[] results = Messaging.sendEmail(allmsg,false);
                //     System.debug(results[0].isSuccess());
                //     System.debug(results[0].getErrors());
                // } catch (Exception e) {
                //     System.debug(e.getMessage());
                // }
                
            }
            else{
                throw new MyException('Unable to create order');
            }
            return orderCreatedId ;
    
        } catch (MyException e) {
            Database.rollback(sp);
            Database.releaseSavepoint(sp);
            throw new MyException(e.getMessage());
        }
    }


    /*
    *********************************************************
    @Method Name    : cancelOrder
    @author         : Milin Kapatel
    @description    : method to is used for Canceling Order
    @param          : Id orderId
    @return         : boolean
	@date			: April 19, 2025
	@JIRA			: 
    ********************************************************
	*/
    @AuraEnabled
    public static boolean cancelOrder(Id orderId){
        Savepoint sp = Database.setSavepoint();
        try {
            Order ordr = getOrderForOrderId(orderId);
            if (ordr != null) {
                ordr.Status = 'Canceled';
                update ordr;
            }
            if(ordr.Status == 'Canceled'){
                Decimal amountToRefund = 0;
                Decimal walletAmount = getAccountWalletValue(ordr.AccountId);
                Account acc = new Account();
                amountToRefund = (ordr.TotalAmount * 70) / 100;
                walletAmount += amountToRefund;
                acc.Id = ordr.AccountId;
                acc.Wallet__c = walletAmount;
                update acc;
                return true;
            }
            else{
                return false;
            }
        } catch (Exception e) {
            Database.rollback(sp);
            Database.releaseSavepoint(sp);
            throw new AuraHandledException(e.getMessage());
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
    @Method Name    : getAccountIdForUser
    @author         : Milin Kapatel
    @description    : method to is used for getting accountId for User
    @param          : Id userId
    @return         : Id
	@date			: April 11, 2025
	@JIRA			: 
    ********************************************************
	*/
    private static Order getOrderForOrderId(Id orderId) {
        // Fetch the user and related account id
        List<Order> orderList = [
            SELECT Id, Status, Guest_First_Name__c, Guest_Last_Name__c, Guest_Email__c, Guest_Phone__c, Guest_Special_Request__c, TotalAmount, AccountId
            FROM Order
            WHERE Id = :orderId
            LIMIT 1
        ];
        if(!orderList.isEmpty()){
            return orderList[0];
        }
        else{
            throw new MyException('account Id not found');
        }
    }

    /*
    *********************************************************
    @Method Name    : getWalletAmountFromUser
    @author         : Pritkumar Prajapati
    @description    : method to is used for getting wallet amount for User
    @param          : Id userId
    @return         : Id
	@date			: April 11, 2025
	@JIRA			: 
    ********************************************************
	*/
    @AuraEnabled
    public static Decimal getWalletAmountFromUser(Id userId) {
        // Fetch the user and related account id
        try{
            Id accId = getAccountIdForUser(userId);
            
            if(accId != null){
                try {
                    return getAccountWalletValue(accId);
                } catch (MyException e) {
                    throw e;
                }
            }
        }
        catch(Exception e){
            throw e;
        }
        return null;


    }

    /*
    *********************************************************
    @Method Name    : getWalletAmountFromUser
    @author         : Pritkumar Prajapati
    @description    : method to is used for getting wallet amount for User
    @param          : Id userId
    @return         : Id
	@date			: April 11, 2025
	@JIRA			: 
    ********************************************************
	*/
    private static Decimal getAccountWalletValue(Id accId){
        try {
            List<Account> acc = [select Id, Wallet__c from Account where Id =:accId limit 1];
            if(!acc.isEmpty()){
                return acc[0].Wallet__c;
            }
        } catch (Exception e) {
            throw e;
        }
        return null;
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
    private static Id createOrder(Id accountId,Id pricebook2Id, String firstName,String lastName,String email,String phone,String spReq, Date checkin, Date checkout){
        Order ordr = new Order(AccountId = accountId, EffectiveDate = System.today(), 	Status = 'Shipped',Pricebook2Id = pricebook2Id, 	Guest_First_Name__c = firstName, Guest_Last_Name__c = lastName, Guest_Email__c = email, Guest_Phone__c = phone, Guest_Special_Request__c = spReq, Checkin__c = checkin, Checkout__c = checkout, IsOrderItemsCreated__c = false);
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
        
        Decimal tax = Integer.valueOf(System.Label.Respira_Room_Tax);
        Decimal unitPriceWithGst = unitPrice + (unitPrice * tax/100);
        OrderItem ordrItm = new OrderItem(OrderId = orderId, Product2Id = productId, Quantity = quantity, UnitPrice = unitPriceWithGst, checkin__c = checkin, checkout__c = checkout,PricebookEntryId = pricebookEntryId);
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
    private static PricebookEntry getPriceBookEntry(Id pbId, Id productId){
        try {
            List<PricebookEntry> pbe = [
                SELECT Id, 	UnitPrice
                FROM PricebookEntry
                WHERE Pricebook2Id = :pbId
                AND Product2Id = :productId
                AND IsActive = true
                LIMIT 1
            ];
            return pbe[0];
        } catch (Exception e) {
            throw e;
        }

    }
}