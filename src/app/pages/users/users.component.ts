import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynamicFormService } from '../../shared/services/dynamic-form.service';
import { ModalService } from '../../shared/services/modal.service';
import { ThemeService } from '../../core/services/theme.service';
import { DynamicFormRendererComponent } from '../../shared/components/dynamic-form-renderer/dynamic-form-renderer.component';
import { TabConfig, FormSubmissionData } from '../../shared/models/form-config.model';
import { USERS_FORM_CONFIG } from '../users/users-form.config';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Admin' | 'Manager' | 'User';
  status: 'Active' | 'Inactive';
  joinDate: string;
  phone?: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormRendererComponent],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit, OnDestroy {
  USERS_FORM_CONFIG = USERS_FORM_CONFIG;
  showModal = false;
  isEditMode = false;
  activeTab: string = '';
  formGroups: { [key: string]: FormGroup } = {};
  private destroy$ = new Subject<void>();

  // Sample user data
  users: User[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      status: 'Active',
      joinDate: '2023-01-15',
      phone: '+1-555-0101'
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Smith',
      email: 'sarah.smith@example.com',
      role: 'Manager',
      status: 'Active',
      joinDate: '2023-03-20',
      phone: '+1-555-0102'
    },
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.johnson@example.com',
      role: 'User',
      status: 'Active',
      joinDate: '2023-06-10',
      phone: '+1-555-0103'
    },
    {
      id: 4,
      firstName: 'Emily',
      lastName: 'Williams',
      email: 'emily.williams@example.com',
      role: 'Manager',
      status: 'Inactive',
      joinDate: '2023-02-14',
      phone: '+1-555-0104'
    },
    {
      id: 5,
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@example.com',
      role: 'User',
      status: 'Active',
      joinDate: '2024-01-22',
      phone: '+1-555-0105'
    },
    {
      id: 6,
      firstName: 'Jessica',
      lastName: 'Davis',
      email: 'jessica.davis@example.com',
      role: 'User',
      status: 'Active',
      joinDate: '2024-02-18',
      phone: '+1-555-0106'
    }
  ];

  private selectedUser: User | null = null;

  constructor(
    private dynamicFormService: DynamicFormService,
    private modalService: ModalService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.initializeFormGroups();
    if (USERS_FORM_CONFIG.tabs.length > 0) {
      this.activeTab = USERS_FORM_CONFIG.tabs[0].id;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeFormGroups(): void {
    USERS_FORM_CONFIG.tabs.forEach(tab => {
      this.formGroups[tab.id] = this.dynamicFormService.createFormGroup(tab.fields);
    });
  }

  openUserForm(): void {
    this.selectedUser = null;
    this.showModal = true;
    this.isEditMode = false;
    this.resetForm();
  }

  editUser(user: User): void {
    this.selectedUser = user;
    this.showModal = true;
    this.isEditMode = true;
    this.loadUserDataIntoForm(user);
  }

  closeUserForm(): void {
    this.showModal = false;
    this.selectedUser = null;
    this.resetForm();
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.users = this.users.filter(u => u.id !== userId);
    }
  }

  selectTab(tabId: string): void {
    if (this.isTabValid(tabId)) {
      this.activeTab = tabId;
    }
  }

  previousTab(): void {
    const tabs = USERS_FORM_CONFIG.tabs;
    const currentIndex = tabs.findIndex(t => t.id === this.activeTab);
    if (currentIndex > 0) {
      this.activeTab = tabs[currentIndex - 1].id;
    }
  }

  nextTab(): void {
    const tabs = USERS_FORM_CONFIG.tabs;
    const currentIndex = tabs.findIndex(t => t.id === this.activeTab);
    if (currentIndex < tabs.length - 1) {
      this.activeTab = tabs[currentIndex + 1].id;
    }
  }

  canGoPrevious(): boolean {
    const tabs = USERS_FORM_CONFIG.tabs;
    const currentIndex = tabs.findIndex(t => t.id === this.activeTab);
    return currentIndex > 0;
  }

  canGoNext(): boolean {
    const tabs = USERS_FORM_CONFIG.tabs;
    const currentIndex = tabs.findIndex(t => t.id === this.activeTab);
    return currentIndex < tabs.length - 1 && this.isTabValid(this.activeTab);
  }

  isTabValid(tabId: string): boolean {
    const formGroup = this.formGroups[tabId];
    return formGroup ? formGroup.valid : false;
  }

  isFormValid(): boolean {
    return Object.values(this.formGroups).every(fg => fg.valid);
  }

  submitUserForm(): void {
    if (this.isFormValid()) {
      const formData: FormSubmissionData = {};
      Object.keys(this.formGroups).forEach(tabId => {
        formData[tabId] = this.formGroups[tabId].value;
      });

      if (this.isEditMode && this.selectedUser) {
        // Update existing user
        const userIndex = this.users.findIndex(u => u.id === this.selectedUser!.id);
        if (userIndex > -1) {
          this.users[userIndex] = {
            ...this.users[userIndex],
            firstName: formData['personal-info']?.['firstName'] || this.users[userIndex].firstName,
            lastName: formData['personal-info']?.['lastName'] || this.users[userIndex].lastName,
            email: formData['personal-info']?.['email'] || this.users[userIndex].email,
          };
          // Trigger change detection by creating new array reference
          this.users = [...this.users];
        }
      } else {
        // Add new user
        const newUser: User = {
          id: Math.max(...this.users.map(u => u.id), 0) + 1,
          firstName: formData['personal-info']?.['firstName'] || '',
          lastName: formData['personal-info']?.['lastName'] || '',
          email: formData['personal-info']?.['email'] || '',
          role: 'User',
          status: 'Active',
          joinDate: new Date().toISOString().split('T')[0],
          phone: formData['personal-info']?.['phone'] || ''
        };
        this.users.push(newUser);
        this.users = [...this.users];
      }

      console.log('User Form Submitted:', formData);
      this.closeUserForm();
    }
  }

  submitForm(event: any): void {
    // Handle individual form submission if needed
    console.log('Form event:', event);
  }

  onBackdropClick(): void {
    this.closeUserForm();
  }

  private loadUserDataIntoForm(user: User): void {
    const personalInfoForm = this.formGroups['personal-info'];
    if (personalInfoForm) {
      personalInfoForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone
      });
    }
  }

  private resetForm(): void {
    this.initializeFormGroups();
    if (USERS_FORM_CONFIG.tabs.length > 0) {
      this.activeTab = USERS_FORM_CONFIG.tabs[0].id;
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  getThemeIcon(): string {
    return this.themeService.getTheme() === 'light' ? '🌙' : '☀️';
  }
}
