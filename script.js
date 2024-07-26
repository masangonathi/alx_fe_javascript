document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
        { text: "Believe in yourself!", category: "Motivation" },
        { text: "You can do it!", category: "Motivation" },
        { text: "Why don’t scientists trust atoms? Because they make up everything!", category: "Humor" }
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');
    const addQuoteButton = document.getElementById('addQuote');

    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
    }

    function addQuote() {
        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();

        if (text === "" || category === "") {
            alert("Please enter both a quote and a category.");
            return;
        }

        quotes.push({ text, category });
        newQuoteText.value = '';
        newQuoteCategory.value = '';
        alert("Quote added successfully!");
    }

    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', addQuote);
});
