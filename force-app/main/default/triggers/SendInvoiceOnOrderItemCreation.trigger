trigger SendInvoiceOnOrderItemCreation on Order (after update) {

//     if (Trigger.isAfter && Trigger.isUpdate) {

//     List<Messaging.SingleEmailMessage> emailsToSend = new List<Messaging.SingleEmailMessage>();

//     for (Order newOrder : Trigger.new) {
//         Order oldOrder = Trigger.oldMap.get(newOrder.Id);

//         if (newOrder.IsOrderItemsCreated__c == true && (oldOrder == null || oldOrder.IsOrderItemsCreated__c == false)) {
//             System.debug('>>> Trigger fired for Order ID: ' + newOrder.Id);
//             try {
//                 Order orderToSend = [SELECT Id, OrderNumber, Guest_Email__c, Guest_First_Name__c, Guest_Last_Name__c
//                                      FROM Order
//                                      WHERE Id = :newOrder.Id
//                                      LIMIT 1];
//                 System.debug('>>> Order record fetched: ' + orderToSend);

//                 PageReference pdfPage = new PageReference('/apex/RespiraInvoicePDF?id=' + newOrder.Id);
//                 Blob pdfBody = pdfPage.getContentAsPDF();
//                 System.debug('>>> PDF generated successfully. Blob size: ' + pdfBody.size());

//                 EmailTemplate template = [SELECT Id, HtmlValue, Subject FROM EmailTemplate WHERE DeveloperName = 'Your_Invoice_Template' LIMIT 1];
//                 System.debug('>>> Email Template fetched: ' + template);

//                 if (template != null) {
//                     Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
//                     mail.setToAddresses(new List<String>{orderToSend.Guest_Email__c});
//                     mail.setSubject(template.Subject.replace('{!Order.OrderNumber}', orderToSend.OrderNumber));
//                     String body = template.HtmlValue.replace('{!Order.Guest_First_Name__c}', orderToSend.Guest_First_Name__c)
//                                                .replace('{!Order.Guest_Last_Name__c}', orderToSend.Guest_Last_Name__c)
//                                                .replace('{!Order.OrderNumber}', orderToSend.OrderNumber);
//                     mail.setHtmlBody(body);

//                     Messaging.EmailFileAttachment pdfAttachment = new Messaging.EmailFileAttachment();
//                     pdfAttachment.setContentType('application/pdf');
//                     pdfAttachment.setFileName('ResPira_Invoice_' + orderToSend.OrderNumber + '.pdf');
//                     pdfAttachment.setBody(pdfBody);
//                     mail.setFileAttachments(new List<Messaging.EmailFileAttachment>{pdfAttachment});

//                     emailsToSend.add(mail);
//                     System.debug('>>> Email message created and added to list.');
//                 } else {
//                     System.debug('>>> Error: Lightning Email Template not found.');
//                 }

//             } catch (Exception e) {
//                 System.debug('>>> Error processing Order ID ' + newOrder.Id + ': ' + e.getMessage());
//             }
//         }
//     }

//     if (!emailsToSend.isEmpty()) {
//         System.debug('>>> Sending ' + emailsToSend.size() + ' emails.');
//         Messaging.SendEmailResult[] results = Messaging.sendEmail(emailsToSend);
//         for (Messaging.SendEmailResult result : results) {
//             if (!result.isSuccess()) {
//                 System.debug('>>> Email sending failed: ' + result.getErrors()[0].getMessage());
//             } else {
//                 System.debug('>>> Email sent successfully.');
//             }
//         }
//     } else {
//         System.debug('>>> No emails to send.');
//     }
// }

}