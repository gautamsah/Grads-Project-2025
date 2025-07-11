import { LightningElement, api } from "lwc";
import addReview from "@salesforce/apex/ReviewController.addReview";

export default class ChildRating extends LightningElement {
  ValueForMoney;
  CleanlinessAndHygiene;
  FoodQuality;
  Hospitality;
  ReviewHeading;
  ReviewDescription;
  review = 'hide-review';

  reviewDetails = {};
  serializeData;

  rating(event) {
    if (event.target.name === "ValueForMoney") {
      this.ValueForMoney = event.target.value;
    }
    if (event.target.name === "FoodQuality") {
      this.FoodQuality = event.target.value;
    }
    if (event.target.name === "Hospitality") {
      this.Hospitality = event.target.value;
    }
    if (event.target.name === "CleanlinessAndHygiene") {
      this.CleanlinessAndHygiene = event.target.value;
    }
  }

  handleHeading(event) {
    this.ReviewHeading = event.target.value;
  }
  handleDescription(event) {
    this.ReviewDescription = event.target.value;
  }
  handleButton() {
    this.review = 'show-review';
    console.log('Button Clicked');
  }

  handleOkay() {
    this.review = 'hide-review';


    this.reviewDetails.CleanlinessAndHygiene = this.CleanlinessAndHygiene;
    this.reviewDetails.ValueForMoney = this.ValueForMoney;
    this.reviewDetails.FoodQuality = this.FoodQuality;
    this.reviewDetails.Hospitality = this.Hospitality;
    this.reviewDetails.ReviewHeading = this.ReviewHeading;
    this.reviewDetails.ReviewDescription = this.ReviewDescription;

    this.serializeData = JSON.stringify(this.reviewDetails);

    addReview({ reviewDetails: serializeData }).then(() => {
      console.log("Data Successfully Saved");
    }).catch((e) => {
      console.log("Error in data saving" + JSON.stringify(e.message()));
    })

  }

  handleClose() {
    this.review = 'hide-review';
  }
}