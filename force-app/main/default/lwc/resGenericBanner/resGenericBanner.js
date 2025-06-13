import { api, LightningElement } from 'lwc';

export default class ResGenericBanner extends LightningElement {
    @api
    title;

    @api
    subtitle;
}