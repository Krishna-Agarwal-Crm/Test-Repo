import { LightningElement, api, track } from 'lwc';
import getChassisSuggestions from '@salesforce/apex/jobCardCreate.getChassisSuggestions'

export default class JobIdentityPage extends LightningElement {
    @track localChassisNo = '';
    @track localRunningHours = '';
    @track localisHourMeter = false;
    @track accountId='';
    @track suggestions=[];
    @track showSuggestions=false;
    @track tractorModel="";
    @track validChassis=false;
        
    @api 
    get chassisNo() { return this.localChassisNo; }
    set chassisNo(value) { 
        this.localChassisNo = value;
        if(this.localChassisNo!=''){
            this.validChassis=true;
        }
    }

    @api 
    get runningHours() { return this.localRunningHours; }
    set runningHours(value) { this.localRunningHours = value; }

    @api
    get isHourMeter(){ return this.localisHourMeter; }
    set isHourMeter(value) { this.localisHourMeter = value; console.log(this.localisHourMeter); }

    get options() {
        return [
            { label: 'YES', value: true },
            { label: 'NO', value: false },
        ];
    }

    get radioValue(){
        return this.localisHourMeter ?true:false;
    }

    handleChassisChange(event){
        this.validChassis=false;
        this.localChassisNo = event.target.value;
        window.clearTimeout(this.delayTimeout);
        const searchKey = this.localChassisNo;

        if (searchKey.length >= 2) {
            this.delayTimeout = setTimeout(() => {
                getChassisSuggestions({ searchKey })
                .then( result=> {
                    console.log(result);
                    this.suggestions=result;
                    this.showSuggestions=this.suggestions.length >0;
                    console.log(this.suggestions);
                })
                .catch(err =>{
                    console.error(err);
                });
            })}
            else{
                this.showSuggestions=false;
            }
    }

    handleSelectChassis(event){
        const selectedName = event.currentTarget.dataset.name;
        const selectedId = event.currentTarget.dataset.id;
    

        this.localChassisNo = selectedName;

        const selectedRecord = this.suggestions.find(item => item.Id === selectedId);
        
        if (selectedRecord) {
            this.validChassis=true;
            this.accountId = selectedRecord.Opportunity?.Account?.Phone;
            this.tractorModel = selectedRecord.Product2?.Name; 
        }

        
        this.showSuggestions = false;
    }

    handleInputChange(event) {
        const fieldId = event.target.dataset.id;
        if (fieldId === 'chassisNo') {
            this.localChassisNo = event.target.value;
        }
        else if (fieldId === 'runningHours'){ 
            this.localRunningHours = event.target.value;
        }
    }

    handleRadioChange(event) {
        this.localisHourMeter =Boolean (event.detail.value=='true');
    }

    handleNext() {
        console.log(this.validChassis);
        if(this.vadlididate() ){
            if(this.validChassis){
                this.dispatchEvent(new CustomEvent('identityupdate', {
                    detail: {
                        chassisNo: this.localChassisNo,
                        runningHours: this.localRunningHours,
                        isHourMeter: this.localisHourMeter,
                        currentStep: '2',
                        accountPhone:this.accountId,
                        tractorMoadel:this.tractorModel
                    }
                }));
            }
        }
    }

    vadlididate(){
        return [...this.template.querySelectorAll('lightning-input, lightning-combobox')]
            .reduce((validSoFar, field) => {
                field.reportValidity();
                return validSoFar && field.checkValidity();
            }, true);
    }
}