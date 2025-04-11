import { LightningElement, track, wire } from 'lwc';

export default class ResProfile extends LightningElement {

    @track showUserDetails = true;
    @track showBookings = false;
    @track showSupportTickets = false;
    @track showWallet = false;
    @track firstNameInput = '';
    @track lastNameInput = '';
    @track emailInput = '';
    @track contactInput = '';
    @track userDetailsEditClicked = false;
    userDetails = {
        firstName : '',
        lastName : '',
        email : '',
        contact : '',
    }
    get userDetailsIconClass(){
        return this.showUserDetails ? 'res-profile-tab-icon-active' : 'res-profile-tab-icon';
    }
    get bookingsIconClass(){
        return this.showBookings ? 'res-profile-tab-icon-active' : 'res-profile-tab-icon';
    }
    get walletIconClass(){
        return this.showWallet ? 'res-profile-tab-icon-active' : 'res-profile-tab-icon';
    }
    get supportTicketsIconClass(){
        return this.showSupportTickets ? 'res-profile-tab-icon-active' : 'res-profile-tab-icon';
    }
    get userDetailsNameClass(){
        return this.showUserDetails ? 'res-profile-tab-name-active' : 'res-profile-tab-name';
    }
    get bookingsNameClass(){
        return this.showBookings ? 'res-profile-tab-name-active' : 'res-profile-tab-name';
    }
    get walletNameClass(){
        return this.showWallet ? 'res-profile-tab-name-active' : 'res-profile-tab-name';
    }
    get supportTicketsNameClass(){
        return this.showSupportTickets ? 'res-profile-tab-name-active' : 'res-profile-tab-name';
    }
    get firstNameInputClass(){
        return this.userDetailsEditClicked ? 'res-firstname-input' : 'res-firstname-input pointer-events-disabled';
    }
    get lastNameInputClass(){
        return this.userDetailsEditClicked ? 'res-lastname-input' : 'res-lastname-input pointer-events-disabled';
    }
    get emailInputClass(){
        return this.userDetailsEditClicked ? 'res-email-input' : 'res-email-input pointer-events-disabled';
    }
    get contactInputClass(){
        return this.userDetailsEditClicked ? 'res-contact-input' : 'res-contact-input pointer-events-disabled';
    }
    handleChange(event) {
        let { fieldName, fieldValue } = event.detail;
        this.userDetails = { ...this.userDetails, [fieldName]: fieldValue };
    }
    handleUserDetails(){
        this.showUserDetails = true;
        this.showBookings = false;
        this.showSupportTickets = false;
        this.showWallet = false;
    }
    handleBookings(){
        this.showUserDetails = false;
        this.showBookings = true;
        this.showSupportTickets = false;
        this.showWallet = false;
    }
    handleWallet(){
        this.showUserDetails = false;
        this.showBookings = false;
        this.showSupportTickets = false;
        this.showWallet = true;
    }
    handleSupportTickets(){
        this.showUserDetails = false;
        this.showBookings = false;
        this.showSupportTickets = true;
        this.showWallet = false
    }
    handleFirstNameInputChange(event){
        this.firstNameInput = event.target.value;
    }
    handleLastNameInputChange(event){
        this.lastNameInput = event.target.value;
    }
    handleEmailInputChange(event){
        this.emailInput = event.target.value;
    }
    handleContactInputChange(event){
        this.contactInput = event.target.value;
    }
    handleUserDetailsEditButton(){
        this.userDetailsEditClicked = true;
    }
    handleUserDetailsCancelButton(){
        this.userDetailsEditClicked = false;
    }
    handleUserDetailsSaveButton(){
        this.userDetailsEditClicked = false;
    }

}