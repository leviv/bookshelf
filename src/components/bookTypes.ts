// Enum of all CSV columns
export enum BookFields {
  BookId = "Book Id",
  Title = "Title",
  Author = "Author",
  AuthorLF = "Author l-f",
  AdditionalAuthors = "Additional Authors",
  ISBN = "ISBN",
  ISBN13 = "ISBN13",
  MyRating = "My Rating",
  AverageRating = "Average Rating",
  Publisher = "Publisher",
  Binding = "Binding",
  NumberOfPages = "Number of Pages",
  YearPublished = "Year Published",
  OriginalPublicationYear = "Original Publication Year",
  DateRead = "Date Read",
  DateAdded = "Date Added",
  Bookshelves = "Bookshelves",
  BookshelvesWithPositions = "Bookshelves with positions",
  ExclusiveShelf = "Exclusive Shelf",
  MyReview = "My Review",
  Spoiler = "Spoiler",
  PrivateNotes = "Private Notes",
  ReadCount = "Read Count",
  OwnedCopies = "Owned Copies"
}

// Type describing one row of the CSV
export type Book = {
  [BookFields.BookId]: number;
  [BookFields.Title]: string;
  [BookFields.Author]: string;
  [BookFields.AuthorLF]: string;
  [BookFields.AdditionalAuthors]: string | null;
  [BookFields.ISBN]: string;
  [BookFields.ISBN13]: string;
  [BookFields.MyRating]: number;
  [BookFields.AverageRating]: number;
  [BookFields.Publisher]: string;
  [BookFields.Binding]: string;
  [BookFields.NumberOfPages]: number;
  [BookFields.YearPublished]: number;
  [BookFields.OriginalPublicationYear]: number;
  [BookFields.DateRead]: string | null;
  [BookFields.DateAdded]: string;
  [BookFields.Bookshelves]: string | null;
  [BookFields.BookshelvesWithPositions]: string | null;
  [BookFields.ExclusiveShelf]: string;
  [BookFields.MyReview]: string | null;
  [BookFields.Spoiler]: string | null;
  [BookFields.PrivateNotes]: string | null;
  [BookFields.ReadCount]: number;
  [BookFields.OwnedCopies]: number;
};
