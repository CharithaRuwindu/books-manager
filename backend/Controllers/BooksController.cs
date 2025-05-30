﻿using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookRepository _bookRepository;

        public BooksController(BookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Book>> GetBooks()
        {
            return Ok(_bookRepository.GetAllBooks());
        }

        [HttpGet("{id}")]
        public ActionResult<Book> GetBook(int id)
        {
            var book = _bookRepository.GetBookById(id);

            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }

        [HttpPost]
        public ActionResult<Book> PostBook(Book book)
        {
            if (book == null)
            {
                return BadRequest("Book data is required.");
            }

            if (!string.IsNullOrEmpty(book.ISBN) && _bookRepository.IsbnExists(book.ISBN))
            {
                return Conflict($"A book with ISBN '{book.ISBN}' already exists.");
            }

            var addedBook = _bookRepository.AddBook(book);
            return CreatedAtAction(nameof(GetBook), new { id = addedBook.Id }, addedBook);
        }

        [HttpPut("{id}")]
        public IActionResult PutBook(int id, Book book)
        {
            if (id != book.Id || book == null)
            {
                return BadRequest("Invalid book data or ID mismatch.");
            }

            if (!string.IsNullOrEmpty(book.ISBN) && _bookRepository.IsbnExistsForDifferentBook(book.ISBN, id))
            {
                return Conflict($"A different book with ISBN '{book.ISBN}' already exists.");
            }

            var updatedBook = _bookRepository.UpdateBook(book);
            if (updatedBook == null)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteBook(int id)
        {
            bool result = _bookRepository.DeleteBook(id);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}