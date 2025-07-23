import { api, LightningElement, track } from 'lwc';
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import SwiperJsCss from '@salesforce/resourceUrl/SwiperJsCss';
/*
@Class name : ResCarousel
@description : Reusable Carousel component
@Author: Milin Kapatel
@Date: 26/03/2025
@JIRA: GT25-6
Revision Log  :   
Ver   Date         Author                               Modification
1.0   26-03-2025   Milin Kapatel                      Initial Version
2.0   02-04-2025   Milin Kapatel                      Added Comments & added a logic to let renderedCallback run only once
*/
export default class ResCarousel extends LightningElement {

    @api carouselItems = [];
    @api varient;
    swiperInitialized = false;

    get isQuoteSwiper(){
        if(this.varient == 'Quote'){
            return true;
        }
        else{
            return false;
        }
    }
    get isOfferSwiper(){
        if(this.varient == 'Offer'){
            return true;
        }
        else{
            return false;
        }
    }

    get carouselSlideClass(){
        if(this.varient == 'Offer'){
            return 'swiper-slide offer-slide';
        }
        else if(this.varient == 'Quote'){
            return 'swiper-slide quote-slide';
        }
    }
    get carouselCardClass(){
        if(this.varient == 'Offer'){
            return 'carousel-card';
        }
        else if(this.varient == 'Quote'){
            return 'carousel-card quote-card';
        }
    }
    get nextNavigationButtonClass(){
        return this.varient == 'Offer' ? 'swiper-button-next swiper-button-offer' : this.varient == 'Quote' ? 'swiper-button-next swiper-button-quote' : 'swiper-button-next';
    }
    get prevNavigationButtonClass(){
        return this.varient == 'Offer' ? 'swiper-button-prev swiper-button-offer' : this.varient == 'Quote' ? 'swiper-button-prev swiper-button-quote' : 'swiper-button-prev';
    }
    /*
    *********************************************************
    @methodName     : renderedCallback
    @author         : Milin Kapatel
    @description    : method to is used for loading the swiper js and css and initializing it after swiper slide's data is successfully fetched from parent
    @param          : void
    @return         : void
	@date			: March 26, 2025
	@JIRA			: GT25-6
    ********************************************************
	*/
    renderedCallback() {
            console.log('rendered callback called');
            if (this.swiperInitialized) {
                return;
            }

            Promise.all([
                loadScript(this, SwiperJsCss + "/swiper/swiper.js"),
            ]).then(() => {
                Promise.all([
                    loadStyle(this, SwiperJsCss + "/swiper/swiper.css"),
                ]).then(() => {
                    const LocalSwiper = window.Swiper;
                    const swiperComponent = this.template.querySelector('.mySwiper');
                    new LocalSwiper(swiperComponent, {
                        slidesPerView: "auto",
                        centeredSlides: true,
                        spaceBetween: 30,
                        loop: true,
                        autoplay: {
                          delay: 2500,
                          disableOnInteraction: false,
                        },

                        // pagination: {
                        //   el: this.template.querySelector('.swiper-pagination'),
                        //   clickable: true,
                        // },
                        navigation: {
                            nextEl: this.template.querySelector('.swiper-button-next'),
                            prevEl: this.template.querySelector('.swiper-button-prev'),
                        },
                    });
                }).catch(error => {
                    console.log('Error occured : ', error);

                });
            }).catch(error => {
                console.log('Error occured in last catch : ', error);
            });
    }
}