import { api, LightningElement, track } from 'lwc';

export default class ResSearchComponent extends LightningElement {

    d = new Date();
    tomorrow  = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    @api localStorageStartDate;
    @api localStorageEndDate;
    @api localStorageInput;
    @api placeholderText;
    currentDate = this.d.getDate();
    currentMonth = this.d.getMonth();
    currentYear = this.d.getFullYear();
    @track selectedMonth = this.currentMonth;
    @track selectedMonthString = this.months[this.selectedMonth];
    selectedYear = this.currentYear;
    noOfDaysInTheMonth;
    daysAtBegin;
    daysAtEnd;
    @track daysList = [];
    // @track startDate = (this.localStorageStartDate ? this.localStorageStartDate : this.formatDate(this.d.getFullYear(), (this.d.getMonth() + 1), this.d.getDate())); 
    // @track endDate = (this.localStorageEndDate ? this.localStorageEndDate : this.formatDate(this.tomorrow.getFullYear(), (this.tomorrow.getMonth() + 1), this.tomorrow.getDate()));
    @track showCalendar = false;
    @api picklistValues = [];
    dropDownList= [];
    @track inputText = '';
    showDropDown= false;
    showErrorMsg= false;
    firstLoadInput = true;
    firstLoadDate = true;
    // @track currentStartDate = this.localStorageStartDate ? this.localStorageStartDate : this.formatDate(this.d.getFullYear(), (this.d.getMonth() + 1), this.d.getDate());
    @track currentStartDate = this.formatDate(this.d.getFullYear(), (this.d.getMonth() + 1), this.d.getDate());
    // @track currentEndDate = this.localStorageEndDate ? this.localStorageEndDate : this.formatDate(this.tomorrow.getFullYear(), (this.tomorrow.getMonth() + 1), this.tomorrow.getDate());
    @track currentEndDate = this.formatDate(this.tomorrow.getFullYear(), (this.tomorrow.getMonth() + 1), this.tomorrow.getDate());
    get ErrorMsgCss(){
        if(this.showErrorMsg){
            return "res-search-error-msg";
        }
        else{
            return 'res-search-error-msg-hidden';
        }
    }
    get placeholder(){
        return this.placeholderText ? this.placeholderText : 'Search';
    }
    get searchInput(){
        return this.firstLoadInput ? (this.localStorageInput ? this.localStorageInput:'') : this.inputText ? this.inputText : '';
    }
    get startDate(){
        return this.localStorageStartDate ? (this.firstLoadDate ? this.localStorageStartDate : this.currentStartDate) : this.currentStartDate;
    }
    set startDate(value){
        this.currentStartDate = value;
    }
    get endDate(){
        return this.localStorageStartDate ? (this.firstLoadDate ? this.localStorageEndDate : this.currentEndDate) : this.currentEndDate;
    }
    set endDate(value){
        this.currentEndDate = value;
    }
    handleForwardMonth(){
        if (this.selectedMonth == 11) {
            this.selectedMonth = 0;
            this.selectedYear++;
        }
        else{
            this.selectedMonth++;
        }
        this.selectedMonthString = this.months[this.selectedMonth];
        this.handleMonthChange();
    }
    handleBlur() {
        
        this.showCalendar = false;
    }
    toggleCalendar(event) {
        
        // this.currentStartDate = this.localStorageStartDate ? this.localStorageStartDate : this.formatDate(this.d.getFullYear(), (this.d.getMonth() + 1), this.d.getDate());
        // this.currentEndDate = this.localStorageEndDate ? this.localStorageEndDate : this.formatDate(this.tomorrow.getFullYear(), (this.tomorrow.getMonth() + 1), this.tomorrow.getDate());
        this.handleMonthChange();
        this.showCalendar = true;
    }
    handleBackMonth(){
        if (this.selectedMonth == 0) {
            this.selectedMonth = 11;
            this.selectedYear--;
        }
        else{
            this.selectedMonth--;
        }
        this.selectedMonthString = this.months[this.selectedMonth];
        this.handleMonthChange();

    }
    handleMonthChange(){
        this.daysList = [];
        this.daysAtBegin  = new Date(this.selectedYear, this.selectedMonth, 1).getDay();
        this.noOfDaysInTheMonth = new Date(this.selectedYear, Number(this.selectedMonth) + 1, 0).getDate();
        let currentDate = new Date(this.currentYear, this.currentMonth, this.currentDate);
        
        this.daysAtEnd = (this.noOfDaysInTheMonth + this.daysAtBegin < 35 ) ? (35 - (this.daysAtBegin + this.noOfDaysInTheMonth)) : ((this.noOfDaysInTheMonth + this.daysAtBegin > 35) ? (42 - (this.daysAtBegin + this.noOfDaysInTheMonth)) : 0);
        for(let i = 0; i < this.daysAtBegin; i++){
            this.daysList.push({date : '', dateKey : null , className:'res-calendar-grid-item selectNone'});
        }
        for(let i = 1; i <= this.noOfDaysInTheMonth; i++){
            let dateKey = this.formatDate(this.selectedYear, this.selectedMonth, i);
            let selectedDate = new Date(this.selectedYear, this.selectedMonth, i);
            let className = 'res-calendar-grid-item';
            
            if(selectedDate < currentDate){
                className += ' selectNone pointerDisabled';
            }

            if (this.startDate && this.endDate && dateKey >= this.startDate && dateKey <= this.endDate) {
                className += ' DateSelected'
            }
            if(this.startDate == dateKey) className += ' DateSelected';
            this.daysList.push({date : i, dateKey, className});
        }
        for(let i = 0; i < this.daysAtEnd; i++){
            this.daysList.push({date : '', dateKey : null , className:'res-calendar-grid-item selectNone'});
        }
    }
    formatDate(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    handleDayClick(event){
        const selectedDate = event.target.dataset.item;
        
        if (!selectedDate) return;

        console.log(selectedDate);
        
        if (!this.startDate || (this.startDate && this.endDate)) {
            this.startDate = selectedDate;
            this.endDate = null;
        } else if (!this.endDate && selectedDate > this.startDate) {
            this.endDate = selectedDate;
            this.showCalendar = false;
        } else if (!this.endDate && selectedDate == this.startDate) {
            this.startDate = null;
        }else {
            this.startDate = selectedDate;
            this.endDate = null;
        }
        console.log(this.startDate, 'startdate');
        console.log(this.endDate, 'endDate');
        console.log(this.inputText,'inputText');
        
        this.firstLoadDate = false;
        this.handleMonthChange();
    }
    handleBookNow(event){
        if (!this.searchInput || !this.startDate || !this.endDate) {
            this.showErrorMsg = true;
            console.log(this.localStorageInput);
            console.log(this.localStorageStartDate);
            console.log(this.localStorageEndDate);
        }
        else{
            this.dispatchEvent(new CustomEvent('bookbuttonclick', {detail : {searchInput : this.searchInput, startDate : this.startDate, endDate : this.endDate}}));
            
        }
    }

    handleInput(event){
        this.firstLoadInput = false;
        // this.searchInput = event.target.value;
        this.inputText = event.target.value;
        if (this.inputText.length > 0) {
            this.showDropDown = true;
        } else {
            this.showDropDown = false;
        }
        
        let tempPicklistValues = [...this.picklistValues];
        let tempDropDownList = [];
        tempDropDownList = tempPicklistValues.filter(pickVal => {
            return (pickVal.toLowerCase().includes(this.inputText.toLowerCase()) && tempDropDownList.length < 4) ? true : false;
        });
        this.dropDownList = tempDropDownList;
    }
    handleDropDownClick(event){
        this.inputText = event.target.dataset.item;
        this.showDropDown = false;
    }
    connectedCallback(){

        console.log("Child's Connected Callback");
        console.log("Child's Connected Callback: this.startDate: ", this.localStorageStartDate);
        console.log("Child's Connected Callback: this.endDate: ", this.localStorageEndDate);
        console.log("Child's Connected Callback: this.City: ", this.localStorageInput);

        this.handleMonthChange();
        // document.addEventListener('click',this.handleClickOutside);
        document.addEventListener('keyup',this.handleClickOutside);
    }
    disconnectedCallback(){
        // document.removeEventListener('click',this.handleClickOutside);
        document.removeEventListener('keyup',this.handleClickOutside);
    }
    

    
    handleClickOutside = (event) => {
        try {
            if(event.key == 'Escape'){
                this.showCalendar = false;
                this.showDropDown = false;
            }
            
            // if (this.template.querySelector('.dropdown-layout') != (event.target) && this.template.querySelector('.res-home-search-city-input') != (event.target)) {
            //     this.showDropDown = false;
            //     console.log('drpddddd');
            // }
            // if (this.template.querySelector('.calendar-item') != (event.target) && this.template.querySelector('.res-home-search-checkout-input-item') != (event.target) && this.template.querySelector('.res-home-search-checkin-input-item') != (event.target) && this.template.querySelector('.res-home-search-container') != (event.target)) {
            //     this.showCalendar = false;
            //     console.log('calendarrrrr');
            // }
            // if(this.template.querySelector('.res-home-search-container') != event.target){
            //     this.showCalendar = false;
            //     this.showDropDown = false;
            // }
        } catch (error) {
            console.log(error.message);
            
        }
        
    }
}