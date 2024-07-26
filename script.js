document.addEventListener('DOMContentLoaded', () => {
    let quotes = JSON.parse(localStorage.getItem('quotes')) || [
        { id: 1, text: "Belive in yourself!", category: "Motivation"},
        { id: 2, text: "You can do it!", category: "Motivation"},
        { id: 3, text: "Why don't scientists trust atoms? Because they make up everything!", category: "Humor"},
    ];

    const serverUrl = 'https://jsonplaceholder.typicode.com/posts';
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');
    const addQuoteButton = document.getElementById('addQuote');
    const exportQuotesButton = document.getElementById('exportQuotes');
    const importFileInput = document.getElementById('importFile');
    const categoryFilter = document.getElementById('categoryFilter');
    const notification = document.createElement('div');
    document.body.appendChild(notification);

    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    function populateCategoryFilter() {
        const categories = [...new Set(quotes.map(quote => quote.category))];
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        const lastSelectedCategory = localStorage.getItem('selectedCategory');
        if (lastSelectedCategory) {
            categoryFilter.value = lastSelectedCategory;
        }
    }

    function showRandomQuote() {
        const filteredQuotes = categoryFilter.value === 'all' ? quotes : quotes.filter(quote => quotes.category === categoryFilter.value);
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
        sessionStorage.setItem('lastQuote', quoteDisplay.textContent);
    }

    function filterQuotes() {
        localStorage.setItem('selectedCategory', categoryFilter.value);
        showRandomQuote();
    }

    function addQuote() {
        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();

        if (text === "" || category === "") {
            alert("Please enter both a quote and a category.");
            return;
        }

        const newQuote = { id: Date.now(), text, category };
        quotes.push(newQuote);
        saveQuotes();
        populateCategoryFilter();
        syncWithServer(newQuote, 'POST');
        newQuoteText.value = '';
        newQuoteCategory.value = '';
        alert("Quote added successfully!");
    }

    function exportQuotes() {
        const dataStr = JSON.stringify(quotes, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            populateCategoryFilter();
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

    async function fetchFromServer() {
        try {
            const response = await fetch(serverUrl);
            const serverQuotes = await response.json();
            let newQuotes = [];
            serverQuotes.forEach(serverQuote => {
                const exists = quotes.some(localQuote => localQuote.id === serverQuote.id);
                if (!exists) {
                    newQuotes.push(serverQuote);
                }
            });
            if (newQuotes.length > 0) {
                quotes.push(...newQuotes);
                saveQuotes();
                populateCategoryFilter();
                showNotification('New quotes have been fetched from the server.');
            }
        } catch (error) {
            console.error('Error fetching quotes from server:', error);
        }
    }

    async function syncWithServer(quote, method) {
        try {
            await fetch(serverUrl, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quote)
            });
        } catch (error) {
            console.error('Error syncing quote with server:', error);
        }
    }



    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', addQuote);
    exportQuotesButton.addEventListener('click', exportQuotes);
    importFileInput.addEventListener('change', importFromJsonFile);

    // Initial setup
    populateCategoryFilter();
    setInterval(fetchFromServer, 60000); // Check for new quotes every minute

    // Load the last viewed quote from session storage
    const lastQuote = sessionStorage.getItem('lastQuote');
    if (lastQuote) {
        quoteDisplay.textContent = lastQuote;
    } else {
        showRandomQuote();
    }
});
