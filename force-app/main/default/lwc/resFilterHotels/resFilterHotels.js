import { LightningElement,track,wire } from 'lwc';
import getAllHotels from '@salesforce/apex/RES_Utility.getAllHotels';
import getAllHotelsProducts from '@salesforce/apex/RES_Utility.getAllHotelsProductsWithRoomAvailibility';

import { NavigationMixin } from 'lightning/navigation';
import { getPicklistValues, getObjectInfo  } from 'lightning/uiObjectInfoApi';
import PICKLIST_FIELD from '@salesforce/schema/Hotel__c.Hotel_City__c';
import HotelObj from '@salesforce/schema/Hotel__c';


export default class ResFilterHotels extends NavigationMixin(LightningElement) {

    hotels;
    filtertour = [];
    rooms;
    error;
    filterRooms;
    filterCss = "filter-container";
    isHotelAvailable = false;
    skeleton = true;
    skeletonCollection = [1,2,3,4,5,6,7,8,9];

    name;
    d = new Date();
    tomorrow  = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    city = localStorage.getItem("selectedCity") ? localStorage.getItem("selectedCity") : '';
    checkinDate = localStorage.getItem("checkinDate") ? localStorage.getItem("checkinDate") : this.formatDate(this.d.getFullYear(), (this.d.getMonth() + 1), this.d.getDate());
    checkoutDate = localStorage.getItem("checkoutDate") ? localStorage.getItem("checkoutDate") : this.formatDate(this.tomorrow.getFullYear(), (this.tomorrow.getMonth() + 1), this.tomorrow.getDate());

    hotelMap=new Map();
    filterHotel;
    finalFilterHotel = [];
    hotels = [];
    
    formatDate(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    //*******************************************************************************************************************************************/
        
    localStorageStartDate = localStorage.getItem("checkinDate");
    localStorageEndDate = localStorage.getItem("checkoutDate");
    localStorageCity = localStorage.getItem("selectedCity");
    placeholder = 'Search City';

    cities = [];

    @wire(getObjectInfo, { objectApiName: HotelObj })
    HotelInfo;
    @wire(getPicklistValues, {recordTypeId: '$HotelInfo.data.defaultRecordTypeId', fieldApiName: PICKLIST_FIELD })
    wiredPicklistValues({ error, data }) {         
        if (data) {             
            let picklistValues = data.values;
            let tempCities = [];
            picklistValues.forEach(ele => {
                const tempObj = {...ele};
                
                tempCities.push(tempObj.value);
            });  
            this.cities = tempCities;
        } else if (error) {             
            console.log('Error retrieving picklist values: ', error);  
        } 
    }
    
    handleBookNow(event){
        
        localStorage.setItem("checkinDate", event.detail.startDate);
        localStorage.setItem("checkoutDate", event.detail.endDate);
        localStorage.setItem("selectedCity", event.detail.searchInput);
        
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
            url: `https://respira-dev.my.site.com/respira/s/filterhotels`,
            target:'_self',
            }
        }); 
        
    }

    //******************************************************************************************************************************************/
    // connectedCallback(){
        
    //     // this.hotels = {};
    //     //  this.filtertour = [];
    //     //  this.rooms;
    //     //  this.error;
    //     //  this.filterRooms;
    //     //  this.hotelMap = new Map();
    //     //  this.filterHotel;
    //     //  this.finalFilterHotel = [];
    //     // getAllHotelsProducts({startDate : this.checkinDate, endDate : this.checkoutDate}).then(result =>{
    //     //     console.log('Hotel Results');
    //     //     this.rooms = result;
    //     //     console.log('Hotel Result :- '+this.rooms);
    //     //     this.filterRooms = this.rooms;
    //     //     // this.filterHotelAvailibility();
    //     // }).catch(error =>{
    //     //     console.error('Error fetching All Hotels Data with availibility:', error);
    //     // })
    //     //  console.log('Inside connected Callback');
    //     //  console.log('Checkin Date is => '+this.checkoutDate);
    //     //  console.log('Checkout Date is => '+this.checkinDate);
    //     //  console.log('Checkout Date is split => '+this.checkinSplit);
    //     //  console.log('Checkout Date is split => '+this.checkoutSplit);
    //     //  console.log('City is => '+this.city);
    //     if(this.city != '' && this.checkinDate != '' && this.checkoutDate != ''){
    //         // let getAvailibity = [];
    //         getAllHotelsProducts({city : this.city, startDate : this.checkinDate, endDate : this.checkoutDate}).then(result =>{
    //             this.hotels = result;
    //             console.log("Hotels: ", this.hotels);
                
    //             this.cityFlag = true;
    //             // console.log('Hotel Data Type => '+typeof(this.hotels));
    //             // console.log('Hotel Data Type => '+typeof(Array.from(this.hotels)));
    //             // function logMapElements(value, key, map) {
    //             //     console.log(`m[${key}] = ${value}`);
    //             //   }
                  
    //             //  this.hotels.forEach(hotel =>{
    //             //     console.log(this.hotels[hotel]);
    //             //  });

    //             // console.log('Hotel Map => '+JSON.parse(JSON.stringify(this.hotels)));
    //             // console.log('All Hotels => '+Object.keys(result));
    //             this.filterHotel = Object.keys(result);

    //             // console.log(typeof(Object.keys(result)));
                
    //             // console.log(typeof(this.filterHotel));
                
    //             // console.log('Inside all hotel ');

    //             // console.log(this.filterHotel[0]);
                
    //             this.filterHotel.forEach(hotelStr => {
    //                 // console.log('Inside loop of the filter hotels ');
    //                 // console.log('City of for loop is => '+this.city);
    //                 console.log('Value of Hotel => '+this.hotels[hotelStr]);
    //                 let oneHotelObj = {};
    //                 let oneHotelStr = hotelStr.slice(11, -2);
    //                 let oneHotelStrList = oneHotelStr.split(', ');
    //                 oneHotelStrList.forEach(hotelField => {
                        
    //                     let oneHotelField = hotelField.split(':');
    //                     if (oneHotelField[0] == 'Banner_Photo_Url__c') {
    //                         let result = oneHotelField[1].concat(":",oneHotelField[2]);
    //                         oneHotelField[1] = result;
                            
    //                     }
    //                     try{
    //                         let key = oneHotelField[0];
    //                         let value = oneHotelField[1];
    //                         oneHotelObj[key] = value;
    //                     }
    //                     catch(error){
    //                         console.log('obj errrror ',error.message);
                            
    //                     }
                        
    //                 });
    //                 this.finalFilterHotel.push(oneHotelObj);

    //                 console.log(typeof(this.finalFilterHotel));

    //                 // function getAvailibity(){
    //                 //     if(this.hotels[hotelStr] == true){
    //                 //         return true;
    //                 //     }else{
    //                 //         return false;
    //                 //     }
    //                 // }

    //                 this.filtertour = this.finalFilterHotel.map(hotel =>{
    //                     let isAvailable = this.hotels[hotelStr];
    //                     console.log('Check Availibility =>  '+isAvailable);
    //                     return{
    //                         ...hotel,
    //                         isAvailable : isAvailable
    //                     }
    //                 });
    //                 console.log('City => '+this.city);
                   
    //             });
    //             this.fetchDataFromURL();
    //             }).catch(error =>{
    //                 console.error('Error fetching All Hotels Data with availibility:', JSON.stringify(error.message));
    //             })
    //     }else{
    //         getAllHotels().then(result =>{
    //             this.hotels = result;
    //             console.log('Hotels: ', this.hotels);
                
    //             console.log(typeof(this.hotels));
    //             // function logMapElements(value, key, map) {
    //             //     console.log(`m[${key}] = ${value}`);
    //             //   }
                  
    //             //  this.hotels.forEach(hotel =>{
    //             //     console.log(this.hotels[hotel]);
    //             //  });

    //             // console.log('Hotel Map => '+JSON.parse(JSON.stringify(this.hotels)));
    //             // console.log('All Hotels => '+Object.keys(result));
    //             this.filterHotel = Object.keys(result);

    //             // console.log(typeof(Object.keys(result)));
                
    //             // console.log(typeof(this.filterHotel));
                
    //             // console.log('Inside all hotel ');

    //             // console.log(this.filterHotel[0]);
                
    //             this.filterHotel.forEach(hotelStr => {
    //                 // console.log('Value of Hotel => '+this.hotels[hotelStr]);
    //                 let oneHotelObj = {};
    //                 let oneHotelStr = hotelStr.slice(11, -2);
    //                 let oneHotelStrList = oneHotelStr.split(', ');
    //                 oneHotelStrList.forEach(hotelField => {
                        
    //                     let oneHotelField = hotelField.split(':');
    //                     if (oneHotelField[0] == 'Banner_Photo_Url__c') {
    //                         let result = oneHotelField[1].concat(":",oneHotelField[2]);
    //                         oneHotelField[1] = result;
                            
    //                     }
    //                     try{
    //                         let key = oneHotelField[0];
    //                         let value = oneHotelField[1];
    //                         oneHotelObj[key] = value;
    //                     }
    //                     catch(error){
    //                         console.log('obj errrror ',error.message);
                            
    //                     }
                        
    //                 });
    //                 this.finalFilterHotel.push(oneHotelObj);

    //                 this.filtertour = this.finalFilterHotel.map(hotel =>{
    //                     let isAvailable = false;
    
    //                     isAvailable = this.hotels[hotelStr];
    //                     return{
    //                         ...hotel,
    //                         isAvailable : isAvailable
    //                     }
    //                 });
                    
    //             });
    //             this.fetchDataFromURL();
    //         }).catch(error => {
    //             console.error('Error fetching All Hotels Data:', JSON.stringify(error.message));
    //         });
    //     }
       
    // }

   
    connectedCallback(){
        getAllHotelsProducts({startDate : this.checkinDate, endDate : this.checkoutDate})
        .then(result => {
            this.hotels = result;
            this.filtertour = this.hotels;
            console.log('City == > '+this.city)
            console.log("Data: ", result);
            this.skeleton = false;
            this.fetchDataFromURL();
        })
        .catch(error => {
            console.log(error);
            
        })
    }

    fetchDataFromURL(){
        if(this.city){
            this.cityFlag = true;
            console.log('Inside the If Condition of city filter');
            this.finalFilter();
        }else{
            this.cityFlag = false;
            console.log('Inside the else Condition of city filter');
            this.finalFilter();
        }
    }
    
    handleFilter(){
        console.log("Btn-clicked");
        this.filterCss = "phone-filter-container";
    }
    handleClose(){
        this.filterCss = "displayNone";
    }
    searchedValue = null;
    searchFlag = false;

    searchFilter(event){
    this.searchedValue = event.target.value;
        if(this.searchedValue != null){
            this.searchFlag = true;
            this.finalFilter();
        }
    }

    priceValue = 300;
    priceFlag = false;

    priceFilter(event){
        this.priceValue = event.target.value;
        this.priceFlag = true;
        this.finalFilter();
        
    }

    reviewFlag = false;
    reviewItems;
    reviewFilter(event){
        this.reviewItems = event.target.value;
        this.reviewFlag = true;
        this.finalFilter();
    }
    
    clearFilter(){
        this.reviewFlag = false;
        this.priceFlag = false;
        this.searchFlag = false;
        this.reviewItems = null;

        const radios = this.template.querySelectorAll('input[type="radio"][name="btn"]');
        radios.forEach(radio => radio.checked = false);

        const searched = this.template.querySelector('input[type="text"][name="searched-value"]');
        searched.value = '';

        this.priceValue = 300;
        this.searchedValue = null;

        this.finalFilter();
    }

    finalFilter(){
        
        console.log('Inside the final filter ');
        this.filtertour = this.hotels.filter(tour =>{
            try {
                return (this.searchFlag? tour.details.Name.toLowerCase().includes(this.searchedValue.toLowerCase()): true)  &&
            (this.reviewFlag? tour.details.Overall_Rating__c >= this.reviewItems : true)
                &&
                (this.priceFlag? tour.details.Price__c <= this.priceValue : true)
                &&
                (this.cityFlag? tour.details.City__c == this.city : true);
            } catch (error) {
                console.log(JSON.stringify(error.message));
            }
            
        });

        const availableHotel = this.filtertour.filter(hotel => hotel.availability);
        const unavailableHotel = this.filtertour.filter(hotel => !hotel.availability);

        this.filtertour = availableHotel.concat(unavailableHotel);
        
        if (this.filtertour.length > 0) {
            console.log(this.filtertour.length);
            this.isHotelAvailable = true;
        }
        else{
            this.isHotelAvailable = false;
        }
    }
    
}





// adultCount = [];
    // adultCount = 1;
    // adultFlag = false;
    // adultFilter(){
        
    //     // if(this.adultCount.includes(event.target.value)){
    //     //     this.adultCount.splice(this.adultCount.indexOf(event.target.value),1); 
    //     // }
    //     // else{
    //     //     this.adultCount.push(event.target.value);
    //     // }
        
    //     // this.adultFlag = this.adultCount.length > 0 ? true : false;
    //     // console.log('Adult Values :- '+this.adultCount);
    //     this.adultFlag = true;
    //     this.finalFilter();
        
    // }

    // splitAndCheck(capacity){
    //         // const selectedCapacity = capacity.split(";");
    //         // let result1 = false;
    //         // selectedCapacity.forEach(capacity => {
    //         //     if( this.adultCount.includes(capacity)){
    //         //         result1 = true;
    //         //     }
    //         // });
           
    //         return Math.max(capacity.split(";"));
    // }


        // countryValue = [];
        // countryFlag = false;
        // changeCountry(event){
           
        //     if(this.countryValue.includes(event.detail)){
        //         this.countryValue.splice(this.countryValue.indexOf(event.detail),1);
        //     }
        //     else{
        //         this.countryValue.push(event.detail);
        //     }
        //     this.countryFlag = this.countryValue.length > 0 ? true : false;

        //     // this.categoryValue.forEach(category => {
        //     //     console.log(category);
        //     // })
          
        //     this.finalFilter();
           
        // }

    //     splitAndCheckCountry(country){
    //         const selectedCountry = country.split(";");
    //         let result1 = false;
    //         selectedCountry.forEach(category => {
    //            if( this.countryValue.includes(category)){
    //               result1 = true;
    //            }
    //         });
    //         return result1;
    // }


    // dayValue;
    // dayFlag = false;

    // dayFilter(event){
    //     this.dayValue = event.detail;
    //     this.dayFlag = true;
    //     this.finalFilter();
        
    // }

    // childvalue;
    // childFilter(event){
    //     if(event.target.value != null){
    //         this.childvalue =  event.target.value;
    //     }
    //     else{
    //         this.childvalue = 0;
    //     }
        
    // }
    // adultvalue;
    // adultFilter(event){
    //     if(event.target.value != null){
    //         this.adultvalue =  event.target.value;
    //     }
    //     else{
    //         this.adultvalue = 0;
    //     }
       
    // }

    // roomvalue;
    // roomFlag = false;
    // roomFilter(event){
    //     this.roomValue = event.target.value;
    //     this.roomFlag = true;
    //     this.finalFilter();
    // }

    // adultFlag = false;
    // adultFilter(){
    //     this.adultValue = this.adultCount;
    //     this.adultFlag = true;
    //     this.finalFilter();
    // }









    // gotodetailpage(){
    //               this[NavigationMixin.Navigate]({
    //                          type: 'standard__webPage',
    //                          attributes: {
    //                             url: `https://respira-dev.my.site.com/respira/s/hotel?hotelUniqueName=${this.hotelUniqueName}`,
    //                             target:'_self',
    //                             componentName: 'c__resHotelDetailPage'
    //                          }
    //                      });
    //          }

    
    // increment(){
    //     console.log('Increment value :- '+this.adultCount);
    //     if(this.adultCount < 6){
    //         this.adultCount++;
    //         this.adultFilter();
    //     }else{
    //         alert('You have reached the maximum limit of 6 adults');
    //     }
        
    //     // adultValue = this.template.querySelector('.adult-value');
    //     // incrementer = this.template.querySelector('#increment');
    //     // this.adultValue.addEventListener('change', ()=>{
    //     //     if (this.adultCount < 7) {
    //     //         this.incrementer.disabled = false;
    //     //     } else {
    //     //         this.incrementer.disabled = true; 
    //     //     }
    //     // });
        
    // }
    // decrement(){
    //     if(this.adultCount > 1){
    //         this.adultCount--;
    //         this.adultFilter();
    //     }else{
    //         alert('You have reached the minimum limit of 1 adults');
    //     }
        
    //     // adultValue = this.template.querySelector('.adult-value');
    //     // decrementer = this.template.querySelector('#decrement');
    //     // this.adultValue.addEventListener('change', ()=>{
    //     //     if (this.adultCount > 0) {
    //     //         this.decrementer.disabled = false;
    //     //     } else {
    //     //         this.decrementer.disabled = true; 
    //     //     }
    //     // });
      
    // }






    // @track mapData=[];

    // @wire(getAllHotels,{checkinDatetime: this.checkinDate,checkoutDatetime: this.checkoutDate})
    // hotels({error,data}){
    //     console.log('Before Data Fetch');

    //     if(data){
    //         console.log('Inside Data fetch')
    //         console.log(data);
    //         maphotels = data;
    //         for(var key in maphotels){
    //             this.mapData.push({value:maphotels[key],key:key});
    //         }
    //         console.log(this.mapData);
    //         console.log('Data set in maphotels');
    //     }
    //     else if(error){
    //         console.error("Data not Fetched")
    //     }
    // }



    // fetchCapacity(){
    //     let basicUrl = window.location.href;
    //     let actualUrl = new URL(basicUrl).searchParams;
    //     this.adultCount = Math.max(actualUrl.get('adults').split(";"));
    //     if(this.adultCount != null){
    //         this.adultFlag = true;
    //     }
    //     this.finalFilter();
    // }