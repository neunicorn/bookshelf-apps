const BOOK_LOCAL_STORAGE_KEY = "BOOKS";

books = [];

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveBook() {
  if (!isStorageExist()) return;

  const booksJSON = JSON.stringify(books);
  localStorage.setItem(BOOK_LOCAL_STORAGE_KEY, booksJSON);
  document.dispatchEvent(new Event(RENDER_BOOKS_EVENT));
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

function addBook() {
  const judul = document.getElementById("judul").value;
  const penulis = document.getElementById("penulis").value;
  const tahun = document.getElementById("tahun").value;

  loadDataFromStorage();

  let book = generateBook(generateId(), judul, penulis, tahun, false);

  books.push(book);

  saveBook();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("submit").addEventListener("click", addBook);
});
