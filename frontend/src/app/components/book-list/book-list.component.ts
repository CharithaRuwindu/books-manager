import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import { AlertService } from '../../services/alert.service';
import { BookFormComponent } from '../book-form/book-form.component';
import { AlertComponent } from '../alert/alert.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  standalone: true,
  imports: [CommonModule, BookFormComponent, AlertComponent, LoadingSpinnerComponent, ModalComponent]
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  selectedBook: Book | null | Partial<Book> = null;
  isEditing = false;
  isModalOpen = false;
  
  isLoadingBooks = false;
  isDeletingBookId: number | null = null;

  constructor(
    private bookService: BookService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoadingBooks = true;
    this.bookService.getBooks()
      .subscribe({
        next: (data) => {
          this.books = data;
          this.isLoadingBooks = false;
        },
        error: (error) => {
          console.error('Error loading books:', error);
          this.alertService.showError('Failed to load books. Please try again.');
          this.isLoadingBooks = false;
        }
      });
  }

  selectBookForEdit(book: Book): void {
    this.selectedBook = { ...book };
    this.isEditing = true;
    this.isModalOpen = true;
  }

  createNewBook(): void {
    this.selectedBook = {
      id: 0,
      title: '',
      author: '',
      isbn: '',
      publicationDate: ''
    };
    this.isEditing = false;
    this.isModalOpen = true;
  }

  deleteBook(id: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.isDeletingBookId = id;
      this.bookService.deleteBook(id)
        .subscribe({
          next: () => {
            this.books = this.books.filter(book => book.id !== id);
            this.alertService.showSuccess('Book deleted successfully');
            this.isDeletingBookId = null;
          },
          error: (error) => {
            console.error('Error deleting book:', error);
            this.alertService.showError('Failed to delete book. Please try again.');
            this.isDeletingBookId = null;
          }
        });
    }
  }

  clearSelection(): void {
    this.selectedBook = null;
    this.isEditing = false;
    this.isModalOpen = false;
  }

  onBookSaved(): void {
    const action = this.isEditing ? 'updated' : 'added';
    this.alertService.showSuccess(`Book ${action} successfully`);
    this.loadBooks();
    this.clearSelection();
  }

  onModalClose(): void {
    this.clearSelection();
  }

  getModalTitle(): string {
    return this.isEditing ? 'Edit Book' : 'Add New Book';
  }
}