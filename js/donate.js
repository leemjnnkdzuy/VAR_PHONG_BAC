document.addEventListener('DOMContentLoaded', function() {
    fetch('data/01-12.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Mạng có vấn đề : ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error('Không tồn tại mãng dữ liệu: ' + data);
            }

            data.forEach(donor => {
                donor.Credit = parseFloat(donor.Credit.replace(/\./g, ''));
            });

            data.sort((a, b) => b.Credit - a.Credit);
            const top5Donors = data.slice(0, 50);

            const donateList = document.getElementById('donate-list');

            top5Donors.forEach(donor => {
                const listItem = document.createElement('li');
                const donorName = document.createElement('h1');
                const donorInfo = document.createElement('span');
                const donorDescription = document.createElement('p');

                // Kiểm tra cả hai trường OffsetName và TransactionCode
                let name = donor.OffsetName.trim() || donor.TransactionCode.trim() || 'Ẩn danh';
                if (donor.OffsetName.trim()) {
                    name += ' (Ông/Bà)';
                } else if (donor.TransactionCode.trim()) {
                    name += ` (Mã Giao Dịch)`;
                }

                donorName.textContent = name;
                donorInfo.textContent = `Số tiền: ${donor.Credit.toLocaleString('vi-VN')} VND | Ngày donate: ${donor.Date}`;
                donorDescription.textContent = `Mô tả: ${donor.Description}`;

                listItem.appendChild(donorName);
                listItem.appendChild(donorInfo);
                listItem.appendChild(donorDescription);
                donateList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching donate data:', error));
});