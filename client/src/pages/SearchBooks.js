import React, { useState, useEffect } from "react";
import { Jumbotron, Container, Form, Button } from "react-bootstrap";
import BookList from "../components/BookListSearch";

import { getUserId } from "../utils/getUserId"; 
import { ADD_BOOK } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import { searchGoogleBooks } from "../utils/API";
import { saveBookIds, getSavedBookIds } from "../utils/localStorage";
import { removeDuplicateBooks } from "../utils/removeDuplicateBooks";

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  useEffect(() => {
    return saveBookIds(savedBookIds);
  }, [savedBookIds]);

  let userId = getUserId();

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { items } = await response.json();

      let uniqueBooks = removeDuplicateBooks(items);

      const bookData = uniqueBooks.map((book) => ({
        bookId: book.id,
        authors: book.authors || ["No author to display"],
        title: book.title,
        description: book.description || "No description available.",
        image:
          book.imageLinks?.thumbnail ||
          "https://placehold.jp/16/0000FF/ffffff/300x500.png?text=No%20Image%20Available",
        publishedDate: book.publishedDate || "No publish date",
        previewLink: 
          book.previewLink || "No preview link",
        infoLink: 
          book.infoLink || "No info link",
      }));

      setSearchedBooks(bookData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const [addBook] = useMutation(ADD_BOOK);

  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    try {
      await addBook({
        variables: {
          id: userId,
          ...bookToSave,
        },
      });

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
      
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1 className="d-flex justify-content-center text-center">Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Form.Control
                name="searchInput"
                style={{ width: "65%" }}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                type="text"
                size="lg"
                placeholder="Search by title keywords"
              />
              <Button
                type="submit"
                variant="success"
                className="ml-1"
                style={{ width: "30%" }}
                size="lg"
              >
                Search
              </Button>
            </Form.Row>
            <p className='mt-2 ml-2 small'>* Includes only books with a preview.</p>
          </Form>
        </Container>
      </Jumbotron>

      <BookList
        searchedBooks={searchedBooks}
        savedBookIds={savedBookIds}
        handleSaveBook={handleSaveBook}
        source={"search"}
      />
    </>
  );
};

export default SearchBooks;
