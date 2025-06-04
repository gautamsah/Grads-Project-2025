trigger BookedDateTrigger on Booked_Date__c (before insert, before update) {
    for (Booked_Date__c newMap : Trigger.new) {
        if (newMap.Hotel_Product__c != null && (Trigger.isInsert || (Trigger.isUpdate && (newMap.Start_Date__c != Trigger.oldMap.get(newMap.Id).Start_Date__c || newMap.End_Date__c != Trigger.oldMap.get(newMap.Id).End_Date__c || newMap.Hotel_Product__c != Trigger.oldMap.get(newMap.Id).Hotel_Product__c)))) {

            List<Product2> relatedRoom = [SELECT Id, Total_Quantity__c FROM Product2 WHERE Id = :newMap.Hotel_Product__c];

            if (!relatedRoom.isEmpty()) {
                Product2 room = relatedRoom[0];

                Date newStart = newMap.Start_Date__c;
                Date newEnd = newMap.End_Date__c;

                List<Booked_Date__c> getBookeRooms = [SELECT Id, Start_Date__c, End_Date__c FROM Booked_Date__c WHERE Hotel_Product__c = :room.Id AND Id != :newMap.Id AND ((Start_Date__c <= :newEnd AND End_Date__c >= :newStart))];

                Integer booking = getBookeRooms.size();
                Decimal quantity = room.Total_Quantity__c;

                if (Trigger.isInsert) {
                    if (booking >= quantity) {
                        newMap.addError('This room is fully booked.');
                    }
                } else if (Trigger.isUpdate) {
                    Booked_Date__c oldBooking = Trigger.oldMap.get(newMap.Id);

                    if (newMap.Hotel_Product__c != oldBooking.Hotel_Product__c) {
                        List<Product2> oldRooms = [SELECT Id FROM Product2 WHERE Id = :oldBooking.Hotel_Product__c];
                        if (!oldRooms.isEmpty()) {
                            List<Booked_Date__c> updatedBookings = [SELECT Id FROM Booked_Date__c WHERE Hotel_Product__c = :room.Id AND Id != :newMap.Id AND ((Start_Date__c <= :newEnd AND End_Date__c >= :newStart))];
                            if (updatedBookings.size() >= quantity) {
                                newMap.addError('The room is fully booked.');
                            }
                        } else {
                            newMap.addError('Error in room.');
                        }
                    } else { 
                        Date oldStart = oldBooking.Start_Date__c;
                        Date oldEnd = oldBooking.End_Date__c;

                        List<Booked_Date__c> alredyBooked = [SELECT Id FROM Booked_Date__c WHERE Hotel_Product__c =:room.Id AND Id != :newMap.Id AND ((Start_Date__c <= :newEnd AND End_Date__c >= :newStart))];

                        if (alredyBooked.size() >= quantity) {
                            newMap.addError('The room is fully booked.');
                        }
                    }
                }
            } else {
                newMap.addError('we got error');
            }
        }
    }
}