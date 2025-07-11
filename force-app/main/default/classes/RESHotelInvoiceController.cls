public without sharing class RESHotelInvoiceController {
    public Order currentOrder { get; private set; }
    public List<OrderItemWrapper> orderItemWrappers { get; set; }
   
    public RESHotelInvoiceController() {
        String orderId = ApexPages.currentPage().getParameters().get('id');
        if (String.isNotBlank(orderId)) {
            List<Order> orders = [ 
                SELECT
                    Id,
                    OrderNumber,
                    AccountId,
                    Account.Name,
                    Guest_First_Name__c,
                    Guest_Last_Name__c,
                    Guest_Email__c,
                    Guest_Phone__c,
                    TotalAmount,
                    CreatedDate
                FROM
                    Order
                WHERE
                    Id = :orderId
            ];

            if (!orders.isEmpty()) {
                currentOrder = orders[0];
            } else {
                ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, 'Order with ID ' + orderId + ' not found.'));
                return;
            }

            orderItemWrappers = new List<OrderItemWrapper>();
            for (OrderItem oi : [
                SELECT
                    Id,
                    OrderId,
                    Product2Id,
                    Product2.Name,
                    Product2.Hotel__r.Name,
                    Product2.Hotel__r.Address__c,
                    Product2.Hotel__r.Email__c,
                    Product2.Hotel__r.Phone__c,
                    Quantity,
                    UnitPrice,
                    TotalPrice,
                    Checkin__c,
                    Checkout__c
                FROM
                    OrderItem
                WHERE
                    OrderId = :orderId
            ]) {
                System.debug('Single Order Item: ' + oi);
                System.debug('Room Name:' + oi.Product2.Name);
                System.debug('Hotel:' + oi.Product2.Hotel__r.Name);
                System.debug('Hotel Add:' + oi.Product2.Hotel__r.Address__c);
                System.debug('Hotel Email:' + oi.Product2.Hotel__r.Email__c);
                System.debug('Hotel Phone:' + oi.Product2.Hotel__r.Phone__c);
                orderItemWrappers.add(new OrderItemWrapper(oi));
                
                OrderItemWrapper wrapper = new OrderItemWrapper(oi);
   				System.debug('Wrapper created with OrderItem: ' + wrapper.orderItem);
                System.debug('orderItemWrappers: '+orderItemWrappers);
                           }
        } else {
            ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, 'Order ID is missing.'));
        }
    }

    public class OrderItemWrapper {
        public OrderItem orderItem { get; set; }

        public OrderItemWrapper(OrderItem oi) {
            orderItem = oi;
        }

        public String getHotelName() {
            System.debug('Single Order Item Hotel: ' + orderItem.Product2.Hotel__r?.Name);
            return orderItem.Product2.Hotel__r?.Name;
        }
        public String getHotelEmail() {
            System.debug('Single Order Item Hotel: ' + orderItem.Product2.Hotel__r?.Email__c);
            return orderItem.Product2.Hotel__r?.Email__c;
        }
        public String getHotelPhone() {
            System.debug('Single Order Item Hotel: ' + orderItem.Product2.Hotel__r?.Phone__c);
            return orderItem.Product2.Hotel__r?.Phone__c;
        }
        public String getHotelAddress() {
            System.debug('Single Order Item Hotel: ' + orderItem.Product2.Hotel__r?.Address__c);
            return orderItem.Product2.Hotel__r?.Address__c;
        }
        public String getRoomName() {
            System.debug('Single Order Item Hotel: ' + orderItem.Product2?.Name);
            return orderItem.Product2?.Name;
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
		
        System.debug('CV.VersionData -->'+CV.VersionData);
        
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

    @AuraEnabled
    public static String getInvoiceFileURL(String orderId) {
    if (String.isBlank(orderId)) {
        return null;
    }

    PageReference pdfPage = Page.RespiraInvoicePDF;
    pdfPage.getParameters().put('Id', orderId);
    pdfPage.setRedirect(false);

    try {
        Blob pdfBlob = pdfPage.getContentAsPDF();

        // Create a ContentVersion
        ContentVersion cv = new ContentVersion();
        cv.Title = 'Invoice_' + orderId;
        cv.PathOnClient = 'Invoice_' + orderId + '.pdf';
        cv.VersionData = pdfBlob;
        insert cv;

        // Get the ContentDocumentId
        Id contentDocumentId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id = :cv.Id].ContentDocumentId;

        return '/sfc/servlet.shepherd/document/download/' + contentDocumentId;

    } catch (Exception ex) {
        System.debug('Error generating and saving PDF: ' + ex.getMessage());
        return null;
    }
}

    // @AuraEnabled
    // public static Blob generateInvoicePDF(String orderId) {
    //     if (String.isBlank(orderId)) {
    //         return null; // Or throw an error
    //     }

    //     PageReference pdfPage = Page.RespiraInvoicePDF;
    //     pdfPage.getParameters().put('Id', orderId);

    //     pdfPage.setRedirect(false);

    //     try {
    //         Blob pdfBlob = pdfPage.getContentAsPDF();
    //         return pdfBlob;
    //     } catch (System.NoAccessException ex) {
    //         // Handle potential access issues
    //         System.debug('Error generating PDF: ' + ex.getMessage());
    //         return null;
    //     } catch (Exception ex) {
    //         // Handle other potential errors
    //         System.debug('Unexpected error generating PDF: ' + ex.getMessage());
    //         return null;
    //     }
    // }
}