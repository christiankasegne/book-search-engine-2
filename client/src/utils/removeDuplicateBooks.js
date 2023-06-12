export const removeDuplicateBooks = (items) => {
    const allBookIds = items.map((book) => book.id);
    const allBooks = items.map((book) => book.volumeInfo);
  
    let duplicateBookIds = [];
    let uniqueBookIds = [];
    let uniqueBooks = [];
  
    for (let i = 0; i < allBookIds.length; i++) {
      if (!uniqueBookIds.includes(allBookIds[i])) {
        uniqueBookIds.push(allBookIds[i]);
        uniqueBooks.push(allBooks[i]);
      } else {
        duplicateBookIds.push({ id: allBookIds[i], index: i });
      }
    }
  
    for (let i = 0; i < uniqueBooks.length; i++) {
      uniqueBooks[i].id = uniqueBookIds[i];
    }
  
    return uniqueBooks;
  };