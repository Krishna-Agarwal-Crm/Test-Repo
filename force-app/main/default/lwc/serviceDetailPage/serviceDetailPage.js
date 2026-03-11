import { LightningElement, track, api } from 'lwc';

export default class ServiceDetailsPage extends LightningElement {
    @api productStatus = 'PDI';
    @api serviceType = 'Product Quality';
    @api location = 'Workshop';

    @track repairs = '';
    @track amount = 0;
    @track estimate= '';


    @track pdiReport = [
        {
            id: '1',
            srNo: 1,
            checkpoint: 'CheckPoint',
            category: 'Tractor',
            recommendation: 'oil change Recomended',
            status: 'Not OK',
            remarks: 'need further inspection',
            fileName: 'tractorImage.jpg'
        }
    ];

    handleInputChange(event) {
        const field = event.target.dataset.id;
        this[field] = event.target.value;
    }

    handleBack() {
        this.dispatchEvent(new CustomEvent('back',{
            detail:{
                amount:this.amount,
                repairs:this.repairs,
                estimate:this.estimate,
                currentStep:'2',
                proceedModal:false
            }
        }));
    }

    handleProceed() {
        if(this.validateFields()) {
            this.dispatchEvent(new CustomEvent('procced',{
                detail:{
                    amount:this.amount,
                    repairs:this.repairs,
                    estimate:this.estimate,
                    currentStep:'3',
                    proceedModal:true
                }
            }))
        }
    }

    validateFields() {
        return [...this.template.querySelectorAll('lightning-input:not([disabled]), lightning-textarea:not([disabled])')]
            .reduce((validSoFar, field) => {
                field.reportValidity();
                return validSoFar && field.checkValidity();
            }, true);
    }
}