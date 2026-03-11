import { LightningElement,api,track } from 'lwc';

export default class JobCardProdAndCust extends LightningElement {
    
    @api chassisNo = '';
    @api runningHours = '';
    @api tractorModel = '';
    @api fuelIndication

    @track localTyrePressure={
        frontLeft: null,
        frontRight: null,
        rearLeft: null,
        rearRight: null
    };

    @track localFuelIndication='';

    @api 
    get tyrePressure() { return this.localTyrePressure; }
    set tyrePressure(value) { 
        this.localTyrePressure = value ? { ...value } : this.localTyrePressure; 
    }


    connectedCallback(){
        console.log('fuelIndication',this.fuelIndication);
        if(this.fuelIndication){
            this.localfuelIndication = this.fuelIndication;
            console.log('localfuelIndication',this.localfuelIndication);
        }
    }

    get fuelOptions() {
        return [
            { label: 'Empty', value: 'Empty' },
            { label: 'Half', value: 'Half' },
            { label: 'Full', value: 'Full' }
        ];
    }

    handleInputChange(event) {
        const fieldId = event.target.dataset.id;
        const value = event.target.value;

        if (fieldId === 'fuelIndication') {
            this.localFuelIndication = value;
        } else {
            this.localTyrePressure[fieldId] = value;
        }
    }

    handleBack() {
        this.dispatchEvent(new CustomEvent('back', {
            detail: {
                currentStep: '1',
                fuelIndication: this.localFuelIndication,
                tyrePressure: this.localTyrePressure,
            }
        }));
    }

    handleNext(){

        if(this.validateFields()){
            this.dispatchEvent(new CustomEvent('tractordetailsupdate', {
                detail: {
                    fuelIndication: this.localFuelIndication,
                    tyrePressure: this.localTyrePressure,
                    currentStep: '3'
                }
            }));
        }
    }

    validateFields() {
        return [...this.template.querySelectorAll('lightning-input, lightning-combobox')]
            .reduce((validSoFar, field) => {
                field.reportValidity();
                return validSoFar && field.checkValidity();
            }, true);
    }

}