export type FormFieldType = 'textbox' | 'textarea' | 'select' | 'multiselect' | 'radio' | 'checkbox';

export interface FieldOption {
  label: string;
  value: any;
}

export interface FormFieldConfig {
  name: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  value?: any;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
    email?: boolean;
    custom?: (value: any) => boolean;
  };
  options?: FieldOption[];
  errorMessage?: string;
  helpText?: string;
  className?: string;
  standalone?: boolean;
  searchable?: boolean;
}

export interface TabConfig {
  id: string;
  label: string;
  fields: FormFieldConfig[];
  description?: string;
}

export interface FormConfig {
  title: string;
  description?: string;
  tabs: TabConfig[];
  submitButtonText?: string;
  cancelButtonText?: string;
  showReset?: boolean;
}

export interface FormSubmissionData {
  [tabId: string]: {
    [fieldName: string]: any;
  };
}
