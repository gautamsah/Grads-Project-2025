import { api, LightningElement, track } from 'lwc';
import getHotelReviewDetails from '@salesforce/apex/HotelWrapper.getHotelWithRating';

export default class ResHotelReviewDetails extends LightningElement {
    hotelDetails = {};
    actualHotelReviewDetails = [];
    hotelReviewDetails;
    valueForMoneyPercentage;
    cleanlinessAndHygienePercentage;
    hospitalityPercentage;
    foodQualityPercentage;
    avgValueForMoney;
    avgCleanlinessAndHyigene;
    avgHospitality;
    avgFoodQuality;
    isSortByDateAescending;
    isSortByRatingAescending;
    isSortByDateDescending = true;
    isSortByRatingDescending;
    loadedReviews = 0;
    totalReviewsToDisplay = 4;
    allReviewLoaded = false;
    hasReviewRecords = false;
    hotelName;
    renderedCallback(){
        if(this.hasReviewRecords){
            this.template.querySelector('.value-for-money-bar').style.width = this.valueForMoneyPercentage.toString().concat('%');
            this.template.querySelector('.cleanliness-and-hygiene-bar').style.width = this.cleanlinessAndHygienePercentage.toString().concat('%');
            this.template.querySelector('.hospitality-bar').style.width = this.hospitalityPercentage.toString().concat('%');
            this.template.querySelector('.food-quality-bar').style.width = this.foodQualityPercentage.toString().concat('%');
        }
        
        
    }
    handleSortByDate(){
        if(this.isSortByDateAescending){
            let tempHotelReviewDetails = [...this.hotelReviewDetails];
            tempHotelReviewDetails.sort((a,b) => a.CreatedDate > b.CreatedDate ? -1 : (b.CreatedDate > a.CreatedDate ? 1 : 0));
            this.hotelReviewDetails = tempHotelReviewDetails;
            
            this.isSortByDateAescending = false;
            this.isSortByDateDescending = true;
            this.isSortByRatingAescending = false;
            this.isSortByRatingDescending = false;
        }
        else{
            
            let tempHotelReviewDetails = [...this.hotelReviewDetails];
            tempHotelReviewDetails.sort((a,b) => a.CreatedDate > b.CreatedDate ? 1 : (b.CreatedDate > a.CreatedDate ? -1 : 0));
            this.hotelReviewDetails = tempHotelReviewDetails;
            this.isSortByDateAescending = true;
            this.isSortByDateDescending = false;
            this.isSortByRatingAescending = false;
            this.isSortByRatingDescending = false;
        }
    }
    handleSortByRating(){
        if(this.isSortByRatingAescending){
            let tempHotelReviewDetails = [...this.hotelReviewDetails];
            tempHotelReviewDetails.sort((a,b) => a.Avg_Rating__c > b.Avg_Rating__c ? -1 : (b.Avg_Rating__c > a.Avg_Rating__c ? 1 : 0));
            this.hotelReviewDetails = tempHotelReviewDetails;
            
            this.isSortByRatingAescending = false;
            this.isSortByRatingDescending = true;
            this.isSortByDateAescending = false;
            this.isSortByDateDescending = false;
        }
        else{
            
            let tempHotelReviewDetails = [...this.hotelReviewDetails];
            tempHotelReviewDetails.sort((a,b) => a.Avg_Rating__c > b.Avg_Rating__c ? 1 : (b.Avg_Rating__c > a.Avg_Rating__c ? -1 : 0));
            this.hotelReviewDetails = tempHotelReviewDetails;
            
            this.isSortByRatingAescending = true;
            this.isSortByRatingDescending = false;
            this.isSortByDateAescending = false;
            this.isSortByDateDescending = false;
        }
    }
    handleLoadMore(){
        if((this.totalReviewsToDisplay + 4) >= this.actualHotelReviewDetails.length){
            this.loadedReviews = 0;
            this.totalReviewsToDisplay = this.actualHotelReviewDetails.length;
            let tempHotelReviewDetails = this.actualHotelReviewDetails.filter(review => {
                return ++this.loadedReviews <= this.totalReviewsToDisplay;
            });
            this.hotelReviewDetails = tempHotelReviewDetails;
            this.allReviewLoaded = true;
        }
        else{
            this.loadedReviews = 0;
            this.totalReviewsToDisplay = this.totalReviewsToDisplay + 4;
            let tempHotelReviewDetails = this.actualHotelReviewDetails.filter(review => {
                return ++this.loadedReviews <= this.totalReviewsToDisplay;
            });
            this.hotelReviewDetails = tempHotelReviewDetails;
        }
    }
    get SortByDateArrowupCss(){
        if(this.isSortByDateDescending){
            return 'arrow-visible review-details-icon';
        }
        else{
            return 'arrow-hidden review-details-icon';
        }
    }
    get SortByDateArrowdownCss(){
        if(this.isSortByDateAescending){
            return 'arrow-visible review-details-icon';
        }
        else{
            return 'arrow-hidden review-details-icon';
        }
    }
    get SortByRatingArrowupCss(){
        if(this.isSortByRatingDescending){
            return 'arrow-visible review-details-icon';
        }
        else{
            return 'arrow-hidden review-details-icon';
        }
    }
    get SortByRatingArrowdownCss(){
        if(this.isSortByRatingAescending){
            return 'arrow-visible review-details-icon';
        }
        else{
            return 'arrow-hidden review-details-icon';
        }
    }
    get loadMoreCss(){
        if(this.allReviewLoaded){
            return 'review-details-load-more-hidden';
        }
        else{
            return 'review-details-load-more';
        }
    }
    connectedCallback(){
        let basicUrl = window.location.href;
        let actualUrl = new URL(basicUrl).searchParams;
        this.hotelName = actualUrl.get('hotelUniqueName');
        getHotelReviewDetails({hotelName : this.hotelName})
                    .then(result => {
                        if(result[0].ratingList.length){
                        this.hasReviewRecords = true;
                        
                        this.hotelDetails = result[0].hotelRecord;
                        this.actualHotelReviewDetails = result[0].ratingList;
                        let tempHotelReviewDetails = [...this.actualHotelReviewDetails];
                        tempHotelReviewDetails.forEach((review, index) => {
                            let tempReviewObj = {...review};
                            tempReviewObj.CreatedDate = review.CreatedDate.substring(0,10);
                            tempHotelReviewDetails[index] = tempReviewObj;
                        });
                        this.actualHotelReviewDetails = tempHotelReviewDetails;

                        this.hotelReviewDetails = this.actualHotelReviewDetails.filter(review => {
                            return ++this.loadedReviews <= this.totalReviewsToDisplay;
                        });
                        if(this.actualHotelReviewDetails.length <= this.totalReviewsToDisplay){
                            this.allReviewLoaded = true;
                        }
                        this.avgValueForMoney = this.hotelDetails.Avg_Value_For_Money__c.toFixed(1);
                        this.avgCleanlinessAndHyigene = this.hotelDetails.Avg_Cleanliness_And_Hygiene__c.toFixed(1);
                        this.avgHospitality = this.hotelDetails.Avg_Hospitality__c.toFixed(1);
                        this.avgFoodQuality = this.hotelDetails.Avg_Food_Quality__c.toFixed(1);
                        
                        this.valueForMoneyPercentage = this.hotelDetails.Avg_Value_For_Money__c * 20;
                        this.cleanlinessAndHygienePercentage = this.hotelDetails.Avg_Cleanliness_And_Hygiene__c * 20;
                        this.hospitalityPercentage = this.hotelDetails.Avg_Hospitality__c * 20;
                        this.foodQualityPercentage = this.hotelDetails.Avg_Food_Quality__c * 20;
                        }
                    })
                    .then(() => {
                        if(this.hasReviewRecords){
                            let tempHotelReviewDetails = [...this.hotelReviewDetails];
                            tempHotelReviewDetails.sort((a,b) => a.Avg_Rating__c > b.Avg_Rating__c ? -1 : (b.Avg_Rating__c > a.Avg_Rating__c ? 1 : 0));
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching hotel details:', error.message);
                    });
    }
}