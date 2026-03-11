public class jobCardCreate {

    @AuraEnabled(cacheable=true)
    public static List<OpportunityLineItem> getChassisSuggestions(String searchKey){
        System.debug(searchKey);
        if(!String.isBlank(searchKey)){
        	searchKey=searchKey+'%';
            return [SELECT Opportunity.Account.phone, Product2.Name, Chassis__c from OpportunityLineItem where Chassis__c like: searchKey];
        }
        else{
            return new List<OpportunityLineItem>();
        }
    }
    
    @AuraEnabled
    public static String saveJobCard(Map<String, Object> jobData) {
        system.debug(jobdata);
        try {
            Job_Card__c newJob = new Job_Card__c();
            newJob.Chassis__c = (String)jobData.get('chassisNo');
            newJob.isHourMeter__c = (Boolean)jobData.get('isHourMeter');
            newJob.tactorRunningHours__c = String.valueOf(jobData.get('runningHours'))!=''?Decimal.valueOf(String.valueOf(jobData.get('runningHours'))):NULL;
            newJob.Fuel_Indication__c = (String)jobData.get('fuelIndication');
            newJob.Estimate__c = Decimal.valueOf(String.valueOf(jobData.get('estimateAmount')));
            
            String dtStr=String.valueOf(jobData.get('estimateDelivery'));
            String formattedDt = dtStr.replace('T', ' ').replace('.000Z', '');
            newJob.Estimate_Delivery__c = Datetime.valueOfGmt(formattedDt);
            
            newJob.Repairs__c = String.isblank(String.valueOf(jobData.get('repairs')))?null:(String)jobData.get('repairs');
            
            System.debug(jobdata.get('tyrePressure'));
            Map<Object, Object> tyrePressure = (Map<Object, Object>)jobData.get('tyrePressure');
            if (tyrePressure != null && !tyrePressure.isEmpty() ) {
                newJob.Front_Left__c = String.valueOf(tyrePressure.get('frontLeft'))==null?null:Decimal.valueOf(String.valueOf(tyrePressure.get('frontLeft')));
                newJob.Front_Right__c = String.valueOf(tyrePressure.get('frontRight'))==null?null:Decimal.valueOf(String.valueOf(tyrePressure.get('frontRight')));
                newJob.Rear_Left__c = String.valueOf(tyrePressure.get('rearLeft'))==null?null:Decimal.valueOf(String.valueOf(tyrePressure.get('rearLeft')));
                newJob.Rear_Right__c = String.valueOf(tyrePressure.get('rearRight'))==null?null:Decimal.valueOf(String.valueOf(tyrePressure.get('rearRight')));
            }

            insert newJob;
            return newJob.Id;
            
        } catch (Exception e) {
            throw new AuraHandledException('Error saving Job Card: ' + e.getMessage());
        }
    }
}