// script.js

// Ensure DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
});

const resultsGrid = document.getElementById('resultsGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalCloseBtn = document.querySelector('.close-btn');

function init() {
    // Initial display: 10 random terms
    displayRandomTerms();

    // Event Listeners
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

function displayRandomTerms() {
    if (typeof allTerms === 'undefined' || allTerms.length === 0) {
        resultsGrid.innerHTML = '<p style="text-align:center; width:100%;">データの読み込みに失敗しました。</p>';
        return;
    }

    const randomTerms = [];
    const usedIndices = new Set();

    // Safety check if we have fewer than 10 terms
    const count = Math.min(10, allTerms.length);

    while (randomTerms.length < count) {
        const randomIndex = Math.floor(Math.random() * allTerms.length);
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            randomTerms.push(allTerms[randomIndex]);
        }
    }

    renderCards(randomTerms);
}

function performSearch() {
    const keyword = searchInput.value.trim().toLowerCase();

    if (!keyword) {
        // If empty, maybe reset to random? Or show alert?
        // Let's reset to random for now to keep it lively
        displayRandomTerms();
        return;
    }

    if (typeof allTerms === 'undefined') return;

    // Search logic: term, reading, meaning, category
    const results = allTerms.filter(item => {
        const term = (item.term || '').toLowerCase();
        const reading = (item.reading || '').toLowerCase();
        const meaning = (item.meaning || '').toLowerCase();
        const category = (item.category || '').toLowerCase();

        return term.includes(keyword) ||
            reading.includes(keyword) ||
            meaning.includes(keyword) ||
            category.includes(keyword);
    });

    renderCards(results);
}

function renderCards(terms) {
    resultsGrid.innerHTML = '';

    if (terms.length === 0) {
        resultsGrid.innerHTML = '<p style="text-align:center; width:100%; color: #666; margin-top: 20px;">該当する用語が見つかりませんでした。</p>';
        return;
    }

    terms.forEach(item => {
        const card = document.createElement('div');
        card.className = 'word-card';
        card.onclick = () => openModal(item);

        const title = document.createElement('div');
        title.className = 'word-term';
        title.textContent = item.term;

        const reading = document.createElement('div');
        reading.className = 'word-reading';
        reading.textContent = item.reading;

        const category = document.createElement('div');
        category.className = 'word-category-badge';
        category.textContent = item.category;

        card.appendChild(title);
        card.appendChild(reading);
        card.appendChild(category);

        resultsGrid.appendChild(card);
    });
}

function openModal(item) {
    document.getElementById('modalTerm').textContent = item.term;
    document.getElementById('modalReading').textContent = item.reading;
    document.getElementById('modalCategory').textContent = item.category;
    document.getElementById('modalMeaning').textContent = item.meaning;

    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
}
