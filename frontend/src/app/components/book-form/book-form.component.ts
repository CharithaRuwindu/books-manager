import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import { AlertService } from '../../services/alert.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent]
})
export class BookFormComponent implements OnInit {
  @Input() book: Book | Partial<Book> = {} as Partial<Book>;
  @Input() isEditMode = false;
  @Output() bookSaved = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();
  
  bookForm!: FormGroup;
  submitted = false;
  isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder, 
    private bookService: BookService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.bookForm = this.formBuilder.group({
      title: [this.book.title || '', [Validators.required]],
      author: [this.book.author || '', [Validators.required]],
      isbn: [this.book.isbn || '', [Validators.required, Validators.pattern(/^[0-9-]{10,17}$/)]],
      publicationDate: [this.formatDate(this.book.publicationDate) || '', [Validators.required]]
    });
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.bookForm.invalid) {
      this.alertService.showError('Please fix the form errors before submitting.');
      return;
    }

    this.isSubmitting = true;

    const bookData: Book = {
      id: (this.book.id !== undefined) ? this.book.id : 0,
      title: this.bookForm.value.title ?? '',
      author: this.bookForm.value.author ?? '',
      isbn: this.bookForm.value.isbn ?? '',
      publicationDate: this.bookForm.value.publicationDate ?? ''
    };

    const operation = this.isEditMode 
      ? this.bookService.updateBook(bookData)
      : this.bookService.addBook(bookData);

    operation.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.bookSaved.emit();
      },
      error: (error) => {
        console.error('Error saving book:', error);
        const action = this.isEditMode ? 'update' : 'add';
        this.alertService.showError(`Failed to ${action} book. Please try again.`);
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.cancelEdit.emit();
  }
}