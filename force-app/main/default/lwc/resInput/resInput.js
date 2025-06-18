import { LightningElement, api } from 'lwc';

export default class ResInput extends LightningElement {

    @api fieldValue;
    @api fieldName;
    @api fieldLabel;
    @api validate = false;
    @api required = false;


    field;
    hasError;
    className = 'normal';
    errorMessage;

    @api
    get inputType() {
        return this.field;
    }
    set inputType(value) {
        this.field = value;
    }

    get placeHolder(){
        return `Enter your ${this.fieldLabel.toLowerCase()}`;
    }
    
    get isText() {
        this.placeHolder+this.fieldLabel;
        return this.field === 'text';
    }
    get isCheckbox() {
        return this.field === 'checkbox';
    }
    get isPassword() {
        return this.field === 'password';
    }
    get isEmail() {
        return this.field === 'email';
    }
    get isPhone() {
        return this.field === 'phone';
    }

    get cssClasses(){
        return this.hasError ? ' normal error show-name-error' : ' normal ';
    }

    emailFormat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    phoneFormat = /^[0-9]{10}$/;
    textFormat = /^[A-Za-z]{1,40}$/;

    @api validationCheck(){

        this.hasError = false;
        
        if (this.isEmail && !this.emailFormat.test(this.fieldValue)) {
            this.hasError = true;
            this.errorMessage = 'Please enter a valid email!';
        }

        if(this.isText && this.required && !this.fieldValue){
            this.hasError = true;
            this.errorMessage = `${this.fieldLabel} is required!`;
        }

        if (this.isText && this.validate && !this.textFormat.test(this.fieldValue)) {
            this.hasError = true;
            this.errorMessage = 'Name can only contain letters and only be 40 characters long!';
        }

        if (this.isPhone && !this.phoneFormat.test(this.fieldValue)) {
            this.hasError = true;
            this.errorMessage = 'Please enter a valid phone!';
        }

        return this.hasError;
        
    }

    handleChange(event) {
        this.fieldValue = this.isPassword || this.isText || this.isEmail || this.isPhone ? event.target.value : event.target.checked;
        
        this.validationCheck();

        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                fieldName: this.fieldName,
                fieldValue: this.fieldValue,
                hasError: this.hasError
            }
        }));
    }
}