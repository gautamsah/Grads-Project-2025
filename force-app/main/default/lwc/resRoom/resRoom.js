import { LightningElement, track, wire } from 'lwc';
import getRooms from '@salesforce/apex/RES_Utility.getHotelRooms';
import createOrderAndOrderItem from '@salesforce/apex/RESOrderAndOrderItemController.createOrderAndOrderItem';
import generateOTP from '@salesforce/apex/RES_OTP_Service.generateOTP';
import verifyOTP from '@salesforce/apex/RES_OTP_Service.verifyOTP';
import sendInvoice from '@salesforce/apex/RESHotelInvoiceController.sendInvoiceEmail';
import getWalletAmount from '@salesforce/apex/RESOrderAndOrderItemController.getWalletAmountFromUser';
import { NavigationMixin } from 'lightning/navigation';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import PICKLIST_FIELD from '@salesforce/schema/Product2.Related_Hotel__c';
import roomObj from '@salesforce/schema/Product2';
import tax from "@salesforce/label/c.Respira_Room_Tax";
import userId from '@salesforce/user/Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProfileDetails from '@salesforce/apex/RESProfileController.getProfileDetails';


export default class ResRoom extends NavigationMixin(LightningElement) {
    formatDate(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    @track tabStatus = {
        walletTab: false,
        creditCardTab: false,
        upiTab: false,
        netBankingTab: false,
    };
    @track tabStatusCopy = {
        walletTab: true,
        creditCardTab: false,
        upiTab: false,
        netBankingTab: false,
    };
    userDetails = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        spReq: '',
        agreement: false,
    };
    @track walletAmount = 0;
    onRoom = true;
    onDetails = false;
    onPayment = false;
    onOTP = false;
    @track otp = '';
    hotelName;
    hotelUniqueName;
    isResendDisabled = false;
    resendTimer = 0;
    resendInterval;
    @track rooms = [];
    @track selectedRooms = [];
    roomTax = tax;
    haveError = false;
    firstNameError = false;
    lastNameError = false;
    errorMessageCssClass = 'hide-error';
    taxAmount = 0;
    city;
    reviews;
    rating;
    showLoadingSpinner = false;
    cssClass = 'counter';
    @track totalRooms = 0;
    @track totalAmount = 0;
    placeholder = 'Search Hotels';
    hotels = [];
    name = localStorage.getItem("selectedHotels") ? localStorage.getItem("selectedHotels") : this.hotelName;
    d = new Date();
    tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    startDate = localStorage.getItem("checkinDate") ? localStorage.getItem("checkinDate") : this.formatDate(this.d.getFullYear(), (this.d.getMonth() + 1), this.d.getDate());
    endDate = localStorage.getItem("checkoutDate") ? localStorage.getItem("checkoutDate") : this.formatDate(this.tomorrow.getFullYear(), (this.tomorrow.getMonth() + 1), this.tomorrow.getDate());
    numberOfDays = (Date.parse(this.endDate) - Date.parse(this.startDate)) / 1000 / 60 / 60 / 24;

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

    ///////////////////

    get walletTabClass() {
        return this.tabStatusCopy.walletTab ? 'payment-method payment-method-active' : 'payment-method';
    }
    get creditCardTabClass() {
        return this.tabStatusCopy.creditCardTab ? 'payment-method payment-method-active' : 'payment-method';
    }
    get upiTabClass() {
        return this.tabStatusCopy.upiTab ? 'payment-method payment-method-active' : 'payment-method';
    }
    get netBankingTabClass() {
        return this.tabStatusCopy.netBankingTab ? 'payment-method payment-method-active' : 'payment-method';
    }
    handleTabChange(event) {
        if (event.target.dataset.id == 'walletTab') {
            this.tabStatusCopy = { ...this.tabStatus, walletTab: true };
        }
        else if (event.target.dataset.id == 'creditCardTab') {
            this.tabStatusCopy = { ...this.tabStatus, creditCardTab: true };
        }
        else if (event.target.dataset.id == 'upiTab') {
            this.tabStatusCopy = { ...this.tabStatus, upiTab: true };
        }
        else if (event.target.dataset.id == 'netBankingTab') {
            this.tabStatusCopy = { ...this.tabStatus, netBankingTab: true };
        }
    }

    ///////////////////

    handleBookNow(event) {
        localStorage.setItem("checkinDate", event.detail.startDate);
        localStorage.setItem("checkoutDate", event.detail.endDate);
        localStorage.setItem("selectedHotels", event.detail.searchInput);
        if (event.detail.searchInput) {
            this.hotelUniqueName = event.detail.searchInput.replace(/ /g, '-');
        }
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `/room?hotelUniqueName=${this.hotelUniqueName}`,
                target: '_self',
            }
        });
    }

    isRoomAvailable(bookedDates) {
        return (bookedDates.Available_Slots__c != 0);
    }

    // ************************************************************************************************

    connectedCallback() {
        this.showLoadingSpinner = true;
        let basicUrl = window.location.href;
        let actualUrl = new URL(basicUrl).searchParams;
        this.hotelName = actualUrl.get('hotelUniqueName');

        getWalletAmount({ userId: userId })
            .then(result => {
                let amount = result;
                this.walletAmount = amount.toFixed(2);
            })
            .catch(error => {
                console.log('Got error while getting wallet records!', error.message);
            });


        getRooms({ hotelName: this.hotelName, startDate: this.startDate, endDate: this.endDate })
            .then(result => {
                this.showLoadingSpinner = false;

                this.rooms = result.map(room => {
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

                }
                this.updateSelectedRooms();
                this.calculateTotals();

            })
            .catch(error => {
                this.showLoadingSpinner = false;
                console.log('Got error while getting room records!', JSON.stringify(error));
            });

        getProfileDetails()
            .then(result => {
                this.userDetails.email = result.accRecord.PersonEmail;
                this.userDetails.firstName = result.accRecord.FirstName;
                this.userDetails.lastName = result.accRecord.LastName;
                this.userDetails.phone = result.accRecord.Phone;
            })
            .catch(error => {
                console.log('Got error while getting user details:', JSON.stringify(error));
            });
    }


    //*****************************************************************************************************************

    handleIncrement(event) {
        const roomId = event.currentTarget.dataset.id;
        this.updateRoomCount(roomId, 1);

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
        let subtotal = this.selectedRooms.reduce((total, room) => total + (room.calculatedPrice * this.numberOfDays * room.count), 0);
        let taxAmount = (subtotal * this.roomTax) / 100;
        this.taxAmount = taxAmount.toFixed(2);
        this.totalAmount = (subtotal + taxAmount).toFixed(2);

        console.log('Number of days:', numberOfDays);
        console.log('Subtotal (before tax):', subtotal.toFixed(2));
        console.log('Tax Amount:', this.taxAmount);
        console.log('Total Amount (including tax):', this.totalAmount);
    }

    //*****************************************************************************************************************

    handleProceedButton() {
        //handle session management for rooms data
        this.onRoom = false;
        this.onDetails = true;
        this.onPayment = false;
        this.onOTP = false;
    }

    onDetailBackClick() {
        this.onRoom = true;
        this.onDetails = false;
        this.onPayment = false;
        this.onOTP = false;
    }


    handleChange(event) {
        let { fieldName, fieldValue } = event.detail;
        this.userDetails = { ...this.userDetails, [fieldName]: fieldValue };
    }
    handleSpecialRequest(event) {
        this.userDetails.spReq = event.target.value;
    }
    onSignUpClick() {
        let myObject = {
            userId: userId,
            rooms: this.selectedRooms,
            checkinDate: this.startDate,
            checkoutDate: this.endDate,
            firstName: this.userDetails.firstName,
            lastName: this.userDetails.lastName,
            email: this.userDetails.email,
            phone: this.userDetails.phone,
            spReq: this.userDetails.spReq,
        }
        console.log('myobject : ', JSON.stringify(myObject));

        //handle session management for personal details
        this.count = 0;
        this.template.querySelectorAll('c-res-input').forEach((c) => {
            this.haveError = c.validationCheck();
            if (this.haveError) {
                this.count = this.count + 1;
            }
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
                this.onOTP = false;
            }
        }
        else {
            this.count = 0;
        }

    }

    handleOtpChange(event) {
        this.otp = event.detail.fieldValue;
    }

    //================ Milin's Code=========================
    onProceedPayment() {

        this.showLoadingSpinner = true;



        if (this.startDate && this.endDate && userId) {
            console.log('total amount : ', this.totalAmount);
            console.log('wallet amount : ', this.walletAmount);
            try {
                if (Number(this.totalAmount) > Number(this.walletAmount)) {
                    console.log('before toast method');
                    this.showLoadingSpinner = false;
                    this.showToast('info', 'Insufficient Funds!', 'Please add money in your wallet to continue this payment.');
                    console.log(this.totalAmount > this.walletAmount, 'inside toast method');
                    return;
                }
            }
            catch (error) {
                console.log('error : ', JSON.stringify(error));
                this.showToast('info', 'Insufficient Funds!', error.message);
                this.showLoadingSpinner = false;
                return;
            }


            generateOTP({ emailAddress: this.userDetails.email })
                .then(result => {
                    this.showLoadingSpinner = false;
                    this.showToast('success', 'OTP Sent!', `The OTP has been sent to email ${this.userDetails.email}!`);
                    this.onRoom = false;
                    this.onDetails = false;
                    this.onPayment = false;
                    this.onOTP = true;
                })
                .catch(error => {
                    this.showLoadingSpinner = false;
                    this.onRoom = false;
                    this.onDetails = false;
                    this.onPayment = true;
                    this.onOTP = false;
                    this.showToast('error', 'OTP not sent!', 'There was an error sending OTP. Please try again after some time!');
                });


        }


        else if (!userId) {
            //navigation mixin to login page + session management
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: `https://respira-dev.my.site.com/respira/s/loginpage`,
                    target: '_self',
                }
            });
        }

        else if (!this.startDate || !this.endDate) {
            // toast enter start date and end date
            this.showToast('error', 'Please Enter start and End date for you booking!', JSON.stringify(error.body.message));
        }
    }
    handleHotelRedirect() {
        let basicUrl = window.location.href;
        let actualUrl = new URL(basicUrl).searchParams;
        let hotelName = actualUrl.get('hotelUniqueName');
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `https://respira-dev.my.site.com/respira/s/hotel?hotelUniqueName=${hotelName}`,
                target: '_self',
            }
        });
    }
    onResend() {
        this.showLoadingSpinner = true;
        if (this.isResendDisabled) return;

        generateOTP({ emailAddress: this.userDetails.email })
            .then(result => {
                this.showLoadingSpinner = false;
                console.log('OTP created successfully!');
                this.showToast('success', 'OTP Sent!', `The OTP has been sent to email ${this.userDetails.email}!`);
                this.startResendTimer();
            })
            .catch(error => {
                this.showLoadingSpinner = false;
                console.log('Got error while generating OTP!', JSON.stringify(error.message));

            });
    }

    startResendTimer() {
        this.isResendDisabled = true;
        this.resendTimer = 120; // 2 minutes

        this.resendInterval = setInterval(() => {
            this.resendTimer -= 1;
            if (this.resendTimer <= 0) {
                clearInterval(this.resendInterval);
                this.isResendDisabled = false;
            }
        }, 1000);
    }

    onVerify() {
        this.showLoadingSpinner = true;
        verifyOTP({ enteredOTP: this.otp })
            .then(result => {
                this.showLoadingSpinner = false;
                if (result) {
                    this.showToast('success', 'OTP Verified!', 'Creating your order...');
                    let myObject = {
                        userId: userId,
                        rooms: this.selectedRooms,
                        checkinDate: this.startDate,
                        checkoutDate: this.endDate,
                        firstName: this.userDetails.firstName,
                        lastName: this.userDetails.lastName,
                        email: this.userDetails.email,
                        phone: this.userDetails.phone,
                        spReq: this.userDetails.spReq,
                    }
                    console.log('myOBject after otp verificaiton : ', JSON.stringify(myObject));
                    this.showLoadingSpinner = true;
                    createOrderAndOrderItem({ myObjectJson: JSON.stringify(myObject) })
                        .then(orderResult => {
                            console.log('Order created successfully: ', orderResult);
                            sendInvoice({ orderId: orderResult })
                                .then(result => {
                                    this.showLoadingSpinner = false;
                                    console.log('Email sent successfully: ', JSON.stringify(result));
                                })
                                .catch(error => {
                                    this.showLoadingSpinner = false;
                                    console.log('error sending email:', JSON.stringify(error));
                                });
                            localStorage.setItem("profileScreen", "bookings");
                            // RESHotelInvoiceController.sendInvoiceEmail(orderCreatedId);
                            this.showToast('success', 'Booking Successful!', 'Your order has been placed!');
                            this[NavigationMixin.Navigate]({
                                type: 'standard__webPage',
                                attributes: {
                                    url: 'https://respira-dev.my.site.com/respira/s/confirmation-page',
                                    target: '_self',
                                },
                            });
                            setTimeout(() => {
                                this[NavigationMixin.Navigate]({
                                    type: 'standard__webPage',
                                    attributes: {
                                        url: 'https://respira-dev.my.site.com/respira/s/profile',
                                        target: '_self',
                                    },
                                });
                            }, 3000);
                        })
                        .catch(error => {
                            console.log('Error creating order: ', JSON.stringify(error));
                            this.showToast('error', 'Booking Failed!', 'There was an error processing your order. Please try again.');
                        });
                } else {
                    console.log('Incorrect OTP!');
                    this.showToast('error', 'Verification Failed!', 'The OTP you entered is incorrect. Please try again.');
                }
            })
            .catch(error => {
                this.showLoadingSpinner = false;
                console.log('Error verifying OTP: ', error.message);
                this.showToast('error', 'Verification Error!', JSON.stringify(error.body.message));
            });
    }

    showToast(variant, title, message) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
    onPaymentBackClick() {
        this.onRoom = false;
        this.onDetails = true;
        this.onPayment = false;
        this.onOTP = false;
    }



    handleAddMoneyToWallet() {
        localStorage.setItem("profileScreen", "addMoney");
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://respira-dev.my.site.com/respira/s/profile',
                target: '_self',
            },
        });
    }


}