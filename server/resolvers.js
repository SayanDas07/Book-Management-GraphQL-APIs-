/*
A resolver is a function that tells GraphQL how to get the data for a type or a field.
1. GraphQL schema defines what types and queries/mutations exist.
2. Resolvers define how those queries/mutations actually fetch or modify data.
*/
import { 
  getBooks, 
  getBook, 
  addBook, 
  getAuthors, 
  getAuthor, 
  getCategories, 
  getCategory, 
  getAuthorBooks,
  getCategoryBooks
 } from './controllers/bookController.js';


const resolvers = {

    /*
    Field Resolvers : These resolve nested fields inside a type, like author inside Book or books inside Author. GraphQL automatically calls them for each object returned by the root resolver. when i call getAuthor then author of a particular book is also fetched using this field resolver
    */
  Book: {
    author: (book) => getAuthor(book.authorId),
    category: (book) => getCategory(book.categoryId)
  },
  Author: {
    books: (author) => getAuthorBooks(author.id)
  },
  Category: {
    books: (category) => getCategoryBooks(category.id)
  },

  /*
  Root/Query Resolvers : These resolve top-level queries you define. queries to get all types or top-level data. Like get all books or a specific book by id.
    */
  Query: {
    getBooks: () => getBooks(),
    getBook: (parent, { id }) => getBook(id),
    getAuthors: () => getAuthors(),
    getAuthor: (parent, { id }) => getAuthor(id),
    getCategories: () => getCategories()
  },

  /*
  Mutation Resolvers : These resolve mutations you define. Mutations are used to modify server-side data. Like adding a new book or author.
  */
  Mutation: {
    addBook: (parent, { title, authorName, categoryName }) => addBook(title, authorName, categoryName)
  }
};

export default resolvers;



/*
Every resolver in GraphQL has this standard signature:
resolverFunction(parent, args, context, info)
1. parent → first parameter always exists, but for root mutations it’s not used, so we just write parent or _.
2. { title, authorId, categoryId } → second parameter contains all arguments passed in the mutation.
3. context → third parameter is an object shared across all resolvers, useful for authentication, data sources, etc.
4. info → fourth parameter contains metadata about the query, like the field name and path.
*/