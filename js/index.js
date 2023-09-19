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
function generateBook(id, judul, penulis, tahun, isComplete) {
  return {
    id,
    judul,
    penulis,
    tahun,
    isComplete,
  };
}

function addBook() {
  const judul = document.getElementById("judul").value;
  const penulis = document.getElementById("penulis").value;
  const tahun = document.getElementById("tahun").value;

  let book = generateBook(generateId(), judul, penulis, tahun, false);

  books.push(book);
  console.log(books);
  saveBook();

  document.dispatchEvent(new Event(RENDER_BOOKS_EVENT));
}

function saveBook() {
  if (!isStorageExist()) return;

  const booksJSON = JSON.stringify(books);
  localStorage.setItem(BOOK_LOCAL_STORAGE_KEY, booksJSON);
}

function makeBookShelf(books) {
  const { id, judul, penulis, tahun, isComplete } = books;

  const judulBuku = document.createElement("h3");
  judulBuku.innerText = judul;

  const penulisBuku = document.createElement("p");
  penulisBuku.innerText = penulis;

  const tahunBuku = document.createElement("p");
  tahunBuku.innerText = tahun;

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

function unmarkedBook(id) {}

function deleteBook(id) {}

function findBook(id) {
  for (const book of books) {
    if (book.id === id) {
      return book;
    }
  }

  return null;
}
// memasukan buku dari local storage ke array books ketika halaman di load
window.addEventListener("load", () => {
  const booksJSON = localStorage.getItem(BOOK_LOCAL_STORAGE_KEY);

  let data = JSON.parse(booksJSON);

  if (booksJSON !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_BOOKS_EVENT));
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("submit").addEventListener("click", addBook);
});

document.addEventListener(RENDER_BOOKS_EVENT, () => {
  const bookOngoing = document.getElementById("book-ongoing");
  const bookDone = document.getElementById("book-done");

  //   bookOngoing.innerHTML = "";
  //   bookDone.innerHTML = "";

  if (books.length !== 0) {
    document.getElementById("book-empty").classList.add("hidden");
  } else {
    document.getElementById("book-empty").classList.remove("hidden");
  }

  //   if (!books.includes(true)) {
  //     document.getElementById("book-done").classList.add("hidden");
  //   } else {
  //     document.getElementById("book-done").classList.remove("hidden");
  //   }

  //   if (!books.includes(false)) {
  //     document.getElementById("book-ongoing").classList.add("hidden");
  //   } else {
  //     document.getElementById("book-ongoing").classList.remove("hidden");
  //   }

  for (const book of books) {
    const bookElement = makeBookShelf(book);
    if (book.isComplete) {
      bookDone.append(bookElement);
    } else {
      bookOngoing.append(bookElement);
    }
  }
});
