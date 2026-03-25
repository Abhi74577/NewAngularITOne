import { FormConfig } from '../../shared/models/form-config.model';

export const USERS_FORM_CONFIG: FormConfig = {
  title: 'User Form',
  description: 'Create or edit user profile with multiple tabs',
  submitButtonText: 'Create User',
  cancelButtonText: 'Cancel',
  showReset: false,
  tabs: [
    {
      id: 'personal-info',
      label: 'Personal Info',
      description: 'Enter user personal information',
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
          },
          errorMessage: 'First name is required and must be 2-50 characters',
          helpText: 'Your first name as it appears on official documents'
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
          },
          errorMessage: 'Last name is required and must be 2-50 characters',
          helpText: 'Your last name as it appears on official documents'
        },
        {
          name: 'email',
          type: 'textbox',
          label: 'Email Address',
          placeholder: 'Enter email address',
          required: true,
          validation: {
            email: true
          },
          errorMessage: 'Please enter a valid email address',
          helpText: 'This email will be used for notifications'
        },
        {
          name: 'gender',
          type: 'radio',
          label: 'Gender',
          required: false,
          options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
            { label: 'Prefer not to say', value: 'prefer-not-to-say' }
          ],
          errorMessage: 'Please select your gender',
          helpText: 'Select the option that best represents you'
        }
      ]
    },
    {
      id: 'address',
      label: 'Address',
      description: 'Provide your address information',
      fields: [
        {
          name: 'address',
          type: 'textarea',
          label: 'Street Address',
          placeholder: 'Enter your street address',
          required: true,
          validation: {
            minLength: 5,
            maxLength: 250
          },
          errorMessage: 'Please enter a valid address',
          helpText: 'Include street number, street name, apartment/suite if applicable'
        },
        {
          name: 'country',
          type: 'select',
          label: 'Country',
          placeholder: 'Select country',
          required: true,
          options: [
            { label: 'United States', value: 'us' },
            { label: 'Canada', value: 'ca' },
            { label: 'United Kingdom', value: 'uk' },
            { label: 'Australia', value: 'au' },
            { label: 'Germany', value: 'de' },
            { label: 'France', value: 'fr' },
            { label: 'India', value: 'in' },
            { label: 'Japan', value: 'jp' },
            { label: 'Other', value: 'other' }
          ],
          errorMessage: 'Please select a country',
          helpText: 'Select your country of residence'
        },
        {
          name: 'city',
          type: 'textbox',
          label: 'City',
          placeholder: 'Enter city name',
          required: true,
          validation: {
            minLength: 2,
            maxLength: 50
          },
          errorMessage: 'Please enter a valid city name',
          helpText: 'Your city of residence'
        },
        {
          name: 'postalCode',
          type: 'textbox',
          label: 'Postal Code',
          placeholder: 'Enter postal code',
          required: false,
          validation: {
            minLength: 3,
            maxLength: 20
          },
          errorMessage: 'Please enter a valid postal code',
          helpText: 'ZIP/Postal code of your address'
        }
      ]
    },
    {
      id: 'preferences',
      label: 'Preferences',
      description: 'Set your preferences and interests',
      fields: [
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
            { label: 'SQL', value: 'sql' },
            { label: 'MongoDB', value: 'mongodb' },
            { label: 'Docker', value: 'docker' },
            { label: 'Kubernetes', value: 'kubernetes' },
            { label: 'AWS', value: 'aws' },
            { label: 'Azure', value: 'azure' },
            { label: 'GCP', value: 'gcp' },
            { label: 'Git', value: 'git' }
          ],
          errorMessage: 'Please select at least one skill',
          helpText: 'Select all your technical skills. Use the search box to find skills quickly.'
        },
        {
          name: 'notifications',
          type: 'checkbox',
          label: 'Email Notifications',
          required: false,
          errorMessage: 'Please confirm your notification preference',
          helpText: 'Receive email updates about new features, security alerts, and account activity'
        },
        {
          name: 'newsletter',
          type: 'checkbox',
          label: 'Subscribe to Newsletter',
          required: false,
          errorMessage: 'Please select if you want to subscribe',
          helpText: 'Get weekly updates, tips, and best practices delivered to your inbox'
        }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Configure role and account settings',
      fields: [
        {
          name: 'role',
          type: 'select',
          label: 'User Role',
          placeholder: 'Select a role',
          required: true,
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Manager', value: 'manager' },
            { label: 'Editor', value: 'editor' },
            { label: 'Contributor', value: 'contributor' },
            { label: 'Viewer', value: 'viewer' }
          ],
          errorMessage: 'Please select a role',
          helpText: 'Choose the role that defines user permissions and access level'
        },
        {
          name: 'status',
          type: 'radio',
          label: 'Account Status',
          required: true,
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
            { label: 'Suspended', value: 'suspended' }
          ],
          errorMessage: 'Please select an account status',
          helpText: 'Set whether the user account is active or inactive'
        },
        {
          name: 'twoFactorAuth',
          type: 'checkbox',
          label: 'Enable Two-Factor Authentication',
          required: false,
          errorMessage: 'Please confirm 2FA preference',
          helpText: 'Require 2FA for enhanced account security'
        }
      ]
    }
  ]
};
