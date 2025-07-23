public without sharing class RESProfileController {
    /*
    *********************************************************
    @Method Name    : getProfileDetails
    @author         : Milin Kapatel
    @description    : method to is used for Fetching all details to show on profile page
    @param          : Id userId
    @return         : List<ProfileWrapperData>
	@date			: April 11, 2025
	@JIRA			: 
    ********************************************************
	*/

    @AuraEnabled
    public static ProfileWrapperData getProfileDetails(){
        try {
            Id userId = getUserId();
            Id accId = getAccountIdForUser(userId);
            Account acc = new Account();
            List<Order> orderList = new List<Order>();
            List<Case> caseList = new List<Case>();
            List<Review__c> reviewList = new List<Review__c>();
            List<Transaction__c> transactionList = new List<Transaction__c>();
            ProfileWrapperData profileWrapper = new ProfileWrapperData();
            if(accId != null){
                acc = getAccountDetails(accId);
                orderList = getOrdersForAccount(accId);
                caseList = getCasesForAccount(accId);
                reviewList = getReviews();
                transactionList = getTransactionDetails(accId);
            }
            if(acc != null){
                System.debug('inside acc if');
                profileWrapper.accRecord = acc;
            }
            else{
                System.debug('inside acc else');
                profileWrapper.accRecord = null;
            }
            if(orderList != null){
                System.debug('inside order if');
                profileWrapper.orderList = orderList;
            }
            else {
                System.debug('inside order else');
                profileWrapper.orderList = null;
            }
            if(caseList != null){
                System.debug('inside case if');
                profileWrapper.caseList = caseList;
            }
            else {
                System.debug('inside case else');
                profileWrapper.caseList = null;
            }
            if(reviewList != null){
                System.debug('inside review if');
                profileWrapper.reviewList = reviewList;
            }
            else {
                System.debug('inside review else');
                profileWrapper.reviewList = null;
            }
            if(transactionList != null){
                System.debug('inside transaction if');
                profileWrapper.transactionList = transactionList;
            }
            else {
                System.debug('inside transaction else');
                profileWrapper.transactionList = null;
            }
            return profileWrapper;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    public class ProfileWrapperData{
        @Auraenabled public Account accRecord;
        @Auraenabled public List<Order> orderList;
        @Auraenabled public List<Case> caseList;
        @Auraenabled public List<Review__c> reviewList;
        @Auraenabled public List<Transaction__c> transactionList;
    }



    /*
    *********************************************************
    @Method Name    : addMoneyToWallet
    @author         : Milin Kapatel
    @description    : method to is used for adding money to wallet
    @param          : Decimal amount
    @return         : Boolean
	@date			: April 17, 2025
	@JIRA			: 
    ********************************************************
	*/

    @AuraEnabled
    public static Boolean addMoneyToWallet(Decimal amount){
        try {
            Id userId = getUserId();
            Id accId = getAccountIdForUser(userId);
            Account acc = new Account();
            List<Account> accList = [select Id,Wallet__c from Account where Id =: accId];
            if (!accList.isEmpty()) {
                acc = accList[0];
            }
            if(acc != null){
                if(acc.Wallet__c == null){
                    acc.Wallet__c = 0;
                }
                acc.Wallet__c = acc.Wallet__c + amount;
                update acc;
                return true;
            }
            else{
                return false;
            }
            
        } catch (Exception e) {
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
        try {
            List<User> usr = [
            SELECT Id, AccountId
            FROM User
            WHERE Id = :userId
            LIMIT 1
            ];
            if(!usr.isEmpty()){
                return usr[0].AccountId;
            }
        } catch (Exception e) {
            throw e;
        }
        return null;
    }
    /*
    *********************************************************
    @Method Name    : getAccountDetails
    @author         : Milin Kapatel
    @description    : method to is used for getting account details from account Id
    @param          : Id accId
    @return         : Id
	@date			: April 11, 2025
	@JIRA			: 
    ********************************************************
	*/
    private static Account getAccountDetails(Id accId) {
        try{
            List<Account> acc = [select Id, FirstName, LastName, Phone, PersonEmail,Wallet__c from Account where Id =: accId limit 1];
            if(!acc.isEmpty()){
                return acc[0];
            }
            else{
                return null;
            }
        }
        catch(Exception e){
            throw e;
        }
    }
    /*
    *********************************************************
    @Method Name    : getOrdersForAccount
    @author         : Milin Kapatel
    @description    : method to is used for getting orders for account
    @param          : Id accId
    @return         : List<Order>
	@date			: April 11, 2025
	@JIRA			: 
    ********************************************************
	*/
    private static List<Order> getOrdersForAccount(Id accId) {
        try{
            List<Order> ordrs = [select Id,OrderNumber, AccountId, Status,TotalAmount, CreatedDate, (select Id, OrderId ,Product2Id ,Product2.Image_URL__c, Product2.Hotel__r.Name,Product2.Hotel__r.Unique_Hotel_Name__c ,Product2.Hotel__r.Banner_Photo_Url__c ,  Product2.Name , Quantity , UnitPrice, checkin__c , checkout__c from OrderItems) from Order where AccountId =: accId];
            if(!ordrs.isEmpty()){
                return ordrs;
            }
            else{
                return null;
            }
        }
        catch(Exception e){
            throw e;
        }
    }
    /*
    *********************************************************
    @Method Name    : getTransactionDetails
    @author         : Milin Kapatel
    @description    : method to is used for getting Transactions account
    @param          : Id accId
    @return         : List<Transaction__c>
	@date			: April 24, 2025
	@JIRA			: 
    ********************************************************
	*/
    private static List<Transaction__c> getTransactionDetails(Id accId) {
        try{
            List<Transaction__c> transactions = [select Id,Name, Account__c, Amount__c, Type__c, Closing_Balance__c, CreatedDate, Date__c from Transaction__c where Account__c =: accId];
            if(!transactions.isEmpty()){
                return transactions;
            }
            else{
                return null;
            }
        }
        catch(Exception e){
            throw e;
        }
    }
    /*
    *********************************************************
    @Method Name    : getCasesForAccount
    @author         : Milin Kapatel
    @description    : method to is used for getting cases for account
    @param          : Id accId
    @return         : List<Case>
	@date			: April 11, 2025
	@JIRA			: 
    ********************************************************
	*/
    private static List<Case> getCasesForAccount(Id accId) {
        try{
            List<Case> cases = [SELECT Id, Status, AccountId, Order__c, Order__r.OrderNumber, CreatedDate, Subject, Description  FROM Case WHERE AccountId =: accId];
            if(!cases.isEmpty()){
                return cases;
            }
            else{
                return null;
            }
        }
        catch(Exception e){
            throw e;
        }
    }
    /*
    *********************************************************
    @Method Name    : updateAccountRecord
    @author         : Milin Kapatel
    @description    : method to is used for getting cases for account
    @param          : string myObjectJson
    @return         : string
	@date			: April 12, 2025
	@JIRA			: 
    ********************************************************
	*/
    @AuraEnabled
    public static string updateAccountRecord(string myObjectJson) {
        Savepoint sp = Database.setSavepoint();
        try{
            Map<String, Object> obj = (Map<String, Object>) JSON.deserializeUntyped(myObjectJson);
            string firstName = (string) obj.get('firstName');
            string lastName = (string) obj.get('lastName');
            string email = (string) obj.get('email');
            string contact = (string) obj.get('contact');
            Id userID = getUserId();
            Id accId = getAccountIdForUser(userId);
            Account acc = new Account(Id = accId, FirstName = firstName, LastName = lastName, PersonEmail = email, Phone = contact);
            update acc;
            User usr = new User(Id = userID,FirstName = firstName, LastName = lastName, Email = email);
            update usr;
            return 'account updated : ' + acc.FirstName + ' ' + acc.LastName + ' ' + acc.PersonEmail + ' ' + acc.Phone;
        }
        catch(Exception e){
            Database.rollback(sp);
            Database.releaseSavepoint(sp);
            throw e;
        }
    }
        
    /*
    *********************************************************
    @Method Name    : getUserId
    @author         : Milin Kapatel
    @description    : method to is used for getting Id of current context user
    @param          : void
    @return         : Id
	@date			: April 12, 2025
	@JIRA			: 
    ********************************************************
	*/
    private static Id getUserId(){
        return UserInfo.getUserId();
    }

    /*
    *********************************************************
    @Method Name    : createCase
    @author         : Milin Kapatel
    @description    : method to is used for getting Id of current context user
    @param          : String myObjectJson
    @return         : String
	@date			: April 13, 2025
	@JIRA			: 
    ********************************************************
	*/
    @AuraEnabled
    public static String createCase(String myObjectJson){
        try {
            Map<String, Object> obj = (Map<String, Object>) JSON.deserializeUntyped(myObjectJson);
            Id userId = getUserId();
            Id accId;
            String accEmail;
            String orderNumber = (String) obj.get('orderId');
            Id orderId = [select Id,OrderNumber from Order where OrderNumber =: orderNumber Limit 1].Id;
            if(userId != null){
                accId = getAccountIdForUser(userId);
                accEmail = [select Id,PersonEmail from Account where Id =:accId limit 1].PersonEmail;
            }
            if(accId != null){
                Case cs = new Case( 
                    CurrencyIsoCode = 'USD', 
                    Status = 'New',
                    Origin = 'Website',
                    Subject = (String) obj.get('subject'),
                    Description = (String) obj.get('description'),
                    Order__c = orderId,
                    AccountId = accId,
                    Web_Email__c = accEmail
                );
                insert cs;
                return 'Recieved: ' + 'Case Id : ' + cs.Id;
            }
        } catch (Exception e) {
            throw e;
        }
        return null;
    }

    /*
    *********************************************************
    @Method Name    : addReview
    @author         : Jay Patel
    @description    : method to is used for adding Review of perticular Hotel with respect to user
    @param          : String reviewDetails
    @return         : String
	@date			: April 13, 2025
	@JIRA			: 
    ********************************************************
	*/
    @AuraEnabled
    public static String addReview(String reviewDetails){
        

        try {
            Map<String, Object> jsonMap = (Map<String, Object>) JSON.deserializeUntyped(reviewDetails);
            Id reviewId = (Id) jsonMap.get('reviewId');
            Integer valueForMoney = Integer.valueOf(jsonMap.get('ValueForMoney'));
            Integer foodQuality = Integer.valueOf(jsonMap.get('FoodQuality'));
            Integer hospitality = Integer.valueOf(jsonMap.get('Hospitality'));
            Integer cleanlinessAndHygiene = Integer.valueOf(jsonMap.get('CleanlinessAndHygiene'));
            String reviewHeading = (String)jsonMap.get('ReviewHeading');
            String reviewDescription = (String)jsonMap.get('ReviewDescription');
            Id hotel = (Id) jsonMap.get('HotelId');
            Id userId = getUserId();
            Id accId = getAccountIdForUser(userId);
            Review__c  review = new Review__c(Id = reviewId, Value_For_Money__c = valueForMoney,Food_Quality__c = foodQuality,Hospitality__c=hospitality,Cleanliness_And_Hygiene__c=cleanlinessAndHygiene ,Description__c =reviewDescription,Review_Title__c = reviewHeading, Hotel__c = hotel, Account__c = accId);
            upsert review;

            return 'Recieved : review Id: ' + review.Id;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    /*
    *********************************************************
    @Method Name    : getReviews
    @author         : Milin Kapatel
    @description    : method to is used for getting reviews given by perticular user
    @param          : void
    @return         : List<Review__c>
	@date			: April 13, 2025
	@JIRA			: 
    ********************************************************
	*/
    private static List<Review__c> getReviews(){
        try {
                Id userId = getUserId();
                Id accId = getAccountIdForUser(userId);
                List<Review__c>  reviewList = [SELECT id, Value_For_Money__c,Food_Quality__c,Hospitality__c,Cleanliness_And_Hygiene__c,Description__c,Review_Title__c, Hotel__c, Account__c FROM Review__c WHERE Account__c =:accId];
                if (!reviewList.isEmpty()) {
                    return reviewList;
                }
                else{
                    return null;
                }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}