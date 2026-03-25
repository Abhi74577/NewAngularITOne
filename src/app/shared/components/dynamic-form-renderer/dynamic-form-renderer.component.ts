import { Component, Input, Output, EventEmitter, ViewContainerRef, ComponentRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormFieldConfig } from '../../models/form-config.model';
import { DynamicFormService } from '../../services/dynamic-form.service';
import { TextboxComponent, TextareaComponent, SelectComponent, MultiselectComponent, RadioComponent, CheckboxComponent } from '../form/index';

@Component({
  selector: 'app-dynamic-form-renderer',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    TextboxComponent,
    TextareaComponent,
    SelectComponent,
    MultiselectComponent,
    RadioComponent,
    CheckboxComponent
  ],
  template: `
    <div class="form-renderer">
      <div *ngFor="let field of fields" class="field-container">
        <app-textbox
          *ngIf="field.type === 'textbox'"
          [config]="field"
          [control]="formGroup.get(field.name)!"
        ></app-textbox>

        <app-textarea
          *ngIf="field.type === 'textarea'"
          [config]="field"
          [control]="formGroup.get(field.name)!"
        ></app-textarea>

        <app-select
          *ngIf="field.type === 'select'"
          [config]="$any(field)"
          [control]="formGroup.get(field.name)!"
        ></app-select>

        <app-multiselect
          *ngIf="field.type === 'multiselect'"
          [config]="$any(field)"
          [control]="formGroup.get(field.name)!"
        ></app-multiselect>

        <app-radio
          *ngIf="field.type === 'radio'"
          [config]="$any(field)"
          [control]="formGroup.get(field.name)!"
        ></app-radio>

        <app-checkbox
          *ngIf="field.type === 'checkbox'"
          [config]="$any(field)"
          [control]="formGroup.get(field.name)!"
        ></app-checkbox>

        <div *ngIf="field.helpText" class="help-text">
          {{ field.helpText }}
        </div>
      </div>
    </div>
  `,
  styles: `
    .form-renderer {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .field-container {
      margin-bottom: 0.5rem;
    }

    .help-text {
      font-size: 0.8125rem;
      color: rgb(var(--color-on-surface-variant) / 0.8);
      margin-top: 0.25rem;
      margin-left: 0;
    }
  `
})
export class DynamicFormRendererComponent {
  @Input() formGroup!: FormGroup;
  @Input() fields: FormFieldConfig[] = [];
  @Output() formSubmit = new EventEmitter<any>();

  constructor(public dynamicFormServices: DynamicFormService) {}
}
