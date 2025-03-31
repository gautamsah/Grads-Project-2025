import { api, LightningElement, track } from 'lwc';
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import SwiperJsCss from '@salesforce/resourceUrl/SwiperJsCss';
export default class ResCarousel extends LightningElement {

    @api carouselItems = [];
    @api varient;

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
    renderedCallback() {
            console.log('rendered callback called');
            
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