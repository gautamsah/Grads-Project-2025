public without sharing class RES_HotelInvoicePDFController {
    public Order orderRecord {get; set;}

    public RES_HotelInvoicePDFController() {
        Id orderId = ApexPages.currentPage().getParameters().get('id');//'801Hr0000022pVHIAY';//
        // Id accId = ApexPages.currentPage().getParameters().get('accId');//'001Hr00002Bt2L2IAJ';//

        System.debug('Order ID received by VF page: ' + orderId);
        // System.debug('Account ID received by VF page: ' + accId);

        if (orderId != null) {
            // String soqlQuery = 'SELECT Id, OrderNumber, AccountId, Status, TotalAmount, CreatedDate, Guest_First_Name__c, Guest_Last_Name__c,Guest_Email__c,Guest_Phone__c, (SELECT Id, OrderId ,Product2Id ,Product2.Image_URL__c, Product2.Hotel__r.Name,Product2.Hotel__r.Address__c ,Product2.Hotel__r.Email__c ,Product2.Hotel__r.Phone__c , Product2.Name , Quantity , UnitPrice, TotalPrice, checkin__c , checkout__c FROM OrderItems) FROM Order WHERE Id = \'' + String.escapeSingleQuotes(orderId) + '\' LIMIT 1';
            // System.debug('Executing SOQL: ' + soqlQuery);
            try {
            List<Order> orders = [SELECT Id, OrderNumber, AccountId, Status, TotalAmount, CreatedDate, Guest_First_Name__c, Guest_Last_Name__c,Guest_Email__c,Guest_Phone__c, (SELECT Id, OrderId ,Product2Id ,Product2.Image_URL__c, Product2.Hotel__r.Name,Product2.Hotel__r.Address__c ,Product2.Hotel__r.Email__c ,Product2.Hotel__r.Phone__c , Product2.Name , Quantity , UnitPrice, TotalPrice, checkin__c , checkout__c FROM OrderItems) FROM Order WHERE Id =:orderId LIMIT 1];
                orderRecord = !orders.isEmpty() ? orders[0] : new Order();
                System.debug('Order Record after query in VF: ' + orderRecord);
                System.debug('Order Items in VF: ' + orderRecord?.OrderItems);
            } catch (Exception e) {
                System.debug('Error executing SOQL in VF: ' + e.getMessage());
                orderRecord = new Order();
            }
        } else {
            orderRecord = new Order();
        }
    }

    @AuraEnabled
    public static String sendInvoiceEmail(String orderId) {
    PageReference pdfPage = new PageReference('/apex/RespiraInvoicePDF?id='+orderId);
    pdfPage.getParameters().put('id', orderId);
    Blob pdfBody;

    try {
        pdfBody = pdfPage.getContent();
    } catch (Exception e) {
        System.debug('Error generating PDF: ' + e.getMessage());
        return 'Error generating PDF: ' + e.getMessage();
    }

    ContentVersion CV = new ContentVersion();
    CV.Title = 'HotelBookingInvoice.pdf';
    CV.PathOnClient = 'HotelBookingInvoice.pdf';
    CV.VersionData = pdfBody;
    CV.FirstPublishLocationId = orderId;
    insert CV;

    Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
    attach.setContentType('application/pdf');
    attach.setFileName('HotelBookingInvoice.pdf');
    attach.body = pdfBody;


    List<Order> ordersToSend = [SELECT Id, Guest_Email__c, OrderNumber,Guest_First_Name__c, Guest_Last_Name__c  FROM Order WHERE Id = :orderId LIMIT 1];
    Order orderToSend = ordersToSend[0];
    String orgWideEmailId = [SELECT Id FROM OrgWideEmailAddress WHERE Address = 'respirahotels@gmail.com' LIMIT 1].Id;
    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
    mail.setToAddresses(new List<String>{orderToSend.Guest_Email__c});
    mail.setSubject('Hotel Booking Confirmation1');
    mail.setHtmlBody('Dear ' + orderToSend.Guest_First_Name__c + ' ' + orderToSend.Guest_Last_Name__c + ',<br/><br/>Thank you for your booking with ResPira! Please find your invoice attached.<br/><br/>We look forward to welcoming you.<br/><br/>Sincerely,<br/>The ResPira Team');
    mail.setOrgWideEmailAddressId(orgWideEmailId);
    mail.setFileAttachments(new Messaging.EmailFileAttachment[] {attach});

    Messaging.SendEmailResult[] results = Messaging.sendEmail(new Messaging.SingleEmailMessage[] {mail});
    if (results[0].isSuccess()) {
        System.debug('Email sent successfully.');
        return 'Email sent Successfully with PDF.';
    } else {
        System.debug('Email failed to send: ' + results[0].getErrors()[0].getMessage());
        return 'Email failed to send: ' + results[0].getErrors()[0].getMessage();
    }




    // if (!ordersToSend.isEmpty()) {

    //     if (String.isNotBlank(orderToSend.Guest_Email__c)) {
    //         

    //         
    //         mail.setSubject('Your ResPira Hotel Booking Invoice - Order #' + orderToSend.OrderNumber);
    //         mail.setHtmlBody('Dear ' + orderToSend.Guest_First_Name__c + ' ' + orderToSend.Guest_Last_Name__c + ',<br/><br/>Thank you for your booking with ResPira! Please find your invoice attached.<br/><br/>We look forward to welcoming you.<br/><br/>Sincerely,<br/>The ResPira Team');

    //         Messaging.EmailFileAttachment pdfAttachment = new Messaging.EmailFileAttachment();
    //         pdfAttachment.setContentType('application/pdf');
    //         pdfAttachment.setFileName('ResPira_Invoice_' + orderToSend.OrderNumber + '.pdf');
    //         pdfAttachment.setBody(pdfBody);

    //         mail.setOrgWideEmailAddressId(orgWideEmailId);
    //         mail.setFileAttachments(new List<Messaging.EmailFileAttachment>{pdfAttachment});

    //         Messaging.SendEmailResult[] results = Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{mail});

    //         if (results[0].isSuccess()) {
    //             System.debug('Invoice email sent successfully to: ' + orderToSend.Guest_Email__c);
    //             return 'Invoice email sent successfully.';
    //         } else {
    //             System.debug('Failed to send invoice email: ' + results[0].getErrors()[0].getMessage());
    //             return 'Failed to send invoice email: ' + results[0].getErrors()[0].getMessage();
    //         }
    //     } else {
    //         System.debug('Order with ID ' + orderId + ' has no Guest Email. Cannot send email.');
    //         return 'Order with ID ' + orderId + ' has no Guest Email. Cannot send email.';
    //     }
    // } else {
    //     System.debug('Order with ID ' + orderId + ' not found. Cannot send email.');
    //     return 'Order with ID ' + orderId + ' not found. Cannot send email.';
    // }
    }
}