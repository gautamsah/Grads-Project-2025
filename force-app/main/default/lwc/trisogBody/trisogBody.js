import getTours from '@salesforce/apex/TourController.getTours';
import getCategories from '@salesforce/apex/TourController.getCategories';
import { MessageContext, subscribe, publish } from 'lightning/messageService';
import { LightningElement, wire } from 'lwc';
import PRICE_FILTER_COMMUNICATION_CHANNEL from '@salesforce/messageChannel/PriceFilterCommunicationChannel__c';

export default class TrisogBody extends LightningElement {
    tours;
    rangeValue;
    days;
    ratingVal;
    filterTours;
    filterPrice;
    subscription = null;
    checkedCategories = [];
    checkedCountries = [];
    isCategoriesFilterApplied;
    isPriceFilterApplied;
    isCountryFilterApplied;
    isDaysFilterApplied;
    isRatingsFilterApplied;
    categories = [
        'Adventure',
        'Beaches',
        'Boat Tours',
        'City Tour'];
    countries = [
        'Hungary',
        'UK',
        'Australia',
        'Oman',
        'Japan'
    ]
    ratingValues = [
        1,
        2,
        3,
        4,
        5
    ]


    @wire(getTours)
    wiredTours({ error, data }) {
        if (error) {
            this.tours = undefined;
            this.filterTours = this.tours;
        }
        else if (data) {
            this.tours = data;
            this.filterTours = this.tours;
        }
    }
    // @wire(getCategories)
    // wiredCategores({error, data}){
    //     if(data){
    //         console.log('inside if');
    //         this.categories = data;
    //     }
    //     else if(error){
    //         console.log('inside else');
    //         this.categories = undefined;
    //         console.log(error.message);
    //         console.log(error);
    //     }
    // }





    handleRangeChange(event) {
        this.rangeValue = event.target.value;
        this.isPriceFilterApplied = true;
    }
    clearPriceFilter() {
        this.rangeValue = undefined;
        this.isPriceFilterApplied = false;
    }
    clearRatingsFilter() {
        this.ratingVal = undefined;
        this.isRatingsFilterApplied = false;


    }
    handleDaysChange(event) {
        this.days = event.target.value;
        this.isDaysFilterApplied = (this.days != 0 ? true : false);
    }
    handleFilterButton() {
        this.filterTours = this.tours.filter(tour => {
            return (this.isPriceFilterApplied ? (tour.Price__c <= this.rangeValue) : true) && (this.isCategoriesFilterApplied ? this.splitAndCheckCategory(tour.Category__c) : true) && (this.isCountryFilterApplied ? (this.checkedCountries.includes(tour.Country__c)) : true) && (this.isDaysFilterApplied ? (this.days == tour.Duration__c) : true) && (this.isRatingsFilterApplied ? (this.ratingVal <= tour.Average_Rating__c) : true);
        }
        )
    }
    handleRatingsRadio(event) {
        this.ratingVal = event.target.value;
        this.isRatingsFilterApplied = true;
    }
    splitAndCheckCategory(categoriesStr) {
        let result = false;
        const catList = categoriesStr.split(";");
        catList.forEach(cat => {
            if (this.checkedCategories.includes(cat)) {
                result = true;
            }
        });
        return result;
    }
    handleCategoryCheckbox(event) {
        if (this.checkedCategories.includes(event.target.value)) {
            this.checkedCategories.splice(this.checkedCategories.indexOf(event.target.value), 1);
            this.isCategoriesFilterApplied = ((this.checkedCategories.length) ? true : false);
        }
        else {
            this.checkedCategories.push(event.target.value);
            this.isCategoriesFilterApplied = true;
        }
    }

    handleCountryCheckbox(event) {
        if (this.checkedCountries.includes(event.target.value)) {
            this.checkedCountries.splice(this.checkedCountries.indexOf(event.target.value), 1);
            this.isCountryFilterApplied = ((this.checkedCategories.length) ? true : false);
        }
        else {
            this.checkedCountries.push(event.target.value);
            this.isCountryFilterApplied = true;
        }
    }
}