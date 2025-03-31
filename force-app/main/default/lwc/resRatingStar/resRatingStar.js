import { api, LightningElement} from 'lwc';
import halfstar from '@salesforce/resourceUrl/HalfRatingStar';
import fullstar from '@salesforce/resourceUrl/FullRatingStar';
import emptystar from '@salesforce/resourceUrl/emptystar';

export default class ResRatingStar extends LightningElement {


    @api
    rating;

  
    
    halfstarimg = halfstar;
    fullstarimg = fullstar;
    emptystarimg = emptystar;

    
   
    get star1(){
    

        return this.rating >= 1 ? this.fullstarimg : this.rating > 0 && this.rating < 1 ? this.halfstarimg : this.emptystarimg;

    }
    get star2(){
        return this.rating >= 2 ? this.fullstarimg : this.rating > 1 && this.rating < 2 ? this.halfstarimg : this.emptystarimg;

    }
    get star3(){
        return this.rating >= 3 ? this.fullstarimg : this.rating > 2 && this.rating < 3 ? this.halfstarimg : this.emptystarimg;

    }
    get star4(){
        return this.rating >= 4 ? this.fullstarimg : this.rating > 3 && this.rating < 4 ? this.halfstarimg : this.emptystarimg;

    }
    get star5(){
        return this.rating >= 5 ? this.fullstarimg : this.rating > 4 && this.rating < 5 ? this.halfstarimg : this.emptystarimg;

    }
    
   
}