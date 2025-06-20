import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getPicklistValues, getObjectInfo  } from 'lightning/uiObjectInfoApi';
import PICKLIST_FIELD from '@salesforce/schema/Hotel__c.Hotel_City__c';
import HotelObj from '@salesforce/schema/Hotel__c';

export default class ResHomePageSearch extends NavigationMixin(LightningElement) {
   
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
    
    
    connectedCallback(){
    }
}