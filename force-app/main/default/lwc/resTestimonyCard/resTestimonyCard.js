import { api, LightningElement, track} from 'lwc';
import poolPhoto from '@salesforce/resourceUrl/signUpImage';
import getQuote from '@salesforce/apex/RESSignUpController.getQuotes';
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import SwiperJsCss from '@salesforce/resourceUrl/SwiperJsCss';

export default class ResTestimonyCard extends LightningElement {

    @api imgUrl = "https://raw.githubusercontent.com/milinkapatel/Respira-Images/refs/heads/main/hotel%20(3).jpg";

    hotelPool = poolPhoto;
    testimonies = [];
    async connectedCallback() {
        try {
            await getQuote().then(result => {
                this.testimonies = result;
            })
        } catch (error) {
            console.log(error);
        }

        Promise.all([
            loadScript(this, SwiperJsCss + "/swiper/swiper.js"),
        ]).then(() => {
            Promise.all([
                loadStyle(this, SwiperJsCss + "/swiper/swiper.css"),
            ]).then(() => {
                const swiperComponent = this.template.querySelector('.mySwiper');
                new Swiper(swiperComponent, {
                    slidesPerView: "1",
                    centeredSlides: true,
                    spaceBetween: 30,
                    autoplay: {
                        delay: 10000,
                        disableOnInteraction: false,
                    },
                });
            }).catch(error => {
                console.log(error);
            });
        }).catch(error => {
            console.log(error);
        });
        
        this.template.querySelector('.mySwiper').style.setProperty('--bg-img-url', url(this.imgUrl));
    }

}