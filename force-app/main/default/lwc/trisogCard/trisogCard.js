import { api, LightningElement } from 'lwc';

export default class TrisogCard extends LightningElement {
    @api image;
    @api location;
    @api name;
    @api rating;
    @api reviews;
    @api duration;
    @api price;
}