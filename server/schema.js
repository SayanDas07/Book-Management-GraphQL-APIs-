const typeDefs = `
    type Book {
        id: ID!
        title: String!
        author: Author!
        category: Category!
    }

    type Author {
        id: ID!
        name: String!
        books: [Book]
    }

    type Category {
        id: ID!
        name: String!
        books: [Book]
    }

    type Query {
        getBooks: [Book]
        getBook(id: ID!): Book
        getAuthors: [Author]
        getAuthor(id: ID!): Author
        getCategories: [Category]
    }

    type Mutation {
        addBook(title: String!, authorName: String!, categoryName: String!): Book

    }
`;


export default typeDefs;
