# 📚 GraphQL Book Library

A modern, full-stack book management application built with **GraphQL**, **Apollo Server**, and **nextjs**. This project demonstrates the power of GraphQL APIs with a beautiful dark-themed user interface.

![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Apollo](https://img.shields.io/badge/Apollo%20GraphQL-311C87?style=for-the-badge&logo=apollo-graphql&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

---

## 🎯 What is This Project?

**GraphQL Book Library** is a full-stack application that allows you to manage a collection of books, authors, and categories. It showcases the implementation of a GraphQL API from scratch and demonstrates how GraphQL differs from traditional REST APIs.

### ✨ Key Features

- 📖 **Book Management** - Add, view, and search books
- ✍️ **Author Tracking** - Manage authors and their books
- 🗂️ **Category Organization** - Organize books by categories
- 🔍 **Advanced Search** - Search across books, authors, and categories
- 📊 **Statistics Dashboard** - View collection insights at a glance
- 🎨 **Modern Dark UI** - Beautiful, responsive interface with smooth animations
- ⚡ **Real-time Updates** - Instant UI updates after mutations

---

## 🚀 How to Use This Project

Follow these steps to get the project up and running:

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/SayanDas07/Book-Management-GraphQL-APIs.git
cd Book-Management-GraphQL-APIs
```

### 2️⃣ Setup Backend (Server)

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Add your data
cd data
```

Modify three JSON files in the `data` folder as per your data:

**Like this->**
**books.json**
```json
[
  {
    "id": "1",
    "title": "The Great Gatsby",
    "authorId": "1",
    "categoryId": "1"
  }
]
```

**authors.json**
```json
[
  {
    "id": "1",
    "name": "F. Scott Fitzgerald"
  }
]
```

**categories.json**
```json
[
  {
    "id": "1",
    "name": "Classic Literature"
  }
]
```

```bash
# Start the server
npm run start
```

Your GraphQL server will be running at `http://localhost:8000` 🚀

### 3️⃣ Setup Frontend

Open a **new terminal** window:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Your Nextjs app will be running at `http://localhost:3000` (or the port shown in terminal) 🎨

---

## 📖 Understanding GraphQL

### 🤔 What is GraphQL?

**GraphQL** is a query language for APIs and a runtime for executing those queries. It was developed by Facebook in 2012 and open-sourced in 2015.

### 🆚 GraphQL vs REST API

| Feature | REST API | GraphQL |
|---------|----------|---------|
| **Endpoints** | Multiple endpoints (`/books`, `/authors`, `/categories`) | Single endpoint (`/graphql`) |
| **Data Fetching** | Fixed data structure per endpoint | Request exactly what you need |
| **Over-fetching** | Common (get more data than needed) | Never (specify fields precisely) |
| **Under-fetching** | Common (need multiple requests) | Never (get all data in one request) |
| **Versioning** | Needs API versioning (`/v1/`, `/v2/`) | No versioning needed (add fields without breaking) |
| **Type Safety** | Not built-in | Strong typing with schema |

### 💡 Why GraphQL is Needed

**Problem with REST:**
```javascript
// REST: Need 3 requests to get book with author and category details
GET /books/1           // Get book
GET /authors/5         // Get author details
GET /categories/2      // Get category details

// REST: Gives all data of that controller
GET /books          // in rest api this API will return all data of all books but if use GraphQL API then we can extract those fields which we need. For that the response time will be faster.
```

**Solution with GraphQL:**
```graphql
# GraphQL: Get everything in 1 request
query {
  getBook(id: "1") {
    title
    author {
      name
    }
    category {
      name
    }
  }
}


getBook() {
    title
} -> This give only title of all books not all data of books
```

### 🎯 Benefits

1. ⚡ **Efficiency** - Fetch multiple resources in a single request
2. 🎨 **Flexibility** - Frontend controls data requirements
3. 📱 **Mobile-Friendly** - Reduce bandwidth usage
4. 🔧 **Developer Experience** - Self-documenting with GraphQL Playground
5. 🚀 **Rapid Development** - Add features without breaking existing queries

---

## 🧩 GraphQL Resolvers Explained

### What are Resolvers?

**Resolvers** are functions that tell GraphQL how to fetch the data for each field in your schema. They're the bridge between your GraphQL schema and your data sources.

### 📋 The GraphQL Flow

```
1. GraphQL Schema → Defines WHAT data exists
2. Resolvers → Define HOW to get that data
```

---

### 🔷 Types of Resolvers

#### 1. **Root/Query Resolvers**

These handle top-level queries - your entry points into the data graph.

```javascript
Query: {
  // Fetch all books
  getBooks: () => getBooks(),
  
  // Fetch a specific book by ID
  getBook: (parent, { id }) => getBook(id),
  
  // Fetch all authors
  getAuthors: () => getAuthors(),
  
  // Fetch a specific author
  getAuthor: (parent, { id }) => getAuthor(id),
  
  // Fetch all categories
  getCategories: () => getCategories()
}
```

**Example Query:**
```graphql
query {
  getBooks {
    id
    title
  }
}
```

---

#### 2. **Field Resolvers**

These resolve nested fields inside a type. GraphQL automatically calls them for each object returned by the root resolver.

```javascript
Book: {
  // When a Book is fetched, resolve its author
  author: (book) => getAuthor(book.authorId),
  
  // When a Book is fetched, resolve its category
  category: (book) => getCategory(book.categoryId)
},

Author: {
  // When an Author is fetched, resolve their books
  books: (author) => getAuthorBooks(author.id)
},

Category: {
  // When a Category is fetched, resolve its books
  books: (category) => getCategoryBooks(category.id)
}
```

**How it works:**
```graphql
query {
  getBooks {
    title           # Root resolver returns this
    author {        # Field resolver fetches author
      name
    }
    category {      # Field resolver fetches category
      name
    }
  }
}
```

**Behind the scenes:**
1. `getBooks()` returns array of books
2. For each book, GraphQL sees you want `author`
3. Automatically calls `Book.author` resolver with the book
4. Same for `category` field

---

#### 3. **Mutation Resolvers**

These handle data modifications (create, update, delete operations).

```javascript
Mutation: {
  // Add a new book to the library
  addBook: (parent, { title, authorName, categoryName }) => 
    addBook(title, authorName, categoryName)
}
```

**Example Mutation:**
```graphql
mutation {
  addBook(
    title: "1984"
    authorName: "George Orwell"
    categoryName: "Dystopian"
  ) {
    id
    title
    author {
      name
    }
  }
}
```

---

### 🔧 Resolver Function Signature

Every resolver follows this standard signature:

```javascript
resolverFunction(parent, args, context, info)
```

#### Parameters Explained:

| Parameter | Description | Example Use Case |
|-----------|-------------|------------------|
| **parent** | The result from the parent resolver | In `Book.author`, parent is the book object |
| **args** | Arguments passed to the field | `{ id: "1" }` in `getBook(id: "1")` |
| **context** | Shared object across all resolvers | Authentication data, database connections |
| **info** | Metadata about the query | Field name, path, schema information |

#### Examples:

**1. Using `parent`:**
```javascript
Book: {
  author: (parent) => {
    // parent is the book object
    console.log(parent); // { id: "1", title: "...", authorId: "5" }
    return getAuthor(parent.authorId);
  }
}
```

**2. Using `args`:**
```javascript
Query: {
  getBook: (parent, args) => {
    console.log(args); // { id: "1" }
    return getBook(args.id);
  }
}

// Destructured version (more common)
Query: {
  getBook: (parent, { id }) => getBook(id)
}
```

**3. Using `context`:**
```javascript
Query: {
  getBooks: (parent, args, context) => {
    // Check if user is authenticated
    if (!context.user) {
      throw new Error("Not authenticated");
    }
    return getBooks();
  }
}
```

**4. Using `info`:**
```javascript
Query: {
  getBooks: (parent, args, context, info) => {
    console.log(info.fieldName); // "getBooks"
    console.log(info.path); // Query path
    return getBooks();
  }
}
```

---

### 🎓 Real-World Example

Let's see how all resolvers work together:

**Query:**
```graphql
query {
  getAuthor(id: "1") {
    name
    books {
      title
      category {
        name
      }
    }
  }
}
```

**Execution Flow:**

1. **Root Resolver** - `Query.getAuthor` runs
   ```javascript
   getAuthor(parent, { id: "1" }) // Returns author object
   ```

2. **Field Resolver** - `Author.books` runs for the author
   ```javascript
   books(author) // author is passed as parent
   // Returns array of books
   ```

3. **Field Resolver** - `Book.category` runs for each book
   ```javascript
   category(book) // each book is passed as parent
   // Returns category for that book
   ```

**Result:**
```json
{
  "data": {
    "getAuthor": {
      "name": "George Orwell",
      "books": [
        {
          "title": "1984",
          "category": {
            "name": "Dystopian"
          }
        },
        {
          "title": "Animal Farm",
          "category": {
            "name": "Political Fiction"
          }
        }
      ]
    }
  }
}
```

---

## 📝 Available GraphQL Operations

### Queries
```graphql
# Get all books
query {
  getBooks {
    id
    title
    author { name }
    category { name }
  }
}

# Get specific book
query {
  getBook(id: "1") {
    title
    author { name }
  }
}

# Get all authors with their books
query {
  getAuthors {
    name
    books { title }
  }
}

# Get all categories
query {
  getCategories {
    name
    books { title }
  }
}
```

### Mutations
```graphql
# Add a new book
mutation {
  addBook(
    title: "New Book"
    authorName: "Author Name"
    categoryName: "Category"
  ) {
    id
    title
    author { name }
    category { name }
  }
}
```
