import { LightningElement, track } from 'lwc';
import saveJobCard from '@salesforce/apex/jobCardCreate.saveJobCard';

export default class JobCardDetails extends LightningElement {
    @track currentStep = null;
    @track chassisNo = '';
    @track runningHours='' ;
    @track isHourMeter = false;
    @track accountPhone='';
    @track tractorModel = '';

    @track fuelIndication = '';
    @track tyrePressure = {
        frontLeft: null,
        frontRight: null,
        rearLeft: null,
        rearRight: null
    };

    @track showModal=false;
    @track amount=0;
    @track repairs='';
    @track estimate='';

    handleNew(){
        this.currentStep="1";
    }

    handlecancle(){
        this.currentStep = null;
        this.chassisNo = '';
        this.runningHours='' ;
        this.isHourMeter = false;
        this.tractorModel = '';
        this.fuelIndication = '';
        this.tyrePressure = {
            frontLeft: null,
            frontRight: null,
            rearLeft: null,
            rearRight: null
        }; 
    }

    handleBack(){
        if(this.currentStep === '2'){
            this.currentStep = '1';
        }
        else if(this.currentStep === '3'){
            this.currentStep = '2';
        }
    }

    handleIdentityUpdate(event){
        this.chassisNo = event.detail.chassisNo;
        this.isHourMeter = event.detail.isHourMeter;
        this.runningHours = event.detail.runningHours;
        this.currentStep = event.detail.currentStep;
        this.accountPhone=event.detail.accountPhone;
        this.tractorModel =event.detail.tractorMoadel;
        console.log('pareant hour merter',this.isHourMeter,'event', event.detail.isHourMeter);
    }


    handleProdAndCustUpdate(event){
        this.currentStep=event.detail.currentStep;
        this.fuelIndication=event.detail.fuelIndication;
        this.tyrePressure=event.detail.tyrePressure;
        
    }

    handleServiceUpdate(event){
        console.log(this.showModal);
        this.amount=event.detail.amount;
        this.repairs=event.detail.repairs;
        this.estimate=event.detail.estimate,
        this.currentStep=event.detail.currentStep;
        this.showModal= event.detail.proceedModal;
        console.log(this.showModal);
    }

    handleClose(){
        this.showModal=false;
    }

    handleSave(){
        console.log('chassisNo',this.chassisNo);
        console.log('runningHours',this.runningHours);
        console.log('fuelindication',this.fuelIndication);
        console.log('tyre pressure',this.tyrePressure);
        console.log('estimate',this.estimate);
        console.log('repairs',this.repairs);

        const dataToSave = {
            chassisNo: this.chassisNo,
            runningHours: this.runningHours,
            isHourMeter: this.isHourMeter,
            fuelIndication: this.fuelIndication,
            tyrePressure: this.tyrePressure, 
            estimateDelivery: this.estimate,
            repairs: this.repairs,
            estimateAmount:this.amount,
        };

        saveJobCard({ jobData:dataToSave })
            .then((jobid) => {
                console.log('Job card saved successfully',jobid);
                this.currentStep = null;
                this.chassisNo = '';
                this.runningHours='' ;
                this.isHourMeter = false;
                this.tractorModel = '';
                this.fuelIndication = '';
                this.tyrePressure = {
                    frontLeft: null,
                    frontRight: null,
                    rearLeft: null,
                    rearRight: null
                };
                this.repairs='';
                this.estimate='';
                this.amount=0;
                this.showModal=false;
            })
            .catch(error => {
                console.error('Error saving job card:', error);
            });
            
    }

    get isStep1() {
      return this.currentStep === "1";
   }

   get isStep2() {
        return this.currentStep === "2";
    }

    get isStep3(){
    return this.currentStep === "3";
    }
}