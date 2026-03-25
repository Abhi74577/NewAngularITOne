import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormFieldConfig, TabConfig, FormFieldType } from '../models/form-config.model';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  createFormGroup(fields: FormFieldConfig[]): FormGroup {
    const group: { [key: string]: FormControl } = {};

    fields.forEach(field => {
      const validators = this.buildValidators(field);
      group[field.name] = new FormControl(
        { value: field.value || '', disabled: field.disabled || field.readonly },
        validators
      );
    });

    return new FormGroup(group);
  }

  createTabFormGroups(tabs: TabConfig[]): { [key: string]: FormGroup } {
    const formGroups: { [key: string]: FormGroup } = {};

    tabs.forEach(tab => {
      formGroups[tab.id] = this.createFormGroup(tab.fields);
    });

    return formGroups;
  }

  private buildValidators(field: FormFieldConfig): any[] {
    const validators = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.validation) {
      const { minLength, maxLength, pattern, email, min, max } = field.validation;

      if (minLength) validators.push(Validators.minLength(minLength));
      if (maxLength) validators.push(Validators.maxLength(maxLength));
      if (pattern) validators.push(Validators.pattern(pattern));
      if (email) validators.push(Validators.email);
      if (min !== undefined) validators.push(Validators.min(min));
      if (max !== undefined) validators.push(Validators.max(max));
    }

    return validators;
  }

  getFieldComponent(fieldType: FormFieldType) {
    const componentMap: { [key in FormFieldType]: string } = {
      textbox: 'app-textbox',
      textarea: 'app-textarea',
      select: 'app-select',
      multiselect: 'app-multiselect',
      radio: 'app-radio',
      checkbox: 'app-checkbox'
    };

    return componentMap[fieldType];
  }

  collectFormData(formGroups: { [key: string]: FormGroup }): any {
    const data: any = {};

    Object.keys(formGroups).forEach(tabId => {
      data[tabId] = formGroups[tabId].getRawValue();
    });

    return data;
  }

  resetFormGroups(formGroups: { [key: string]: FormGroup }): void {
    Object.values(formGroups).forEach(group => {
      group.reset();
    });
  }
}
