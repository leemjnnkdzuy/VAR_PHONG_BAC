let transactions = [];
let currentPage = 1;
const itemsPerPage = 100;

// Hàm để hiển thị kết quả tìm kiếm
function displayResults(results) {
    const resultsBody = document.getElementById('results-body');
    if (!resultsBody) {
        console.error('Element with id "results-body" not found.');
        return;
    }
    resultsBody.innerHTML = ''; // Xóa các kết quả cũ

    results.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.ID}</td>
            <td>${transaction.OffsetName}</td>
            <td>${transaction.TransactionCode}</td>
            <td>${transaction.Date}</td>
            <td>${transaction.Credit}</td>
            <td>${transaction.Description}</td>
        `;
        resultsBody.appendChild(row);
    });
}

async function loadData() {
    try {
        const response = await fetch('../data/01-12.json');
        const data = await response.json();
        transactions = data;
        return data;
    } catch (error) {
        console.error('Error loading data:', error);
        return [];
    }
}

async function performSearch() {
    const queryElement = document.getElementById('search-input');
    const filterElement = document.querySelector('.filter-box select');
    const timeElement = document.querySelector('#time-input input[type="date"]');

    if (!queryElement || !filterElement || !timeElement) {
        console.error('One or more search/filter elements not found.');
        return;
    }

    const query = queryElement.value.toLowerCase();
    const filterValue = filterElement.value;
    const timeValue = timeElement.value;

    let filteredTransactions;

    if (query === '' && filterValue === '' && timeValue === '') {
        // Nếu thanh tìm kiếm rỗng, bộ lọc không được chọn và thời gian không được chọn, lấy ngẫu nhiên 100 kết quả
        filteredTransactions = transactions.sort(() => 0.5 - Math.random()).slice(0, 100);
    } else {
        filteredTransactions = transactions.filter(transaction =>
            transaction.Description && transaction.Description.toLowerCase().includes(query)
        );

        if (filterValue) {
            filteredTransactions = filteredTransactions.filter(transaction => {
                const credit = parseFloat(transaction.Credit.replace(/\./g, '').replace(',', '.'));
                switch (filterValue) {
                    case 'value1':
                        return credit >= 0 && credit <= 100000;
                    case 'value2':
                        return credit > 100000 && credit <= 200000;
                    case 'value3':
                        return credit > 200000 && credit <= 500000;
                    case 'value4':
                        return credit > 500000 && credit <= 1000000;
                    case 'value5':
                        return credit > 1000000 && credit <= 2000000;
                    case 'value6':
                        return credit > 2000000 && credit <= 5000000;
                    case 'value7':
                        return credit > 5000000 && credit <= 10000000;
                    case 'value8':
                        return credit > 10000000 && credit <= 100000000;
                    case 'value9':
                        return credit > 100000000 && credit <= 500000000;
                    case 'value10':
                        return credit > 500000000;
                    default:
                        return true;
                }
            });
        }

        if (timeValue) {
            filteredTransactions = filteredTransactions.filter(transaction => {
                const transactionDate = new Date(transaction.Date);
                const filterDate = new Date(timeValue);
                return transactionDate >= filterDate;
            });
        }
    }

    displayPage(filteredTransactions, currentPage);
    updatePagination(filteredTransactions.length, currentPage, filteredTransactions);
}

// Hàm để hiển thị một trang cụ thể
function displayPage(data, page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = data.slice(start, end);
    displayResults(paginatedData);
}

// Hàm để cập nhật các nút phân trang
function updatePagination(totalItems, currentPage, data) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) {
        console.error('Element with id "pagination" not found.');
        return;
    }
    paginationContainer.innerHTML = ''; // Xóa các nút phân trang cũ

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return; // Không cần phân trang nếu chỉ có một trang

    const createButton = (text, page) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add('pagination-button');
        if (page === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentPage = page;
            displayPage(data, currentPage);
            updatePagination(totalItems, currentPage, data);
        });
        return button;
    };

    if (currentPage > 1) {
        paginationContainer.appendChild(createButton('<', currentPage - 1));
    }

    paginationContainer.appendChild(createButton(1, 1));

    if (currentPage > 3) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        paginationContainer.appendChild(dots);
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        paginationContainer.appendChild(createButton(i, i));
    }

    if (currentPage < totalPages - 2) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        paginationContainer.appendChild(dots);
    }

    if (totalPages > 1) {
        paginationContainer.appendChild(createButton(totalPages, totalPages));
    }

    if (currentPage < totalPages) {
        paginationContainer.appendChild(createButton('>', currentPage + 1));
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const searchButton = document.getElementById('search-button');

    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    } else {
        console.error('Element with id "search-button" not found.');
    }

    // Tải dữ liệu ban đầu và hiển thị trang đầu tiên
    await loadData();
    displayPage(transactions, currentPage);
    updatePagination(transactions.length, currentPage, transactions);
});