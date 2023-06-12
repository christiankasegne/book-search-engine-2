export const searchGoogleBooks = (query) => {
  return fetch(
    `https://www.googleapis.com/books/v1/volumes?q=intitle:${query}&filter=partial`
    );
  };
  