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

function generateId() {
  return +new Date();
}
function generateBook(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function addBook() {
  const judul = document.getElementById("judul").value;
  const penulis = document.getElementById("penulis").value;
  const tahun = document.getElementById("tahun").value;

  let book = generateBook(generateId(), judul, penulis, tahun, false);

  books.push(book);

  document.dispatchEvent(new Event(RENDER_BOOKS_EVENT));
  saveBook();
}

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
  saveBook();
  document.dispatchEvent(new Event(RENDER_BOOKS_EVENT));
}

function unmarkedBook(id) {
  const book = findBook(id);
  if (!book) return;

  book.isComplete = false;
  saveBook();
  document.dispatchEvent(new Event(RENDER_BOOKS_EVENT));
}

function deleteBook(id) {
  const bookIndex = books.findIndex((book) => book.id === id);
  console.log("masuk kesini");
  if (bookIndex === -1) return;

  books.splice(bookIndex, 1);
  saveBook();
  document.dispatchEvent(new Event(RENDER_BOOKS_EVENT));
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

  let data = JSON.parse(booksJSON);
  if (data !== null) {
    for (const book of data) {
      books.push(book);
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

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("submit").addEventListener("click", addBook);
});

document.addEventListener(RENDER_BOOKS_EVENT, () => {
  const bookOngoing = document.getElementById("book-ongoing");
  const bookDone = document.getElementById("book-done");

  const bookOngoingList = document.getElementById("book-ongoing-list");
  const bookDoneList = document.getElementById("book-done-list");

  bookOngoingList.innerHTML = "";
  bookDoneList.innerHTML = "";

  // if (books.length !== 0) {
  //   document.getElementById("book-empty").classList.add("hidden");
  // } else {
  //   document.getElementById("book-empty").classList.remove("hidden");
  // }

  for (const book of books) {
    const bookElement = makeBookShelf(book);
    if (book.isComplete) {
      bookDoneList.append(bookElement);
    } else {
      bookOngoingList.append(bookElement);
    }
  }
});
