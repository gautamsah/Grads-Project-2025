public without sharing class RESOrderController {
    @AuraEnabled
    public static string createOrderAndOrderItem(String myObjectJson){
        try {
            Map<String, Object> obj = (Map<String, Object>) JSON.deserializeUntyped(myObjectJson);
            System.debug(obj.get('Name'));
            return 'Received: ' + obj.get('Name');
    
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}