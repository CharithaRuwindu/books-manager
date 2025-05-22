import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable, from } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'https://localhost:7101/api/books';
  
  private axiosInstance = axios.create({
    baseURL: this.apiUrl,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  constructor() { }

  getBooks(): Observable<Book[]> {
    return from(
      this.axiosInstance.get<Book[]>('')
        .then(response => response.data)
    );
  }

  getBook(id: number): Observable<Book> {
    return from(
      this.axiosInstance.get<Book>(`/${id}`)
        .then(response => response.data)
    );
  }

  addBook(book: Book): Observable<Book> {
    return from(
      this.axiosInstance.post<Book>('', book)
        .then(response => response.data)
    );
  }

  updateBook(book: Book): Observable<any> {
    return from(
      this.axiosInstance.put(`/${book.id}`, book)
        .then(response => response.data)
    );
  }

  deleteBook(id: number): Observable<any> {
    return from(
      this.axiosInstance.delete(`/${id}`)
        .then(response => response.data)
    );
  }
}