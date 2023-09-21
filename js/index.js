const BOOK_LOCAL_STORAGE_KEY = "BOOKS";
const RENDER_BOOKS_EVENT = "RENDER_BOOKS";

let books = [];

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

// function addBook() {
//   const judul = document.getElementById("judul").value;
//   const penulis = document.getElementById("penulis").value;
//   const tahun = document.getElementById("tahun").value;

//   loadDataFromStorage();

//   let book = generateBook(generateId(), judul, penulis, tahun, false);

//   books.push(book);
//   document.dispatchEvent(new Event(RENDER_EVENT));

//   saveBook();
// }

function saveBook() {
  if (!isStorageExist()) return;

  const booksJSON = JSON.stringify(books);
  localStorage.setItem(BOOK_LOCAL_STORAGE_KEY, booksJSON);
  document.dispatchEvent(new Event(RENDER_BOOKS_EVENT));
}

function makeBookShelf(books) {
  const { id, title, author, year, isComplete } = books;

  const judulBuku = document.createElement("h3");
  judulBuku.innerText = title;

  const penulisBuku = document.createElement("p");
  penulisBuku.innerText = author;

  const tahunBuku = document.createElement("p");
  tahunBuku.innerText = year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("text-container");
  textContainer.append(judulBuku, penulisBuku, tahunBuku);

  const iconContainer = document.createElement("div");
  iconContainer.classList.add("icon-container");

  const container = document.createElement("div");
  container.classList.add("book-container");
  container.append(textContainer);
  container.setAttribute("id", `book-${id}`);

  if (isComplete) {
    const unmarkedButton = document.createElement("button");
    unmarkedButton.classList.add("unmarked-button");
    unmarkedButton.addEventListener("click", function () {
      unmarkedBook(id);
    });

    iconContainer.append(unmarkedButton);
  } else {
    const markedButton = document.createElement("button");
    markedButton.classList.add("marked-button");
    markedButton.addEventListener("click", function () {
      markedBook(id);
    });

    iconContainer.append(markedButton);
  }

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", function () {
    deleteBook(id);
  });

  iconContainer.append(deleteButton);

  container.append(iconContainer);

  return container;
}

function markedBook(id) {
  const book = findBook(id);
  if (!book) return;

  book.isComplete = true;
  checkBooksOngoing();
  checkBooksDone();
  document.dispatchEvent(new Event(RENDER_BOOKS_EVENT));
  saveBook();
}

function unmarkedBook(id) {
  const book = findBook(id);
  if (!book) return;

  book.isComplete = false;
  checkBooksOngoing();
  checkBooksDone();
  document.dispatchEvent(new Event(RENDER_BOOKS_EVENT));
  saveBook();
}

function deleteBook(id) {
  const bookIndex = books.findIndex((book) => book.id === id);
  console.log("masuk kesini");
  if (bookIndex === -1) return;

  books.splice(bookIndex, 1);
  checkBooksOngoing();
  checkBooksDone();
  document.dispatchEvent(new Event(RENDER_BOOKS_EVENT));
  saveBook();
}

function findBook(id) {
  for (const book of books) {
    if (book.id === id) {
      return book;
    }
  }

  return null;
}

function loadDataFromStorage() {
  const booksJSON = localStorage.getItem(BOOK_LOCAL_STORAGE_KEY);

  books = [];

  let data = JSON.parse(booksJSON);
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
}

function checkBooks() {
  if (books.length !== 0) {
    document.getElementById("book-empty").style.display = "none";
  }
}

function checkBooksOngoing() {
  const isBookOngoing = books.some((book) => book.isComplete === false);
  console.log(isBookOngoing);
  if (!isBookOngoing) {
    const containerOnGoing = document.getElementById("book-ongoing");
    containerOnGoing.style.display = "none";
  } else {
    const containerOnGoing = document.getElementById("book-ongoing");
    containerOnGoing.style.display = "flex";
  }
}

function checkBooksDone() {
  const isBookDone = books.some((book) => book.isComplete === true);
  console.log(isBookDone);
  if (!isBookDone) {
    document.getElementById("book-done").style.display = "none";
  } else {
    document.getElementById("book-done").style.display = "flex";
  }
}

function searchFeature() {
  const search = document.getElementById("search").value;
  const bookOngoingList = document.getElementById("book-ongoing-list");
  const bookDoneList = document.getElementById("book-done-list");

  bookOngoingList.innerHTML = "";
  bookDoneList.innerHTML = "";

  for (const book of books) {
    const bookElement = makeBookShelf(book);
    if (book.title.toLowerCase().includes(search.toLowerCase())) {
      if (book.isComplete) {
        bookDoneList.append(bookElement);
      } else {
        bookOngoingList.append(bookElement);
      }
    }
  }
}
// memasukan buku dari local storage ke array books ketika halaman di load
document.addEventListener("DOMContentLoaded", () => {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
  document.dispatchEvent(new Event(RENDER_BOOKS_EVENT));
});

document.addEventListener(RENDER_BOOKS_EVENT, () => {
  checkBooks();
  checkBooksOngoing();
  checkBooksDone();

  const bookOngoingList = document.getElementById("book-ongoing-list");
  const bookDoneList = document.getElementById("book-done-list");

  bookOngoingList.innerHTML = "";

  bookDoneList.innerHTML = "";

  for (const book of books) {
    const bookElement = makeBookShelf(book);
    if (book.isComplete) {
      bookDoneList.append(bookElement);
    } else {
      bookOngoingList.append(bookElement);
    }
  }
});

document.getElementById("search").addEventListener("keyup", searchFeature);
document.getElementById("search").addEventListener("keydown", searchFeature);
