import supabase from "./supabase-client.js";

const categoryFilter = document.getElementById("categoryFilter");
const newQuote = document.querySelector("#newQuote");

const text = document.querySelector("#quoteText");
const author = document.querySelector("#quoteAuthor");

// data holders for quotes and categories fetched from Supabase
let quotes = [];
let categories = [];

let lastDisplayedIndex = -1; // Track last displayed quote's index

// Fetch quotes from Supabase
async function fetchQuotes() {
  const { data, error } = await supabase
    .from("quotes")
    .select("id, text, author, category_id, categories(name)");

  if (error) {
    console.error("Error fetching quotes:", error);
    return [];
  }

  // flatten and clean the data
  return data.map((q) => ({
    id: q.id,
    text: q.text,
    author: q.author,
    category: q.categories?.name || "Uncategorized",
  }));
}

// fetch categories from Supabase
async function fetchCategories() {
  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data.map((c) => c.name); // return only category names
}

// populating the dropdown with categories

function populateDropdown(categories) {
  // Clear existing options except "All"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach((category) => {
    let option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Display quotes based on selected category
function displayQuotes(filteredQuotes) {
  if (filteredQuotes.length === 0) {
    text.innerText = "No quotes found for this category.";
    author.innerText = "";
    return; // Stop execution here
  }

  // If only one quote exists, just display it without looping
  if (filteredQuotes.length === 1) {
    lastDisplayedIndex = 0;
    text.innerText = `${filteredQuotes[0].text}`;
    author.innerText = `${filteredQuotes[0].author}`;
    return; // Stop execution here
  }

  let newIndex; // store the index of the new random quote

  // Ensure we get a new quote every time
  do {
    newIndex = Math.floor(Math.random() * filteredQuotes.length);
  } while (newIndex === lastDisplayedIndex && filteredQuotes.length > 1);

  lastDisplayedIndex = newIndex;

  const randomQuote = filteredQuotes[newIndex];
  text.innerText = `${randomQuote.text}`;
  author.innerText = `${randomQuote.author}`;
}

//function to get quotes based on selected category
function getFilteredQuotes() {
  const selectedCategory = categoryFilter.value;
  return selectedCategory === "all"
    ? quotes
    : quotes.filter((q) => q.category === selectedCategory);
}

// Event listener for category selection
categoryFilter.addEventListener("change", function () {
  const filteredQuotes = getFilteredQuotes();
  displayQuotes(filteredQuotes);
});

newQuote.addEventListener("click", function () {
  const filteredQuotes = getFilteredQuotes();
  displayQuotes(filteredQuotes);
});

//Initial display (show any random quote)
async function init() {
  quotes = await fetchQuotes();
  categories = await fetchCategories();

  populateDropdown(categories);
  displayQuotes(quotes);
}

init();

