import React from "react";
import { Jumbotron, Container } from "react-bootstrap";
import BookList from "../components/BookListSaved";
import { getUserId } from "../utils/getUserId";
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import { removeBookId } from "../utils/localStorage";
import Auth from "../utils/auth";

const SavedBooks = () => {
  let userId = getUserId();

  const [removeBook] = useMutation(REMOVE_BOOK);

  let savedBooks = [];
  const { loading, data } = useQuery(QUERY_ME, {
    variables: { id: userId }, 
    skip: !Auth.loggedIn(), 
  });

  if (loading) {
    return <div>Loading...</div>;
  } else if (userId) {
    savedBooks = data.me.savedBooks;

    if (!localStorage.getItem("saved_books") && savedBooks.length > 0) {
      localStorage.setItem(
        "saved_books",
        JSON.stringify(savedBooks.map((element) => element.bookId))
      );
    }
  }

  const handleDeleteBook = async (bookId) => {
    try {
      await removeBook({
        variables: {
          id: userId,
          bookId: bookId,
        },
      });

      removeBookId(bookId);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1 className="d-flex justify-content-center text-center">Viewing saved books!</h1>
        </Container>
      </Jumbotron>

        <BookList
        savedBooks={savedBooks}
        handleDeleteBook={handleDeleteBook}
        source={"saved"}
      />
    </>
  );
};

export default SavedBooks;
