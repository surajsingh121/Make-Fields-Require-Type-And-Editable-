import { LightningElement, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ACTIVE_FIELD from '@salesforce/schema/Account.Active__c';

const FIELDS = [ACTIVE_FIELD];

export default class AccountRecordForm extends LightningElement {
    @track accountId;
    @track isReadOnly = true;        // fields read-only by default
    @track isEditing = false;        // edit mode control
    @track isEditDisabled = true;    // disable Edit button if Active__c != Yes

    // Wire Account record
    @wire(getRecord, { recordId: '$accountId', fields: FIELDS })
    account;

    // Handle input for Account Id
    handleAccountIdChange(event) {
        this.accountId = event.target.value.trim();
    }

    // Watch for changes in record data
    renderedCallback() {
        if (this.account.data) {
            const activeValue = this.account.data.fields.Active__c?.value;

            // Enable or disable Edit button based on Active__c
            if (activeValue === 'Yes') {
                this.isEditDisabled = false;
            } else {
                this.isEditDisabled = true;
                this.isReadOnly = true;
                this.isEditing = false;
            }
        }
    }

    // When Edit button clicked
    handleEdit() {
        if (!this.isEditDisabled) {
            this.isReadOnly = false;
            this.isEditing = true;
        }
    }

    // Cancel editing
    handleCancel() {
        this.isReadOnly = true;
        this.isEditing = false;

        const form = this.template.querySelector('lightning-record-edit-form');
        if (form) form.reset();
    }

    // After successful save
    handleSaveSuccess() {
        this.isReadOnly = true;
        this.isEditing = false;

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Account record has been updated successfully!',
                variant: 'success',
            })
        );
    }
}
