import { LightningElement } from 'lwc';
import respiraEmail from "@salesforce/label/c.Respira_Email";
import respiraPhone from "@salesforce/label/c.Respira_Phone";
import respiraAdd from "@salesforce/label/c.Respira_Office_Address";

export default class ResFooter extends LightningElement {

    email = respiraEmail;
    phone = respiraPhone;
    address = respiraAdd;


}