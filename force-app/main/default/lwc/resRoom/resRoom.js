import { LightningElement, track, wire } from 'lwc';
import getRooms from '@salesforce/apex/RES_Utility.getHotelRooms';
import { NavigationMixin } from 'lightning/navigation';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import PICKLIST_FIELD from '@salesforce/schema/Product2.Related_Hotel__c';
import roomObj from '@salesforce/schema/Product2';
import tax from "@salesforce/label/c.Respira_Room_Tax";
import createOrderAndOrderItem from '@salesforce/apex/RESOrderAndOrderItemController.createOrderAndOrderItem';
import userId from '@salesforce/user/Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ResRoom extends NavigationMixin(LightningElement) {
    formatDate(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    userDetails = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        spReq: '',
        agreement: false,
    };
    onDetails = false;
    onPayment = false;
    onRoom = true;
    hotelName;
    hotelUniqueName;
    @track rooms = [];
    @track selectedRooms = [];
    roomTax = tax;
    haveError = false;
    firstNameError = false;
    lastNameError = false;
    errorMessageCssClass = 'hide-error';
    taxAmount = 0;
    name;
    city;
    reviews;
    rating;
    cssClass = 'counter';
    @track totalRooms = 0;
    @track totalAmount = 0;
    placeholder = 'Search Hotels';
    hotels = [];
    d = new Date();
    tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    startDate = localStorage.getItem("checkinDate") ? localStorage.getItem("checkinDate") : this.formatDate(this.d.getFullYear(), (this.d.getMonth() + 1), this.d.getDate());
    endDate = localStorage.getItem("checkoutDate") ? localStorage.getItem("checkoutDate") : this.formatDate(this.tomorrow.getFullYear(), (this.tomorrow.getMonth() + 1), this.tomorrow.getDate());

    @wire(getObjectInfo, { objectApiName: roomObj })
    roomInfo;
    @wire(getPicklistValues, { recordTypeId: '$roomInfo.data.defaultRecordTypeId', fieldApiName: PICKLIST_FIELD })
    wiredPicklistValues({ error, data }) {
        if (data) {
            let picklistValues = data.values;
            let tempHotels = [];
            picklistValues.forEach(ele => {
                const tempObj = { ...ele };
                tempHotels.push(tempObj.value);
            });
            this.hotels = tempHotels;
        } else if (error) {
            console.log('Error retrieving picklist values: ', error);
        }
    }

    handleBookNow(event) {
        console.log('Button clicked!');
        console.log('event:', event.detail);

        localStorage.setItem("checkinDate", event.detail.startDate);
        localStorage.setItem("checkoutDate", event.detail.endDate);
        localStorage.setItem("selectedHotels", event.detail.searchInput);
        if (event.detail.searchInput) {
            this.hotelUniqueName = event.detail.searchInput.replace(/ /g, '-');
        }
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `https://respira-dev.my.site.com/respira/s/room?hotelUniqueName=${this.hotelUniqueName}`,
                target: '_self',
            }
        });
    }

    isRoomAvailable(bookedDates) {
        return (bookedDates.Available_Slots__c != 0);
    }

    // ************************************************************************************************

    connectedCallback() {
        console.log('in connectedCallBack');
        let basicUrl = window.location.href;
        let actualUrl = new URL(basicUrl).searchParams;
        this.hotelName = actualUrl.get('hotelUniqueName');
        console.log('SDate:', this.startDate);
        console.log('EDate:', this.endDate);


        getRooms({ hotelName: this.hotelName, startDate: this.startDate, endDate: this.endDate })
            .then(result => {

                this.rooms = result.map(room => {
                    console.log('room is: ', room);
                    console.log('room dates:', JSON.stringify(room.Booked_Dates__r));
                    let isAvailable = false;
                    let availableSlot = 0;
                    if (room.Booked_Dates__r) {
                        room.Booked_Dates__r.map(day => {
                            isAvailable = this.isRoomAvailable(day);
                            availableSlot = day.Available_Slots__c;
                        });
                    } else {
                        isAvailable = true;
                        availableSlot = room.Total_Quantity__c;
                    }

                    return {
                        ...room,
                        isAvailable: isAvailable,
                        emptySlot: availableSlot,
                        count: 0,
                        disabledIncrement: false,
                        disabledDecrement: true,
                    };

                });
                if (this.rooms.length > 0) {
                    this.name = this.rooms[0].Hotel__r.Name;
                    this.city = this.rooms[0].Hotel__r.City__c;
                    this.reviews = this.rooms[0].Hotel__r.Total_Reviews__c;
                    this.rating = this.rooms[0].Hotel__r.Overall_Rating__c;
                    console.log('Room:', JSON.stringify(this.rooms));

                }
                this.updateSelectedRooms();
                this.calculateTotals();

            })
            .catch(error => {
                console.log('Got error while getting room records!', error.message);
            });
    }


    //*****************************************************************************************************************

    handleIncrement(event) {
        const roomId = event.currentTarget.dataset.id;
        this.updateRoomCount(roomId, 1);
        console.log(JSON.stringify(this.selectedRooms));

    }

    handleDecrement(event) {
        const roomId = event.currentTarget.dataset.id;
        this.updateRoomCount(roomId, -1);
    }

    updateSelectedRooms() {
        this.selectedRooms = this.rooms.filter(room => room.count > 0).map(room => ({
            Id: room.Id,
            Name: room.Name,
            Product_Unit_Price__c: room.Product_Unit_Price__c,
            count: room.count,
            calculatedPrice: room.Product_Unit_Price__c * room.count
        }));
    }

    updateRoomCount(roomId, value) {
        this.rooms = this.rooms.map(room => {
            if (room.Id === roomId) {
                const newCount = (room.count || 0) + value;
                const maxQuantity = room.emptySlot;
                let incrementDisable = false;
                let decrementDisable = false;

                if (newCount >= maxQuantity) {
                    incrementDisable = true;
                }
                if (newCount <= 0) {
                    decrementDisable = true;
                }
                if (newCount >= 0 && newCount <= maxQuantity) {
                    this.cssClass = 'counter';
                    return { ...room, count: newCount, disabledIncrement: incrementDisable, disabledDecrement: decrementDisable };
                } else {
                    this.cssClass = 'disabled';
                    return room;
                }
            }
            return room;
        });
        this.updateSelectedRooms();
        this.calculateTotals();
    }

    calculateTotals() {
        this.totalRooms = this.selectedRooms.reduce((total, room) => total + room.count, 0);
        this.totalAmount = this.selectedRooms.reduce((total, room) => total + room.calculatedPrice + (room.calculatedPrice * this.roomTax) / 100, 0);
        this.taxAmount = this.selectedRooms.reduce((total, room) => total + (room.calculatedPrice * this.roomTax) / 100, 0);
    }

    //*****************************************************************************************************************

    handleProceedButton() {
        //handle session management for rooms data
        this.onRoom = false;
        this.onDetails = true;
        this.onPayment = false;
    }

    onDetailBackClick() {
        this.onRoom = true;
        this.onDetails = false;
        this.onPayment = false;
    }


    handleChange(event) {
        let { fieldName, fieldValue } = event.detail;
        this.userDetails = { ...this.userDetails, [fieldName]: fieldValue };
    }
    get errorMessageNameCssClass(){
        if(this.firstNameError || this.lastNameError){
            return 'show-name-error';
        } else {
            return 'hide-name-error';
        }
    }

    onSignUpClick() {
        //handle session management for personal details
        this.template.querySelectorAll('c-res-input').forEach((c) => {
            this.haveError = c.validationCheck();
            if (this.haveError) {
                this.count = this.count + 1;
            }
            console.log(this.count);
        });
        if (this.count == 0) {
            let hasError = false;
            if (!this.userDetails.agreement) {
                hasError = true;
                this.errorMessageCssClass = 'show-error';
            } else {
                this.errorMessageCssClass = 'hide-error';
            }
            if (hasError) {
                return;
            } else {
                this.errorMessageCssClass = 'hide-error';
                this.onRoom = false;
                this.onDetails = false;
                this.onPayment = true;
            }
        }
        else {
            this.count = 0;
        }

    }



    //================ Milin's Code=========================
    onProceedPayment(){

        if(this.startDate && this.endDate && userId){
            let myObject = {
                userId: userId,
                rooms: this.selectedRooms,
                checkinDate: this.startDate,
                checkoutDate: this.endDate,
            }
            let str = JSON.stringify(myObject);
            console.log('json.stringify : ', str);
            console.log('json.stringify : ', typeof (str));
    
            createOrderAndOrderItem({ myObjectJson: JSON.stringify(myObject) }).then(result => {
                console.log('success: ', result);
    
            }).catch(error => {
                console.log('error : ', JSON.stringify(error));
    
            });
        }
        else if(!userId){
            //navigation mixin to login page + session management
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                url: `https://respira-dev.my.site.com/respira/s/loginpage`,
                target:'_self',
                }
            }); 
        }
        else if(!this.startDate || !this.endDate){
            // toast enter start date and end date
            this.showToast('Please enter start date and end date');
        }
    }

    showToast(message) {
        const event = new ShowToastEvent({
            title: 'Get Help',
            message:message,
        });
        this.dispatchEvent(event);
    }
    onPaymentBackClick() {
        this.onRoom = false;
        this.onDetails = true;
        this.onPayment = false;
        
    }


}