import { LightningElement, track, wire } from 'lwc';
import getAllBanquetsAndConferenceDetails from '@salesforce/apex/RESBanquetController.getAllBanquetsAndConferenceDetails';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import PICKLIST_FIELD from '@salesforce/schema/Hotel__c.Hotel_City__c';
import HotelObj from '@salesforce/schema/Hotel__c';
export default class ResBanquet extends LightningElement {
    banquetData;
    error;
    d = new Date();
    tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    @track startDate = localStorage.getItem("checkinDate") ? localStorage.getItem("checkinDate") : this.formatDate(this.d.getFullYear(), (this.d.getMonth() + 1), this.d.getDate());
    @track endDate = localStorage.getItem("checkoutDate") ? localStorage.getItem("checkoutDate") : this.formatDate(this.tomorrow.getFullYear(), (this.tomorrow.getMonth() + 1), this.tomorrow.getDate());
    @track inputCity = localStorage.getItem("selectedCity") ? localStorage.getItem("selectedCity") : '';
    isLoading = true;
    onBanquets = true;
    @track cities;


    @wire(getObjectInfo, { objectApiName: HotelObj })
    HotelInfo;
    @wire(getPicklistValues, { recordTypeId: '$HotelInfo.data.defaultRecordTypeId', fieldApiName: PICKLIST_FIELD })
    wiredPicklistValues({ error, data }) {
        if (data) {
            let picklistValues = data.values;
            let tempCities = [];
            picklistValues.forEach(ele => {
                const tempObj = { ...ele };

                tempCities.push(tempObj.value);
            });
            this.cities = tempCities;
        } else if (error) {
            console.log('Error retrieving picklist values: ', error);
        }
    }


    connectedCallback() {
        this.fetchBanquetData();
    }

    fetchBanquetData() {
        getAllBanquetsAndConferenceDetails({ startDate: this.startDate, endDate: this.endDate })
            .then(result => {
                this.banquetData = result.map(room => {
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
                this.isLoading = false;
                console.log('Banquet Data:', JSON.stringify(this.banquetData));
            })
            .catch(error => {
                this.error = error;
                this.isLoading = false;
                console.log('Error fetching banquet data:', JSON.stringify(this.error));

            });
    }
}