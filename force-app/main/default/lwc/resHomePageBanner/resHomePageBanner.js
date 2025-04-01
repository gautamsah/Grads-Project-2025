import { LightningElement, track, wire } from 'lwc';
import bgvideoResource from '@salesforce/resourceUrl/bgvideo';
import { getRecord } from 'lightning/uiRecordApi';
import userId from '@salesforce/user/Id';
import FirstName from '@salesforce/schema/User.FirstName';
import Username from '@salesforce/schema/User.Username';


export default class ResHomePageBanner extends LightningElement {


    get welcomeMsgClass(){
        if(this.userName == ''){
                return 'welcome-msg-hidden';
            }
            else{
                return 'welcome-msg-visible';
            }
    }
    @track userName = '';
   
    @track firstName = '';
    @track errorMsg;
    

    @wire(getRecord, {recordId : userId, fields : [Username, FirstName]})
    wiredUserDetails({error, data}){
        
        if(error){
            
            
            this.errorMsg = error;
        }
        else if(data){
            
            
            if (data.fields.Username.value != null) {
                this.userName = data.fields.Username.value;
                
                
            }
            if(data.fields.FirstName.value != null){
                this.firstName = data.fields.FirstName.value;
                
            }
        }
    }
    @track bgvideo;
    connectedCallback(){
        this.bgvideo = bgvideoResource;
        
    }
}