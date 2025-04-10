import { LightningElement, track, wire } from 'lwc';
import bgvideoResource from '@salesforce/resourceUrl/bgvideo';
import { getRecord } from 'lightning/uiRecordApi';
import userId from '@salesforce/user/Id';
import FirstName from '@salesforce/schema/User.FirstName';
import Username from '@salesforce/schema/User.Username';
/*
@Class name : ResHomePageBanner
@description : To Show Banner with autoplay video
@Author: Milin Kapatel
@Date: 28/03/2025
@JIRA: GT25-5
Revision Log  :   
Ver   Date         Author                               Modification
1.0   28-03-2025   Milin Kapatel                      Initial Version
2.0   02-04-2025   Milin Kapatel                      Added Comments
*/
export default class ResHomePageBanner extends LightningElement {

    
    @track bgvideo;
    @track userName = '';
    @track firstName = '';
    @track errorMsg;
    
    get welcomeMsgClass(){
        if(this.userName == ''){
                return 'welcome-msg-hidden';
            }
            else{
                return 'welcome-msg-visible';
            }
    }

    /*
    *********************************************************
    @Decorator      : wire
    @methodName     : getRecord
    @author         : Milin Kapatel
    @description    : method to is used for getting the details of current user
    @param          : Id recordId, array : fields
    @return         : void
	@date			: March 28, 2025
	@JIRA			: GT25-5
    ********************************************************
	*/
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
    /*
    *********************************************************
    @methodName     : connectedCallback
    @author         : Milin Kapatel
    @description    : method to is used for referencing the video to local variable after lwc is inserted in DOM
    @param          : void
    @return         : void
	@date			: March 28, 2025
	@JIRA			: GT25-5
    ********************************************************
	*/
    connectedCallback(){
        this.bgvideo = bgvideoResource;
        
    }
}