let transactions = [];
let currentPage = 1;
const itemsPerPage = 100; // Số lượng mục trên mỗi trang

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

// Hàm để tải dữ liệu từ file JSON
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

// Hàm để thực hiện tìm kiếm
async function performSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filterValue = document.querySelector('.filter-box select').value;

    let filteredTransactions;

    if (query === '') {
        // Nếu thanh tìm kiếm rỗng, lấy ngẫu nhiên 100 kết quả
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

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('pagination-button');
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentPage = i;
            displayPage(data, currentPage);
            updatePagination(totalItems, currentPage, data);
        });
        paginationContainer.appendChild(button);
    }
}

// Đảm bảo rằng các phần tử tồn tại trước khi thêm sự kiện
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