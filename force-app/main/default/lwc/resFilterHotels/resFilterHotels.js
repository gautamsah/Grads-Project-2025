import { LightningElement,track,wire } from 'lwc';
import getAllHotels from '@salesforce/apex/RES_Utility.getAllHotels';
import getAllHotelsProducts from '@salesforce/apex/RES_Utility.getAllHotelsProductsWithRoomAvailibility';


export default class ResFilterHotels extends LightningElement {

    hotels;
    filtertour = [];
    rooms;
    error;
    filterRooms;

    cityFlag = false;
    city = localStorage.getItem("selectedCity")? localStorage.getItem("selectedCity") : '';

    d = new Date();
    tomorrow  = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    // checkoutDate = '2025-05-16';
    // checkinDate = '2025-05-08';
    checkinDate = localStorage.getItem("checkinDate") ? localStorage.getItem("checkinDate") : this.formatDate(this.d.getFullYear(), (this.d.getMonth() + 1), this.d.getDate());
    checkoutDate = localStorage.getItem("checkoutDate") ? localStorage.getItem("checkoutDate") : this.formatDate(this.tomorrow.getFullYear(), (this.tomorrow.getMonth() + 1), this.tomorrow.getDate());
    
    // localCheckinDates = localStorage.getItem("checkinDate")? localStorage.getItem("checkinDate") : '2025-04-08';
    // localCheckoutDates = localStorage.getItem("checkoutDate")? localStorage.getItem("checkoutDate") : '2025-04-14';
    // checkinSplit = this.localCheckinDates.split('-');
    // checkoutSplit = this.localCheckoutDates.split('-');
    // checkinDate = this.formatDate(Number(this.checkoutSplit[0]),Number(this.checkoutSplit[1]) - 1,Number(this.checkoutSplit[2]));
    // checkoutDate = this.formatDate(Number(this.checkoutSplit[0]),Number(this.checkoutSplit[1]) - 1,Number(this.checkoutSplit[2]));
    hotelMap=new Map();
    filterHotel;
    finalFilterHotel = [];
    // checkBooking = [];
    
    formatDate(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    connectedCallback(){
        
        // this.hotels = {};
        //  this.filtertour = [];
        //  this.rooms;
        //  this.error;
        //  this.filterRooms;
        //  this.hotelMap = new Map();
        //  this.filterHotel;
        //  this.finalFilterHotel = [];
        // getAllHotelsProducts({startDate : this.checkinDate, endDate : this.checkoutDate}).then(result =>{
        //     console.log('Hotel Results');
        //     this.rooms = result;
        //     console.log('Hotel Result :- '+this.rooms);
        //     this.filterRooms = this.rooms;
        //     // this.filterHotelAvailibility();
        // }).catch(error =>{
        //     console.error('Error fetching All Hotels Data with availibility:', error);
        // })
        //  console.log('Inside connected Callback');
        //  console.log('Checkin Date is => '+this.checkoutDate);
        //  console.log('Checkout Date is => '+this.checkinDate);
        //  console.log('Checkout Date is split => '+this.checkinSplit);
        //  console.log('Checkout Date is split => '+this.checkoutSplit);
        //  console.log('City is => '+this.city);
        if(this.city != '' && this.checkinDate != '' && this.checkoutDate != ''){
            let getAvailibity = [];
            getAllHotelsProducts({city : this.city, startDate : this.checkinDate, endDate : this.checkoutDate}).then(result =>{
                this.hotels = result;
                this.cityFlag = true;
                // console.log('Hotel Data Type => '+typeof(this.hotels));
                // console.log('Hotel Data Type => '+typeof(Array.from(this.hotels)));
                // function logMapElements(value, key, map) {
                //     console.log(`m[${key}] = ${value}`);
                //   }
                  
                //  this.hotels.forEach(hotel =>{
                //     console.log(this.hotels[hotel]);
                //  });

                // console.log('Hotel Map => '+JSON.parse(JSON.stringify(this.hotels)));
                // console.log('All Hotels => '+Object.keys(result));
                this.filterHotel = Object.keys(result);

                // console.log(typeof(Object.keys(result)));
                
                // console.log(typeof(this.filterHotel));
                
                // console.log('Inside all hotel ');

                // console.log(this.filterHotel[0]);
                
                this.filterHotel.forEach(hotelStr => {
                    // console.log('Inside loop of the filter hotels ');
                    // console.log('City of for loop is => '+this.city);
                    console.log('Value of Hotel => '+this.hotels[hotelStr]);
                    let oneHotelObj = {};
                    let oneHotelStr = hotelStr.slice(11, -2);
                    let oneHotelStrList = oneHotelStr.split(', ');
                    oneHotelStrList.forEach(hotelField => {
                        
                        let oneHotelField = hotelField.split(':');
                        if (oneHotelField[0] == 'Banner_Photo_Url__c') {
                            let result = oneHotelField[1].concat(":",oneHotelField[2]);
                            oneHotelField[1] = result;
                            
                        }
                        try{
                            let key = oneHotelField[0];
                            let value = oneHotelField[1];
                            oneHotelObj[key] = value;
                        }
                        catch(error){
                            console.log('obj errrror ',error.message);
                            
                        }
                        
                    });
                    this.finalFilterHotel.push(oneHotelObj);

                    console.log(typeof(this.finalFilterHotel));

                    // function getAvailibity(){
                    //     if(this.hotels[hotelStr] == true){
                    //         return true;
                    //     }else{
                    //         return false;
                    //     }
                    // }

                    this.filtertour = this.finalFilterHotel.map(hotel =>{
                        let isAvailable = this.hotels[hotelStr];
                        console.log('Check Availibility =>  '+isAvailable);
                        return{
                            ...hotel,
                            isAvailable : isAvailable
                        }
                    });
                    console.log('City => '+this.city);
                   
                });
                this.fetchDataFromURL();
                }).catch(error =>{
                    console.error('Error fetching All Hotels Data with availibility:', JSON.stringify(error.message));
                })
        }else{
            getAllHotels().then(result =>{
                this.hotels = result;
                console.log(typeof(this.hotels));
                // function logMapElements(value, key, map) {
                //     console.log(`m[${key}] = ${value}`);
                //   }
                  
                //  this.hotels.forEach(hotel =>{
                //     console.log(this.hotels[hotel]);
                //  });

                // console.log('Hotel Map => '+JSON.parse(JSON.stringify(this.hotels)));
                // console.log('All Hotels => '+Object.keys(result));
                this.filterHotel = Object.keys(result);

                // console.log(typeof(Object.keys(result)));
                
                // console.log(typeof(this.filterHotel));
                
                // console.log('Inside all hotel ');

                // console.log(this.filterHotel[0]);
                
                this.filterHotel.forEach(hotelStr => {
                    // console.log('Value of Hotel => '+this.hotels[hotelStr]);
                    let oneHotelObj = {};
                    let oneHotelStr = hotelStr.slice(11, -2);
                    let oneHotelStrList = oneHotelStr.split(', ');
                    oneHotelStrList.forEach(hotelField => {
                        
                        let oneHotelField = hotelField.split(':');
                        if (oneHotelField[0] == 'Banner_Photo_Url__c') {
                            let result = oneHotelField[1].concat(":",oneHotelField[2]);
                            oneHotelField[1] = result;
                            
                        }
                        try{
                            let key = oneHotelField[0];
                            let value = oneHotelField[1];
                            oneHotelObj[key] = value;
                        }
                        catch(error){
                            console.log('obj errrror ',error.message);
                            
                        }
                        
                    });
                    this.finalFilterHotel.push(oneHotelObj);

                    this.filtertour = this.finalFilterHotel.map(hotel =>{
                        let isAvailable = false;
    
                        isAvailable = this.hotels[hotelStr];
                        return{
                            ...hotel,
                            isAvailable : isAvailable
                        }
                    });
                    
                });
                this.fetchDataFromURL();
            }).catch(error => {
                console.error('Error fetching All Hotels Data:', JSON.stringify(error.message));
            });
        }
       
    }

    fetchDataFromURL(){
        if(this.city != ''){
            this.cityFlag = true;
            console.log('Inside the If Condition of city filter');
            this.finalFilter();
        }else{
            this.cityFlag = false;
            console.log('Inside the else Condition of city filter');
            this.finalFilter();
        }
    }
    
    
    searchedValue = null;
    searchFlag = false;

    searchFilter(event){
    this.searchedValue = event.detail;
        if(this.searchedValue != null){
            this.searchFlag = true;
            this.finalFilter();
        }
    }

    priceValue;
    priceFlag = false;

    priceFilter(event){
        this.priceValue = event.target.value;
        this.priceFlag = true;
        this.finalFilter();
        
    }

    reviewFlag = false;
    reviewItems;
    reviewFilter(event){
        this.reviewItems = event.detail;
        this.reviewFlag = true;
        this.finalFilter();
    }
    
    
    finalFilter(){
        console.log('Inside the final filter ');
        this.filtertour = this.finalFilterHotel.filter(tour =>{
            try {
                return (this.searchFlag? tour.Name.toLowerCase().includes(this.searchedValue.toLowerCase()): true)  &&
            (this.reviewFlag? tour.Overall_Rating__c >= this.reviewItems : true)
                &&
                (this.priceFlag? tour.Price__c <= this.priceValue : true)
                &&
                (this.cityFlag? tour.City__c == this.city : true);
            } catch (error) {
                console.log(JSON.stringify(error.message));
            }
            
        });   
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