"use client";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";
import { BookOpen, Users, FolderOpen, Plus, Search, X, Library } from "lucide-react";

const GET_BOOKS = gql`
  query GetBooks {
    getBooks {
      id
      title
      author {
        id
        name
      }
      category {
        id
        name
      }
    }
  }
`;

const GET_AUTHORS = gql`
  query GetAuthors {
    getAuthors {
      id
      name
      books {
        id
        title
      }
    }
  }
`;

const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
      books {
        id
        title
      }
    }
  }
`;

const ADD_BOOK = gql`
  mutation AddBook($title: String!, $authorName: String!, $categoryName: String!) {
    addBook(title: $title, authorName: $authorName, categoryName: $categoryName) {
      id
      title
      author {
        id
        name
      }
      category {
        id
        name
      }
    }
  }
`;

export default function App() {
  const [activeTab, setActiveTab] = useState("books");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    authorName: "",
    categoryName: ""
  });

  const { data: booksData, loading: booksLoading } = useQuery(GET_BOOKS);
  const { data: authorsData, loading: authorsLoading } = useQuery(GET_AUTHORS);
  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES);

  const [addBook, { loading: addingBook }] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }, { query: GET_AUTHORS }, { query: GET_CATEGORIES }],
    onCompleted: () => {
      setFormData({ title: "", authorName: "", categoryName: "" });
      setShowAddForm(false);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addBook({ variables: formData });
  };

  const filteredBooks = booksData?.getBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAuthors = authorsData?.getAuthors.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categoriesData?.getCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: "books", label: "Books", icon: BookOpen, count: booksData?.getBooks.length || 0 },
    { id: "authors", label: "Authors", icon: Users, count: authorsData?.getAuthors.length || 0 },
    { id: "categories", label: "Categories", icon: FolderOpen, count: categoriesData?.getCategories.length || 0 }
  ];

  const totalBooks = booksData?.getBooks.length || 0;
  const totalAuthors = authorsData?.getAuthors.length || 0;
  const totalCategories = categoriesData?.getCategories.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-gray-800 border-b border-gray-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <Library className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Book Library</h1>
                <p className="text-gray-400 text-sm">With GRAPHQL API</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 justify-center font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Add Book
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total Books</p>
                <p className="text-4xl font-bold text-white mt-2">{totalBooks}</p>
              </div>
              <div className="bg-blue-500 bg-opacity-30 p-4 rounded-xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Authors</p>
                <p className="text-4xl font-bold text-white mt-2">{totalAuthors}</p>
              </div>
              <div className="bg-purple-500 bg-opacity-30 p-4 rounded-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-200 text-sm font-medium">Categories</p>
                <p className="text-4xl font-bold text-white mt-2">{totalCategories}</p>
              </div>
              <div className="bg-pink-500 bg-opacity-30 p-4 rounded-xl">
                <FolderOpen className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search books, authors, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 shadow-lg"
            />
          </div>
        </div>

        {showAddForm && (
          <div className="mb-6 bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Plus className="w-6 h-6 text-blue-400" />
                Add New Book
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Book Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  placeholder="Enter book title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Author Name</label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  placeholder="Enter author name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.categoryName}
                  onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  placeholder="Enter category"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={addingBook || !formData.title || !formData.authorName || !formData.categoryName}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
                >
                  {addingBook ? "Adding..." : "Add Book"}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex gap-2 bg-gray-800 p-2 rounded-xl shadow-lg border border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-3 font-medium transition-all flex items-center justify-center gap-2 rounded-lg ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                    : "bg-transparent text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.id
                    ? "bg-white text-purple-600"
                    : "bg-gray-700 text-gray-300"
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          {activeTab === "books" && (
            <div>
              {booksLoading ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-blue-500"></div>
                  <p className="text-gray-400 mt-4">Loading books...</p>
                </div>
              ) : filteredBooks?.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-lg">No books found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {filteredBooks?.map((book) => (
                    <div
                      key={book.id}
                      className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-5 hover:shadow-xl transition-all transform hover:scale-105 border border-gray-600 cursor-pointer"
                      onClick={() => setSelectedBook(book)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">{book.title}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span>{book.author.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="px-3 py-1 bg-purple-600 bg-opacity-30 text-purple-300 rounded-full text-xs font-medium">
                            {book.category.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "authors" && (
            <div>
              {authorsLoading ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-purple-500"></div>
                  <p className="text-gray-400 mt-4">Loading authors...</p>
                </div>
              ) : filteredAuthors?.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-lg">No authors found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {filteredAuthors?.map((author) => (
                    <div key={author.id} className="p-6 hover:bg-gray-700 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-full">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{author.name}</h3>
                          <p className="text-sm text-gray-400">
                            {author.books.length} {author.books.length === 1 ? "book" : "books"}
                          </p>
                        </div>
                      </div>
                      {author.books.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {author.books.map((book) => (
                            <span
                              key={book.id}
                              className="px-3 py-1.5 bg-blue-600 bg-opacity-20 text-blue-300 rounded-lg text-sm font-medium border border-blue-600 border-opacity-30"
                            >
                              {book.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "categories" && (
            <div>
              {categoriesLoading ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-pink-500"></div>
                  <p className="text-gray-400 mt-4">Loading categories...</p>
                </div>
              ) : filteredCategories?.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-lg">No categories found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                  {filteredCategories?.map((category) => (
                    <div key={category.id} className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-6 hover:shadow-xl transition-all border border-gray-600">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-br from-pink-500 to-red-600 p-3 rounded-lg">
                          <FolderOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{category.name}</h3>
                          <p className="text-sm text-gray-400">
                            {category.books.length} {category.books.length === 1 ? "book" : "books"}
                          </p>
                        </div>
                      </div>
                      {category.books.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {category.books.map((book) => (
                            <span
                              key={book.id}
                              className="px-3 py-1.5 bg-purple-600 bg-opacity-20 text-purple-300 rounded-lg text-sm font-medium border border-purple-600 border-opacity-30"
                            >
                              {book.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50" onClick={() => setSelectedBook(null)}>
          <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-xl">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedBook.title}</h2>
                  <p className="text-gray-400 mt-1">Book Details</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBook(null)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Author</p>
                <p className="text-lg font-semibold text-white">{selectedBook.author.name}</p>
              </div>
              
              <div className="bg-gray-700 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Category</p>
                <span className="inline-block px-4 py-2 bg-purple-600 bg-opacity-30 text-purple-300 rounded-lg font-medium">
                  {selectedBook.category.name}
                </span>
              </div>

              <div className="bg-gray-700 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-1">Book ID</p>
                <p className="text-white font-mono">{selectedBook.id}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedBook(null)}
              className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}