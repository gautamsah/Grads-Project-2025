public without sharing class RES_GenerateInvoicePDFAction {

    public class Input {
        @InvocableVariable(label='Order ID' required=true)
        public Id orderId;
    }

    public class Output {
        @InvocableVariable(label='ContentVersion ID')
        public Id contentVersionId;
    }

    @InvocableMethod(label='Generate Invoice PDF and Create Attachment' description='Generates a PDF invoice for a given Order ID and creates a ContentVersion.')
    public static List<Output> generateInvoiceAndCreateAttachment(List<Input> inputs) {
        List<Output> outputs = new List<Output>();
        Output output = new Output();

        if (!inputs.isEmpty() && inputs[0].orderId != null) {
            Id orderId = inputs[0].orderId;
            try {
                Order orderRecord = [SELECT Id, OrderNumber, AccountId, Status, TotalAmount, CreatedDate, Guest_First_Name__c, Guest_Last_Name__c,Guest_Email__c,Guest_Phone__c, (SELECT Id, OrderId ,Product2Id ,Product2.Image_URL__c, Product2.Hotel__r.Name,Product2.Hotel__r.Address__c ,Product2.Hotel__r.Email__c ,Product2.Hotel__r.Phone__c , Product2.Name , Quantity , UnitPrice, TotalPrice, checkin__c , checkout__c FROM OrderItems) FROM Order WHERE Id =: orderId LIMIT 1];

                System.debug('Order ID being passed to VF page: ' + orderRecord.Id);
            System.debug('Account ID being passed to VF page: ' + orderRecord.AccountId);

                if (orderRecord != null) {
                    PageReference pdfPage = Page.resHotelInvoicePDF;
                    pdfPage.getParameters().put('id', orderRecord.Id);
                    pdfPage.getParameters().put('accId', orderRecord.AccountId);

                    Blob pdfBlob = pdfPage.getContentAsPDF();
                    String attachmentName = 'Invoice_' + orderRecord.OrderNumber + '.pdf';

                    ContentVersion cv = new ContentVersion();
                    cv.Title = attachmentName.removeEnd('.pdf');
                    cv.PathOnClient = attachmentName;
                    cv.VersionData = pdfBlob;
                    cv.Origin = 'C';
                    insert cv;
                    ContentDocumentLink cdl = new ContentDocumentLink();
                    cdl.ContentDocumentId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =: cv.Id].ContentDocumentId;
                    cdl.LinkedEntityId = orderRecord.Id;
                    cdl.ShareType = 'V';
                    insert cdl;

                    output.contentVersionId = cv.Id;

                } else {
                    output.contentVersionId = null;
                }

            } catch (Exception e) {
                output.contentVersionId = null;
            }
        } else {
            output.contentVersionId = null;
        }

        outputs.add(output);
        return outputs;
    }
}