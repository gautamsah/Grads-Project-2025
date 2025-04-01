import { api, LightningElement, track } from 'lwc';
import getHotelDetail from '@salesforce/apex/HotelWrapper.getHotelWithRating';
export default class ResHotelDetailPage extends LightningElement {

    img1;
    img2;
    img3;
    @track bannerImg;
    hotelName;
    hotelDetails = [];
    includes = [];
    notIncludes = [];
    safety = [];
    activities = [];

    center = {};
    mapMarkers = []

    connectedCallback() {
        let basicUrl = window.location.href;
        let actualUrl = new URL(basicUrl).searchParams;
        this.hotelName = actualUrl.get('hotelUniqueName');
        
        if (this.hotelName) {
            getHotelDetail({ hotelName: this.hotelName })
                .then(result => {
                    this.hotelDetails = result;
                    if (this.hotelDetails && this.hotelDetails.length > 0 && this.hotelDetails[0].hotelRecord) {
                        this.img1 = this.hotelDetails[0].hotelRecord.Banner_Photo_Url__c;
                        this.img2 = this.hotelDetails[0].hotelRecord.Peripheral_Img__c;
                        this.img3 = this.hotelDetails[0].hotelRecord.Front_Img__c;
                        this.bannerImg = this.img1;
                        if (this.hotelDetails[0].hotelRecord.Activities__c) {
                            this.activities = this.hotelDetails[0].hotelRecord.Activities__c.split(';');
                        }
                        if (this.hotelDetails[0].hotelRecord.Includes__c) {
                            this.includes = this.hotelDetails[0].hotelRecord.Includes__c.split(';');
                        }
                        if (this.hotelDetails[0].hotelRecord.Not_Includes__c) {
                            this.notIncludes = this.hotelDetails[0].hotelRecord.Not_Includes__c.split(';');
                        }
                        if (this.hotelDetails[0].hotelRecord.Safety_Rules__c) {
                            this.safety = this.hotelDetails[0].hotelRecord.Safety_Rules__c.split(';');
                        }
                        if (this.hotelDetails[0].hotelRecord.Location__c.latitude && this.hotelDetails[0].hotelRecord.Location__c.longitude) {

                            const latitude = this.hotelDetails[0].hotelRecord.Location__c.latitude;
                            const longitude = this.hotelDetails[0].hotelRecord.Location__c.longitude;
                            this.center = {
                                location: {
                                    Latitude: latitude,
                                    Longitude: longitude,
                                },
                            };
                            this.mapMarkers = [
                                {
                                    location: {
                                        Latitude: latitude,
                                        Longitude: longitude,
                                    },
                                    title: this.hotelDetails[0].hotelRecord.Name,
                                    description: this.hotelDetails[0].hotelRecord.Description__c,
                                },
                            ];
                        }
                    }
                    else {
                        console.log('Includes__c is null or undefined.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching hotel details:', error.message);
                });
        }
    }

    handleImageChange(event) {
        const clickedImgId = event.target.dataset.id;

        const updatedHotelDetails = JSON.parse(JSON.stringify(this.hotelDetails));if (clickedImgId == '1') {
            this.bannerImg = this.img1;
        } else if (clickedImgId == '2') {
            this.bannerImg = this.img2;
        } else {
            this.bannerImg = this.img3;
        }
        this.hotelDetails = updatedHotelDetails;
    }

}