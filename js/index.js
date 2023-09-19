const BOOK_LOCAL_STORAGE_KEY = "BOOKS";
const RENDER_BOOKS_EVENT = "RENDER_BOOKS";

let books = [];

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
  const booksJSON = JSON.stringify(books);
  localStorage.setItem(BOOK_LOCAL_STORAGE_KEY, booksJSON);
}

// memasukan buku dari local storage ke array books ketika halaman di load
window.addEventListener("load", () => {
  const booksJSON = localStorage.getItem(BOOK_LOCAL_STORAGE_KEY);
  if (booksJSON !== null) {
    books = JSON.parse(booksJSON);
  }
});

document.getElementById("submit").addEventListener("click", addBook);
