using System.Text.Json;
using backend.Models;

namespace backend.Data
{
    public class BookRepository
    {
        private List<Book> _books;
        private readonly string _jsonFilePath;

        public BookRepository(string jsonFilePath = "Data/books.json")
        {
            _jsonFilePath = jsonFilePath;
            LoadBooks();
        }

        private void LoadBooks()
        {
            string directoryPath = Path.GetDirectoryName(_jsonFilePath);
            if (!string.IsNullOrEmpty(directoryPath) && !Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            if (File.Exists(_jsonFilePath))
            {
                string jsonData = File.ReadAllText(_jsonFilePath);
                _books = JsonSerializer.Deserialize<List<Book>>(jsonData) ?? new List<Book>();
            }
            else
            {
                _books = new List<Book>();

                SaveBooks();
            }
        }

        private void SaveBooks()
        {
            var options = new JsonSerializerOptions
            {
                WriteIndented = true
            };

            string jsonData = JsonSerializer.Serialize(_books, options);
            File.WriteAllText(_jsonFilePath, jsonData);
        }

        public List<Book> GetAllBooks()
        {
            return _books;
        }

        public Book GetBookById(int id)
        {
            return _books.FirstOrDefault(b => b.Id == id);
        }

        public Book AddBook(Book book)
        {
            int newId = _books.Count > 0 ? _books.Max(b => b.Id) + 1 : 1;
            book.Id = newId;

            _books.Add(book);
            SaveBooks();
            return book;
        }

        public Book UpdateBook(Book book)
        {
            var existingBook = _books.FirstOrDefault(b => b.Id == book.Id);
            if (existingBook == null)
                return null;

            existingBook.Title = book.Title;
            existingBook.Author = book.Author;
            existingBook.ISBN = book.ISBN;
            existingBook.PublicationDate = book.PublicationDate;

            SaveBooks();
            return existingBook;
        }

        public bool DeleteBook(int id)
        {
            var book = _books.FirstOrDefault(b => b.Id == id);
            if (book == null)
                return false;

            _books.Remove(book);
            SaveBooks();
            return true;
        }
    }
}