import { api, LightningElement, track} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getHotelDetail from '@salesforce/apex/RES_Utility.getHotelWithRating';
import userId from '@salesforce/user/Id';
export default class ResHotelDetailPage extends NavigationMixin(LightningElement) {

    img1;
    img2;
    img3;
    @track bannerImg;
    @api hotelName;
    hotelDetails = [];
    includes = [];
    ac = false;
    veg = false;
    tv = false;
    pet = false;
    parkspace = false;
    free = false;
    roomservice = false;
    telephone = false;
    foodorder = false;
    nonveg = false;
    activities = [];
    showLoadingSpinner = false;

    center = {};
    mapMarkers = []

    connectedCallback() {
        this.showLoadingSpinner = true;
        let basicUrl = window.location.href;
        let actualUrl = new URL(basicUrl).searchParams;
        this.hotelName = actualUrl.get('hotelUniqueName');

        if (this.hotelName) {
            getHotelDetail({ hotelName: this.hotelName })
                .then(result => {
                    this.showLoadingSpinner = false;
                    this.hotelDetails = result;
                    console.log(result);
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
                            this.processFacilities();
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
                        console.log('Facilities:',JSON.stringify(this.includes));
                    }
                    else {
                        console.log('Includes__c is null or undefined.');
                    }
                })
                .catch(error => {
                    this.showLoadingSpinner = false;
                    console.error('Error fetching hotel details:', error.message);
                });
        }
    }

    processFacilities() {
        if (this.includes && this.includes.length > 0) {
            this.ac = this.includes.includes('A.C.');
            this.veg = this.includes.includes('Veg. Food');
            this.tv = this.includes.includes('Television');
            this.pet = this.includes.includes('Pets');
            this.parkspace = this.includes.includes('Parking Space');
            this.free = this.includes.includes('Free Breakfast');
            this.roomservice = this.includes.includes('Room Service');
            this.telephone = this.includes.includes('Telephone');
            this.foodorder = this.includes.includes('Food Order');
            this.nonveg = this.includes.includes('Non-veg. Food');
        } else {
            // this.ac = false;
            // this.veg = false;
            // this.tv = false;
            // this.pet = false;
            // this.parkspace = false;
            // this.free = false;
            // this.roomservice = false;
            // this.telephone = false;
            // this.foodorder = false;
            // this.nonveg = false;
        }
    }

    handleImageChange(event) {
        const clickedImgId = event.target.dataset.id;

        const updatedHotelDetails = JSON.parse(JSON.stringify(this.hotelDetails)); if (clickedImgId == '1') {
            this.bannerImg = this.img1;
        } else if (clickedImgId == '2') {
            this.bannerImg = this.img2;
        } else {
            this.bannerImg = this.img3;
        }
        this.hotelDetails = updatedHotelDetails;
    }

    handleBookNow() {
        if (!userId) {
            //navigation mixin to login page + session management
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: `https://respira-dev.my.site.com/respira/s/loginpage`,
                    target: '_self',
                }
            });
            return;
        }
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `https://respira-dev.my.site.com/respira/s/room?hotelUniqueName=${this.hotelName}`,
                target: '_self',
            }
        });
    }

}