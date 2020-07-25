import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren } from '@angular/core';
import { GenericValidator } from '../Shared/generic-validator';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { QueryModel } from '../Models/QueryModel';

@Component({
  selector: 'app-contactuspage',
  templateUrl: './contactuspage.component.html',
  styleUrls: ['./contactuspage.component.css']
})
export class ContactuspageComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  pageTitle = 'Send Your Query';
  errorMessage: string;
  querySentMessage: string;
  queryForm: FormGroup;

  queryModel:QueryModel;

    // Use with the generic validation message class
    displayMessage: { [key: string]: string } = {};
    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder) {
    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      personName: {
        required: 'Your name is required.',
        minlength: 'Your name must be at least have 4 characters.',
        maxlength: 'Your name cannot exceed 50 characters.'
      },
      personEmail: {
        required: 'Your email is required.',
        email:'Please enter a valid email.'
      },
      personMobile: {
        required: 'Your mobile no is required.',
        minlength:'Mobile no should contain 10 digits.',
        maxlength:'Mobile no cannot exceed 10 digits.'
      },
      queryText: {
        required: 'Please enter your query',
        minlength:'Query should atleast have 10 characters.'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);

   }

  ngOnInit(): void {
    this.queryForm = this.fb.group({
      personName: ['', [Validators.required,
                         Validators.minLength(4),
                         Validators.maxLength(50)]],
      personEmail: ['', [Validators.required,Validators.email]],
      personMobile: ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10)]],
      queryText:['',[Validators.required,Validators.minLength(10)]]
    });

    this.querySentMessage='';
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.queryForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(300)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.queryForm);
    });
  }

  sendQuery(): void {
    if (this.queryForm.valid) {
      if (this.queryForm.dirty) {
        const p = { ...this.queryModel, ...this.queryForm.value };

        console.log(p);
        this.onSaveComplete();
      } else {
        
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.queryForm.reset();
    this.querySentMessage='We have received your query and will get back to you soon!'
  }

}
