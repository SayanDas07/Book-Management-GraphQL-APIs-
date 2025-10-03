import books from '../data/books.json' assert { type: 'json' };
import authors from '../data/authors.json' assert { type: 'json' };
import categories from '../data/categories.json' assert { type: 'json' };


//return all books
export function getBooks() {
  return books;
}

//return book by id
export function getBook(id) {
  return books.find((b) => b.id === id);
}

// get all present authors
export function getAuthors() {
  return authors;
}

// get author by id
export function getAuthor(id) {
  return authors.find((a) => a.id === id);
}

// get all present categories
export function getCategories() {
  return categories;
}

// get category by id
export function getCategory(id) {
  return categories.find((c) => c.id === id);
}

// get books by authorId
export function getAuthorBooks(authorId) {
  return books.filter((b) => b.authorId === authorId);
}

// get books by categoryId
export function getCategoryBooks(categoryId) {
  return books.filter((b) => b.categoryId === categoryId);
}

export function addBook(title, authorName, categoryName) {

  let author = authors.find(a => a.name.toLowerCase() === authorName.toLowerCase());
  if (!author) {
    author = { id: String(authors.length + 1), name: authorName };
    authors.push(author);
  }


  let category = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
  if (!category) {
    category = { id: String(categories.length + 1), name: categoryName };
    categories.push(category);
  }

  const newBook = {
    id: String(books.length + 1),
    title,
    authorId: author.id,
    categoryId: category.id
  };
  books.push(newBook);
  return newBook;
}