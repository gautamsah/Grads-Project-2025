import { LightningElement, track, wire } from 'lwc';
import getProfileDetails from '@salesforce/apex/RESProfileController.getProfileDetails';
import updateAccountRecord from '@salesforce/apex/RESProfileController.updateAccountRecord';
import createCase from '@salesforce/apex/RESProfileController.createCase';
import addReview from '@salesforce/apex/RESProfileController.addReview';
import addMoneyToWallet from '@salesforce/apex/RESProfileController.addMoneyToWallet';
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import FontAwesome from '@salesforce/resourceUrl/FontAwesome';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { getWaveTemplate } from 'lightning/analyticsWaveApi';
import generateOTP from '@salesforce/apex/RES_OTP_Service.generateOTP';
import verifyOTP from '@salesforce/apex/RES_OTP_Service.verifyOTP';
import cancelOrder from '@salesforce/apex/RESOrderAndOrderItemController.cancelOrder';
import OrderNumber from '@salesforce/schema/Order.OrderNumber';
// import getInvoiceFileURL from '@salesforce/apex/RESHotelInvoiceController.getInvoiceFileURL';
// import generateInvoicePDF from '@salesforce/apex/RESHotelInvoiceController.generateInvoicePDF';
export default class ResProfile extends NavigationMixin(LightningElement) {
    @track localStorageScreen = 'userDetails';
    @track showUserDetails = this.localStorageScreen == 'userDetails' ? true : false;
    @track showBookings = this.localStorageScreen == 'bookings' ? true : false;
    @track showBookingDetails = this.localStorageScreen == 'bookingDetails' ? true : false;
    @track showSupportTickets = this.localStorageScreen == 'supportTickets' ? true : false;
    @track showWallet = this.localStorageScreen == 'wallet' ? true : false;
    @track showNewSupportTicketError = false;
    @track showAddMoneyError = false;
    @track showGiveReview = false;
    @track showCreateNewCase = false;
    @track showAddMoneyScreen = this.localStorageScreen == 'addMoney' ? true : false;
    @track showOtpVarificationScreen = false;
    @track showBookingCancelationModal = false;
    @track showCancelbookingButton = false;
    @track userDetailsEditClicked = false;
    @track isResendDisabled = false;
    @track bookingsFilterTabs = {
        all : true,
        recent : false,
        past : false,
        upcoming : false,
        canceled : false,
    }
    @track resendTimer = 0;
    @track resendInterval;
    @track profileDetails;
    @track gotAccRecord;
    @track gotBookings;
    @track gotCases;
    @track gotTransactions;
    //////////////////review /////////////////////
    @track ValueForMoney;
    @track CleanlinessAndHygiene;
    @track FoodQuality;
    @track Hospitality;
    @track ReviewHeading = '';
    @track ReviewDescription;
    @track review = 'hide-review';
    @track reviewItemClass = 'hide-review';
    @track reviewDetails = {};
    @track serializeData;
    @track giveReviewHotelId;
    @track reviews;
    @track reviewId;
    @track addMoneyAmount = '';
    @track otp = '';
    /////////////////////////////////////////////////
    @track userDetails = {
        firstName: '',
        lastName: '',
        email: '',
        contact: '',
    }
    @track newSupportTicket = {
        orderId: '',
        subject: '',
        description: '',
    }
    @track userDetailsCopy = {
        firstName: '',
        lastName: '',
        email: '',
        contact: '',
    }
    orderNumber;
    @track walletAmount;
    @track originalBookings = [];
    @track bookings = [];
    @track booking = {};
    @track bookingOrderId;
    @track supportTickets = [];
    @track transactions = [];
    @track newSupportTicketError;
    @track addMoneyError;
    @track showLoadingSpinner = false;
    columns = [
        { label: 'Transaction No.', fieldName: 'transactionNumber', iconName: 'utility:number_input', iconPosition : 'left',},
        { label: 'Date', fieldName: 'date', type: 'date',   iconName: 'utility:event', iconPosition : 'left',},
        { label: 'Deposit', fieldName: 'deposit', type: 'currency',  iconName: 'utility:new', iconPosition : 'left',},
        { label: 'Withdrawal', fieldName: 'withdrawal', type: 'currency',  iconName: 'utility:ban', iconPosition : 'left',},
        { label: 'Closing Balance', fieldName: 'closingBalance', type: 'currency',  iconName: 'utility:currency', iconPosition : 'left',},
    ];
    data = [];
    get userDetailsIconClass() {
        return this.showUserDetails ? 'res-profile-tab-icon res-profile-tab-icon-active' : 'res-profile-tab-icon';
    }
    get bookingsIconClass() {
        return this.showBookings || this.showBookingDetails ? 'res-profile-tab-icon res-profile-tab-icon-active' : 'res-profile-tab-icon';
    }
    get walletIconClass() {
        return this.showWallet || this.showAddMoneyScreen || this.showOtpVarificationScreen ? 'res-profile-tab-icon res-profile-tab-icon-active' : 'res-profile-tab-icon';
    }
    get supportTicketsIconClass() {
        return this.showSupportTickets ? 'res-profile-tab-icon res-profile-tab-icon-active' : 'res-profile-tab-icon';
    }
    get userDetailsNameClass() {
        return this.showUserDetails ? 'res-profile-tab-name res-profile-tab-name-active' : 'res-profile-tab-name';
    }
    get bookingsNameClass() {
        return this.showBookings || this.showBookingDetails ? 'res-profile-tab-name res-profile-tab-name-active' : 'res-profile-tab-name';
    }
    get walletNameClass() {
        return this.showWallet || this.showAddMoneyScreen || this.showOtpVarificationScreen ? 'res-profile-tab-name res-profile-tab-name-active' : 'res-profile-tab-name';
    }
    get supportTicketsNameClass() {
        return this.showSupportTickets ? 'res-profile-tab-name res-profile-tab-name-active' : 'res-profile-tab-name';
    }
    get firstNameInputClass() {
        return this.userDetailsEditClicked ? 'res-firstname-input' : 'res-firstname-input pointer-events-disabled';
    }
    get lastNameInputClass() {
        return this.userDetailsEditClicked ? 'res-lastname-input' : 'res-lastname-input pointer-events-disabled';
    }
    get emailInputClass() {
        return this.userDetailsEditClicked ? 'res-email-input' : 'res-email-input pointer-events-disabled';
    }
    get contactInputClass() {
        return this.userDetailsEditClicked ? 'res-contact-input' : 'res-contact-input pointer-events-disabled';
    }
    get userDetailsTabClass() {
        return this.showUserDetails ? 'res-profile-tab res-profile-tab-active' : 'res-profile-tab';
    }
    get bookingsTabClass() {
        return this.showBookings || this.showBookingDetails ? 'res-profile-tab res-profile-tab-active' : 'res-profile-tab';
    }
    get walletTabClass() {
        return this.showWallet || this.showAddMoneyScreen || this.showOtpVarificationScreen ? 'res-profile-tab res-profile-tab-active' : 'res-profile-tab';
    }
    get supportTicketsTabClass() {
        return this.showSupportTickets ? 'res-profile-tab res-profile-tab-active' : 'res-profile-tab';
    }
    get resCreateCaseItemClass() {
        return this.showCreateNewCase ? 'res-create-case-item-class' : 'hide-review';
    }
    get addMoneyErrorClass() {
        return this.showAddMoneyError ? 'res-new-case-error' : 'hide-review';
    }
    get resCancelOrderModalClass(){
        return this.showBookingCancelationModal ? 'res-cancel-booking-modal-layout-class' : 'hide-review';
    }
    get resBookingDetailsFilterOptionAllClass(){
        return this.bookingsFilterTabs.all ? 'res-user-details-button res-user-details-button-active'  : 'res-user-details-button';
    }
    get resBookingDetailsFilterOptionRecentClass(){
        return this.bookingsFilterTabs.recent ? 'res-user-details-button res-user-details-button-active'  : 'res-user-details-button';
    }
    get resBookingDetailsFilterOptionPastClass(){
        return this.bookingsFilterTabs.past ? 'res-user-details-button res-user-details-button-active'  : 'res-user-details-button';
    }
    get resBookingDetailsFilterOptionUpcomingClass(){
        return this.bookingsFilterTabs.upcoming ? 'res-user-details-button res-user-details-button-active'  : 'res-user-details-button';
    }
    get resBookingDetailsFilterOptionCanceledClass(){
        return this.bookingsFilterTabs.canceled ? 'res-user-details-button res-user-details-button-active'  : 'res-user-details-button';
    }
    connectedCallback() {
        try {
            getProfileDetails().then(result => {
                console.log('inside connected callbackkkk');

                this.profileDetails = result;
                console.log('profile details : ', result);
                console.log('profile details acc rec : ', result.accRecord);
                console.log('profile details caselist : ', result.caseList);
                console.log('profile details orderlist : ', result.orderList);
                console.log('profile details transactionList : ', result.transactionList);

                if (result.accRecord) {
                    this.gotAccRecord = true;
                    this.userDetails.firstName = result.accRecord.FirstName;
                    this.userDetails.lastName = result.accRecord.LastName;
                    this.userDetails.email = result.accRecord.PersonEmail;
                    this.userDetails.contact = result.accRecord.Phone;
                    this.userDetailsCopy = this.userDetails;
                    this.walletAmount = result.accRecord.Wallet__c;
                }
                if (result.reviewList) {
                    this.reviews = result.reviewList;
                }
                if (result.orderList) {
                    this.gotBookings = true;
                    result.orderList.forEach(booking => {
                        this.originalBookings.push({
                            createdDate: (new Date(booking.CreatedDate)).toString().substring(0, 24),
                            hotelName: booking.OrderItems[0].Product2.Hotel__r.Name,
                            hotelImg: booking.OrderItems[0].Product2.Hotel__r.Banner_Photo_Url__c,
                            hotelUniqueName: booking.OrderItems[0].Product2.Hotel__r.Unique_Hotel_Name__c,
                            checkinDate: booking.OrderItems[0].checkin__c,
                            checkoutDate: booking.OrderItems[0].checkout__c,
                            totalCost: booking.TotalAmount,
                            status: (booking.Status == 'Shipped' ? 'Booked' : booking.Status == 'Delivered' ? 'Completed' : booking.Status == 'Canceled' ? 'Canceled' : ''),
                            orderId: booking.OrderNumber,
                            orderItems: booking.OrderItems,
                            hotelId: booking.OrderItems[0].Product2.Hotel__c,
                            review: this.reviews ? (this.reviews.find(review => review.Hotel__c == booking.OrderItems[0].Product2.Hotel__c) ? this.reviews.find(review => review.Hotel__c == booking.OrderItems[0].Product2.Hotel__c) : null) : null,
                            reviewAccess: this.reviews ? (((new Date(booking.OrderItems[0].checkout__c.toString()) <= new Date()) && (!this.reviews.find(review => review.Hotel__c == booking.OrderItems[0].Product2.Hotel__c))) ? true : false) : (new Date(booking.OrderItems[0].checkout__c.toString()) <= new Date()) ? true : false,
                            id : booking.Id,
                            showCancelBookingButton : (booking.Status == 'Shipped' && new Date() < new Date(booking.OrderItems[0].checkin__c.toString())) ? true : false,
                        });
                        this.orderNumber = booking.OrderNumber;

                    });
                    this.originalBookings.sort(function (a, b) {
                        return new Date(b.createdDate) - new Date(a.createdDate);
                    });
                    this.bookings = this.originalBookings;
                }
                if (result.caseList) {
                    this.gotCases = true;
                    this.supportTickets = result.caseList;
                    let tempSupportTickets = [...this.supportTickets];
                    tempSupportTickets.forEach(st => {
                        if (!st.Order__c) {
                            st.Order__c = 'Null';
                            st.Order__r = {OrderNumber : 'General Inquiry'};
                        }
                        st.CreatedDate = st.CreatedDate.substring(0,10) + ' ' + st.CreatedDate.substring(11,19);
                    });
                    
                    this.supportTickets = tempSupportTickets;
                    console.log('support tickets : ', JSON.stringify(this.supportTickets));
                    
                    
                }
                if(result.transactionList){
                    this.gotTransactions = true;
                    this.transactions = result.transactionList;
                    this.transactions.sort(function (a, b) {
                        return new Date(b.CreatedDate) - new Date(a.CreatedDate);
                    });
                    this.transactions.forEach(tr => {
                        // if (tr.Type__c == 'Deposit') {
                        //     tr.isDeposit = true;
                        //     tr.isWithdrawal = false;
                        // }
                        // else if(tr.Type__c == 'Withdrawal'){
                        //     tr.isDeposit = false;
                        //     tr.isWithdrawal = true;
                        // }
                        this.data.push({
                            transactionNumber : tr.Name, date : tr.Date__c , deposit : (tr.Type__c == 'Deposit') ? tr.Amount__c : '', withdrawal : (tr.Type__c == 'Withdrawal') ? tr.Amount__c : '', closingBalance : tr.Closing_Balance__c,
                        })
                    })
                    
                    console.log('after sorting : ', JSON.stringify(this.transactions));
                    
                }
                if(localStorage.getItem("profileScreen")){
                    this.localStorageScreen = localStorage.getItem("profileScreen");
                    this.showUserDetails = this.localStorageScreen == 'userDetails' ? true : false;
                    this.showBookings = this.localStorageScreen == 'bookings' ? true : false;
                    this.showBookingDetails = this.localStorageScreen == 'bookingDetails' ? true : false;
                    this.showSupportTickets = this.localStorageScreen == 'supportTickets' ? true : false;
                    this.showWallet = this.localStorageScreen == 'wallet' ? true : false;
                    this.showAddMoneyScreen = this.localStorageScreen == 'addMoney' ? true : false;
                }
                localStorage.removeItem("profileScreen");
            }).catch(error => {
                console.log('Error on getUserDetails : ', JSON.stringify(error));
            });

            Promise.all([
                loadScript(this, FontAwesome + "/all.js"),
            ]).then(() => {
                Promise.all([
                    loadStyle(this, FontAwesome + "/all.css"),
                ]).then(() => {
                    console.log('successfully loaded');

                })
            }).catch(error => {
                {
                    console.log('error in font awesome : ', JSON.stringify(error.message));

                }
            });

        }
        catch (error) {
            console.log('Error on getUserDetails : ', JSON.stringify(error.message));

        }
    }
    handleChange(event) {
        let { fieldName, fieldValue } = event.detail;
        this.userDetailsCopy = { ...this.userDetailsCopy, [fieldName]: fieldValue };
    }
    handleAmountChange(event) {
        let { fieldValue } = event.detail;
        this.addMoneyAmount = fieldValue;
    }
    handleNewSupportTicketChange(event) {
        let { name, value } = event.target;
        this.newSupportTicket = { ...this.newSupportTicket, [name]: value };

        console.log(JSON.stringify(this.newSupportTicket));
    }
    handleCreateNewCaseButton() {
        this.showCreateNewCase = true;
        this.newSupportTicket = { ...this.newSupportTicket, orderId: this.booking.orderId };
    }
    handleNewSupportTicketSubmit() {
        if (!this.newSupportTicket.orderId || !this.newSupportTicket.subject || !this.newSupportTicket.description) {
            this.showNewSupportTicketError = true;
            this.newSupportTicketError = 'Please fill all details';
            return;
        }
        else if (!this.bookings.find(booking => {
            return booking.orderId == this.newSupportTicket.orderId;
        })) {
            this.showNewSupportTicketError = true;
            this.newSupportTicketError = 'Please enter correct Booking No.';
            return;
        }
        else {
            this.showLoadingSpinner = true;
            this.showNewSupportTicketError = false;
            createCase({ myObjectJson: JSON.stringify(this.newSupportTicket) })
                .then(result => {
                    console.log('success : ', result);
                    const event = new ShowToastEvent({
                        title: 'Success!',
                        message:
                            'Case Created Successfully!',
                        variant: 'success',
                        mode: 'dismissable',

                    });
                    this.dispatchEvent(event);

                }).then(() => {
                    this.showLoadingSpinner = false;
                    localStorage.setItem("profileScreen","supportTickets");
                    location.reload();
                }).catch(error => {
                    this.showLoadingSpinner = false;
                    console.log('error : ', JSON.stringify(error));
                    const event = new ShowToastEvent({
                        title: 'Error!',
                        message: 'Case was not created, please try again!',
                        variant: 'error',
                        mode: 'dismissable',
                    });
                    this.dispatchEvent(event);
                });
            this.showCreateNewCase = false;

        }
    }
    handleNewSupportTicketCancel() {
        this.showCreateNewCase = false;
    }
    handleUserDetails() {
        this.showUserDetails = true;
        this.showBookings = false;
        this.showSupportTickets = false;
        this.showWallet = false;
        this.showBookingDetails = false;
        this.showAddMoneyScreen = false;
        this.showOtpVarificationScreen = false;
    }
    handleBookings() {
        this.showUserDetails = false;
        this.showBookings = true;
        this.showSupportTickets = false;
        this.showWallet = false;
        this.showBookingDetails = false;
        this.showAddMoneyScreen = false;
        this.showOtpVarificationScreen = false;
    }
    handleWallet() {
        this.showUserDetails = false;
        this.showBookings = false;
        this.showSupportTickets = false;
        this.showWallet = true;
        this.showBookingDetails = false;
        this.showAddMoneyScreen = false;
        this.showOtpVarificationScreen = false;
    }
    handleSupportTickets() {
        this.showUserDetails = false;
        this.showBookings = false;
        this.showSupportTickets = true;
        this.showWallet = false;
        this.showBookingDetails = false;
        this.showAddMoneyScreen = false;
        this.showOtpVarificationScreen = false;
    }
    handleBookingDetails(event) {
        this.showUserDetails = false;
        this.showBookings = false;
        this.showSupportTickets = false;
        this.showWallet = false;
        this.showBookingDetails = true;
        this.showAddMoneyScreen = false;
        this.showOtpVarificationScreen = false;
        this.booking = this.bookings.find(booking => {
            return booking.orderId == event.target.dataset.orderid;
        });
        console.log(JSON.stringify(this.booking));
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    handleAddMoney() {
        this.showUserDetails = false;
        this.showBookings = false;
        this.showSupportTickets = false;
        this.showWallet = false;
        this.showBookingDetails = false;
        this.showAddMoneyScreen = true;
        this.showOtpVarificationScreen = false;
    }
    handleProceedPayment() {
        if (!this.addMoneyAmount) {
            this.addMoneyError = 'Please enter amount to add';
            this.showAddMoneyError = true;
            return;
        }
        else if (isNaN(this.addMoneyAmount)) {
            this.addMoneyError = 'Please enter valid amount';
            this.showNewSupportTicketError = true;
            return;
        }
        else {
            this.showLoadingSpinner = true;
            generateOTP({ emailAddress: this.userDetails.email })
                .then(result => {
                    this.showLoadingSpinner = false;
                    this.showToast('success', 'OTP Sent!', `The OTP has been sent to email ${this.userDetails.email}!`);
                })
                .catch(error => {
                    this.showLoadingSpinner = false;
                    this.showToast('error', 'OTP not sent!', 'There was an error sending OTP. Please try again after some time!');
                });
            this.showAddMoneyError = false;
            this.showUserDetails = false;
            this.showBookings = false;
            this.showSupportTickets = false;
            this.showWallet = false;
            this.showBookingDetails = false;
            this.showAddMoneyScreen = false;
            this.showOtpVarificationScreen = true;
        }
    }
    handleCancelBooking(){
        this.showBookingCancelationModal = true;
    }
    handleCancelOrderCancel(){
        this.showBookingCancelationModal = false;
    }
    handleCancelOrderConfirmation(event){
        this.showLoadingSpinner = true;
        const orderId = this.bookings.find(booking => booking.orderId == event.target.dataset.orderid).id;
        cancelOrder({orderId : orderId})
        .then(result => {
            if(result){
                this.showToast('success','Order Canceled','Your order has been successfully canceled!');
                this.showLoadingSpinner = false;
                localStorage.setItem("profileScreen","bookings");
                localStorage.setItem("bookingNo",orderId);
                this[NavigationMixin.Navigate]({
                    type: 'standard__webPage',
                    attributes: {
                        url: 'https://respira-dev.my.site.com/respira/s/profile',
                        target: '_self',
                    },
                });
            }
            else{
                throw 'Order Cancelation failed! Please try after some time';
            }
        }).catch(error => {
            this.showLoadingSpinner = false;
            this.showToast('error', 'Error in Order Cancelation', error);
        });
        this.showBookingCancelationModal = false;
    }
    handleOtpChange(event) {
        this.otp = event.detail.fieldValue;
    }
    onVerify() {
        this.showLoadingSpinner = true;
        verifyOTP({ enteredOTP: this.otp })
            .then(result => {
                if (result) {
                    this.showLoadingSpinner = false;
                    localStorage.setItem("profileScreen", "wallet");
                    this.showToast('success', 'OTP Verified!', 'Adding money to your wallet...');
                    if (addMoneyToWallet({ amount: Number(this.addMoneyAmount) })) {
                        this.showToast('success', 'Transaction Successful', 'Your money has been added to wallet');
                    }

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
    onResend() {
            if (this.isResendDisabled) return;
            this.showLoadingSpinner = true;
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
    showToast(variant, title, message) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
    handleFirstNameInputChange(event) {
        this.firstNameInput = event.target.value;
    }
    handleLastNameInputChange(event) {
        this.lastNameInput = event.target.value;
    }
    handleEmailInputChange(event) {
        this.emailInput = event.target.value;
    }
    handleContactInputChange(event) {
        this.contactInput = event.target.value;
    }
    handleUserDetailsEditButton() {
        this.userDetailsEditClicked = true;
    }
    handleUserDetailsCancelButton() {
        this.userDetailsEditClicked = false;
        this.userDetailsCopy = this.userDetails;
    }
    handleUserDetailsSaveButton() {
        this.userDetailsEditClicked = false;
        if (this.userDetails === this.userDetailsCopy) {
            return;
        }
        else {
            this.showLoadingSpinner = true;
            updateAccountRecord({ myObjectJson: JSON.stringify(this.userDetailsCopy) })
                .then(result => {

                    this.userDetails = this.userDetailsCopy;
                    console.log('result ', result);
                    const event = new ShowToastEvent({
                        title: 'Success!',
                        message:
                            'User Details Updated Successfully',
                        variant: 'success',
                        mode: 'dismissable',
                    });
                    this.dispatchEvent(event);
                    location.reload();
                }).then(() => {
                    this.showLoadingSpinner = false;
                })
                .catch(error => {
                    this.showLoadingSpinner = false;
                    this.userDetailsCopy = this.userDetails;
                    console.log('error : ', JSON.stringify(error));
                    const event = new ShowToastEvent({
                        title: 'Oops!',
                        message:
                            'Unable to update User Details, Try after some time',
                        variant: 'error',
                        mode: 'dismissable',
                    });
                    this.dispatchEvent(event);
                })
        }
    }
    handleBookAgain(event) {
        console.log(event.target.dataset.hotel);
        let hotelUniqueName = event.target.dataset.hotel;
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `https://respira-dev.my.site.com/respira/s/hotel?hotelUniqueName=${hotelUniqueName}`,
                target: '_self'
            }
        });
    }
    handleInvoiceDownload(event) {
        let tempOrderId = this.bookings.find(booking => {
            return booking.orderId == event.target.dataset.orderid;
        }).id;

        // if (tempOrderId) {
        //     getInvoiceFileURL({ orderId: tempOrderId })
        //         .then(result => {
        //             if (result) {
        //                 window.open(result, '_blank');
        //                 console.log('Invoice download initiated.');
        //             } else {
        //                 console.error('Error getting invoice file URL.');
        //             }
        //         })
        //         .catch(error => {
        //             console.error('Error calling getInvoiceFileURL:', error.message);
        //         });
        // } else {
        //     console.warn('Order ID not found.');
        // }

        // this[NavigationMixin.Navigate]({ type: 'standard__webPage', attributes: { url: `https://respira-dev--c.vf.force.com/apex/resHotelInvoicePDF?id=${tempOrderId}`} });
        // try{
        //     if (tempOrderId) {
        //         generateInvoicePDF({ orderId: tempOrderId })
        //             .then(result => {
        //                 if (result) {
        //                     this.downloadBase64(this.orderNumber + '_Invoice.pdf', result);
        //                     console.log('Invoice downloaded successfully');
        //                 } else {
        //                     console.error('Error generating or retrieving PDF.');
        //                 }
        //             })
        //             .catch(error => {
        //                 console.error('Error calling generateInvoicePDF:', error.message);
        //             });
        //     } else {
        //         console.warn('Order ID not found. Cannot download invoice.');
        //     }
        //     // this.downloadPDF(`https://respira-dev--c.vf.force.com/apex/resHotelInvoicePDF?id=${tempOrderId}`, 'myfile.pdf')
        // }
        // catch(error){
        //     console.log('error on downloading : ', error.message);
            
        // }
    }



    // downloadBase64(filename, base64Data) {
    //     const link = document.createElement('a');
    //     link.href = `data:application/pdf;base64,${base64Data}`;
    //     link.download = filename;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // }
    // downloadPDF(pdfUrl, fileName = 'download.pdf') {
    //     const link = document.createElement('a');
    //     link.href = pdfUrl;
    //     link.download = fileName;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // }
    handleBookingDetailsFilterChange(event){
        let key = event.target.dataset.filteroption;
        let tempBookingsFilterTabs = {...this.bookingsFilterTabs};
        Object.keys(tempBookingsFilterTabs).forEach(v => tempBookingsFilterTabs[v] = false);
        this.bookingsFilterTabs = { ...tempBookingsFilterTabs, [key] : true };
        this.applyFilterChange(key);
    }
    applyFilterChange(key){
        if (key == 'all') {
            this.bookings = this.originalBookings;
        }
        else if(key == 'recent'){
            this.bookings = this.originalBookings.filter(booking => {
                return (booking.status != 'Canceled') && ((new Date(booking.createdDate) > new Date(new Date().getTime() -  24 * 60 * 60 * 1000)) || (new Date(booking.checkoutDate) > new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000) && new Date(booking.checkoutDate) < new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)));
            })
        }
        else if(key == 'past'){
            this.bookings = this.originalBookings.filter(booking => {
                return new Date(booking.checkoutDate) <= new Date();
            })
        }
        else if(key == 'upcoming'){
            this.bookings = this.originalBookings.filter(booking => {
                return (booking.status != 'Canceled') && (new Date(booking.checkinDate) > new Date());
            })
        }
        else if(key == 'canceled'){
            this.bookings = this.originalBookings.filter(booking => {
                return booking.status == 'Canceled';
            })
        }
    }
    //////////////////review ////////////////////////


    handleGiveReviewButton(event) {
        this.showGiveReview = true;
        this.review = 'show-review';
        this.reviewItemClass = 'review-full-screen-container';
        console.log('Button Clicked');
        try {
            this.giveReviewHotelId = event.target.dataset.hotelid;
            if (this.reviews.find(review => review.Hotel__c == this.giveReviewHotelId)) {
                const review = this.reviews.find(review => review.Hotel__c == this.giveReviewHotelId);
                this.reviewId = review.Id;
                this.ValueForMoney = review.Value_For_Money__c;
                this.FoodQuality = review.Food_Quality__c;
                this.Hospitality = review.Hospitality__c,
                    this.CleanlinessAndHygiene = review.Cleanliness_And_Hygiene__c;
                this.template.querySelector(`[data-id="star${this.ValueForMoney}"]`).checked = true;
                this.template.querySelector(`[data-id="star1${this.CleanlinessAndHygiene}"]`).checked = true;
                this.template.querySelector(`[data-id="star2${this.FoodQuality}"]`).checked = true;
                this.template.querySelector(`[data-id="star3${this.Hospitality}"]`).checked = true;
                this.ReviewHeading = review.Review_Title__c;
                this.ReviewDescription = review.Description__c;
                this.template.querySelector('[data-id="ratingdescription"]').value = this.ReviewDescription;
            }
            else {
                this.reviewId = null;
                this.template.querySelector(`[data-id="star${this.ValueForMoney}"]`).checked = false;
                this.template.querySelector(`[data-id="star1${this.CleanlinessAndHygiene}"]`).checked = false;
                this.template.querySelector(`[data-id="star2${this.FoodQuality}"]`).checked = false;
                this.template.querySelector(`[data-id="star3${this.Hospitality}"]`).checked = false;
                this.ValueForMoney = 0;
                this.FoodQuality = 0;
                this.Hospitality = 0,
                    this.CleanlinessAndHygiene = 0;
                this.ReviewHeading = '';
                this.template.querySelector('[data-id="ratingdescription"]').value = '';

            }
        } catch (error) {
            console.log(error.message);

        }
        console.log(this.giveReviewHotelId);

    }
    rating(event) {
        console.log('inside event');
        console.log(event.target.name, event.target.value);

        if (event.target.name === "ValueForMoney") {
            this.ValueForMoney = event.target.value;
        }
        if (event.target.name === "FoodQuality") {
            this.FoodQuality = event.target.value;
        }
        if (event.target.name === "Hospitality") {
            this.Hospitality = event.target.value;
        }
        if (event.target.name === "CleanlinessAndHygiene") {
            this.CleanlinessAndHygiene = event.target.value;
        }
    }
    handleHeading(event) {
        this.ReviewHeading = event.target.value;
    }
    handleDescription(event) {
        this.ReviewDescription = event.target.value;
    }
    handleOkay() {
        this.showLoadingSpinner = true;
        localStorage.setItem("profileScreen","bookings");
        this.showGiveReview = false;
        this.review = 'hide-review';
        this.reviewItemClass = 'hide-review';

        console.log(this.giveReviewHotelId);
        this.reviewDetails.CleanlinessAndHygiene = this.CleanlinessAndHygiene;
        this.reviewDetails.ValueForMoney = this.ValueForMoney;
        this.reviewDetails.FoodQuality = this.FoodQuality;
        this.reviewDetails.Hospitality = this.Hospitality;
        this.reviewDetails.ReviewHeading = this.ReviewHeading;
        this.reviewDetails.ReviewDescription = this.ReviewDescription;
        this.reviewDetails.HotelId = this.giveReviewHotelId;
        this.reviewDetails.reviewId = this.reviewId;
        this.serializeData = JSON.stringify(this.reviewDetails);
        console.log(this.serializeData);

        addReview({ reviewDetails: this.serializeData }).then(() => {
            console.log("Data Successfully Saved");
            const event = new ShowToastEvent({
                title: 'Success!',
                message: 'Your Review Was Submitted Successfully',
                variant: 'success',
                mode: 'dismissable',
            });
            this.dispatchEvent(event);
            localStorage.setItem("profileScreen", "bookings");
            location.reload();
        }).then(()=>{
            this.showLoadingSpinner = false;
        })
        .catch((e) => {
            this.showLoadingSpinner = false;
            console.log("Error in data saving" + JSON.stringify(e));
        });

    }
    handleClose() {
        this.showGiveReview = false;
        this.review = 'hide-review';
        this.reviewItemClass = 'hide-review';
    }
}