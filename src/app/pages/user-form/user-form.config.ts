// Sample form configuration for User Form with multiple tabs
import { FormConfig } from '../../shared/models/form-config.model';

export const USER_FORM_CONFIG: FormConfig = {
  title: 'User Management Form',
  description: 'Complete the user information across all tabs',
  submitButtonText: 'Submit',
  cancelButtonText: 'Cancel',
  showReset: true,
  tabs: [
    {
      id: 'personal-info',
      label: 'Personal Information',
      description: 'Enter basic personal details',
      fields: [
        {
          name: 'firstName',
          type: 'textbox',
          label: 'First Name',
          placeholder: 'Enter first name',
          required: true,
          validation: {
            minLength: 2,
            maxLength: 50
          }
        },
        {
          name: 'lastName',
          type: 'textbox',
          label: 'Last Name',
          placeholder: 'Enter last name',
          required: true,
          validation: {
            minLength: 2,
            maxLength: 50
          }
        },
        {
          name: 'email',
          type: 'textbox',
          label: 'Email Address',
          placeholder: 'user@example.com',
          required: true,
          validation: {
            email: true
          }
        },
        {
          name: 'phoneNumber',
          type: 'textbox',
          label: 'Phone Number',
          placeholder: '+1 (555) 000-0000',
          required: false,
          validation: {
            pattern: '^[\\+]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[0-9]{1,9}$'
          }
        },
        {
          name: 'dateOfBirth',
          type: 'textbox',
          label: 'Date of Birth',
          placeholder: 'YYYY-MM-DD',
          required: false
        }
      ]
    },
    {
      id: 'address',
      label: 'Address',
      description: 'Provide your residential address',
      fields: [
        {
          name: 'streetAddress',
          type: 'textbox',
          label: 'Street Address',
          placeholder: '123 Main Street',
          required: true
        },
        {
          name: 'city',
          type: 'textbox',
          label: 'City',
          placeholder: 'New York',
          required: true
        },
        {
          name: 'state',
          type: 'select',
          label: 'State/Province',
          required: true,
          options: [
            { label: 'New York', value: 'NY' },
            { label: 'California', value: 'CA' },
            { label: 'Texas', value: 'TX' },
            { label: 'Florida', value: 'FL' },
            { label: 'Pennsylvania', value: 'PA' }
          ]
        },
        {
          name: 'postalCode',
          type: 'textbox',
          label: 'Postal Code',
          placeholder: '10001',
          required: true,
          validation: {
            pattern: '^[0-9]{5}(?:-[0-9]{4})?$'
          }
        },
        {
          name: 'country',
          type: 'select',
          label: 'Country',
          required: true,
          options: [
            { label: 'United States', value: 'US' },
            { label: 'Canada', value: 'CA' },
            { label: 'United Kingdom', value: 'UK' },
            { label: 'Australia', value: 'AU' }
          ]
        }
      ]
    },
    {
      id: 'preferences',
      label: 'Preferences',
      description: 'Set your preferences and interests',
      fields: [
        {
          name: 'department',
          type: 'select',
          label: 'Department',
          required: true,
          options: [
            { label: 'Engineering', value: 'eng' },
            { label: 'Sales', value: 'sales' },
            { label: 'Marketing', value: 'marketing' },
            { label: 'Human Resources', value: 'hr' },
            { label: 'Finance', value: 'finance' }
          ]
        },
        {
          name: 'skills',
          type: 'multiselect',
          label: 'Technical Skills',
          required: false,
          searchable: true,
          options: [
            { label: 'JavaScript', value: 'js' },
            { label: 'TypeScript', value: 'ts' },
            { label: 'Python', value: 'python' },
            { label: 'React', value: 'react' },
            { label: 'Angular', value: 'angular' },
            { label: 'Vue.js', value: 'vue' },
            { label: 'Node.js', value: 'nodejs' },
            { label: 'SQL', value: 'sql' }
          ]
        },
        {
          name: 'communicationPreference',
          type: 'radio',
          label: 'Preferred Communication Method',
          required: true,
          options: [
            { label: 'Email', value: 'email' },
            { label: 'Phone', value: 'phone' },
            { label: 'SMS', value: 'sms' }
          ]
        },
        {
          name: 'yearsOfExperience',
          type: 'select',
          label: 'Years of Experience',
          required: true,
          options: [
            { label: 'Less than 1 year', value: 0 },
            { label: '1-2 years', value: 1 },
            { label: '2-5 years', value: 2 },
            { label: '5-10 years', value: 5 },
            { label: 'More than 10 years', value: 10 }
          ]
        }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Configure account settings',
      fields: [
        {
          name: 'emailNotifications',
          type: 'checkbox',
          label: 'Receive email notifications',
          standalone: true,
          required: false,
          value: true
        },
        {
          name: 'pushNotifications',
          type: 'checkbox',
          label: 'Receive push notifications',
          standalone: true,
          required: false,
          value: false
        },
        {
          name: 'newsLetter',
          type: 'checkbox',
          label: 'Subscribe to newsletter',
          standalone: true,
          required: false,
          value: false
        },
        {
          name: 'accountStatus',
          type: 'radio',
          label: 'Account Status',
          required: true,
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
            { label: 'Pending', value: 'pending' }
          ],
          value: 'active'
        },
        {
          name: 'biography',
          type: 'textarea',
          label: 'Biography',
          placeholder: 'Tell us about yourself...',
          required: false,
          validation: {
            maxLength: 500
          },
          helpText: 'Maximum 500 characters'
        }
      ]
    }
  ]
};
