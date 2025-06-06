// ... (kode calendar.js yang sudah ada) ...
const monthYearElement = document.getElementById('monthYear');
const datesElement = document.getElementById('dates');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentDate = new Date();

const updateCalendar = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() -1; // Adjust so Monday is 0
    const lastDayIndex = lastDay.getDay() === 0 ? 6 : lastDay.getDay() -1; // Adjust so Monday is 0

    const monthYearString = currentDate.toLocaleString('default', {month: 'long', year: 'numeric'});
    monthYearElement.textContent = monthYearString;
    
    let datesHTML = '';

    // Previous month's trailing days
    for (let i = firstDayIndex; i > 0; i--) {
        const prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
        datesHTML += `<div class="date inactive">${prevDate.getDate()}</div>`;
    }

    // Current month's days
    for (let i = 1; i <= totalDays; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const activeClass = date.toDateString() === new Date().toDateString() ? 'active' : '';
        datesHTML += `<div class="date ${activeClass}">${i}</div>`;
    }

    // Next month's leading days
    // Calculate how many cells are needed for the next month's days to fill the grid (6 rows * 7 cols = 42 cells)
    // Or simply fill up to 7 days for the last row
    const remainingCells = 7 - ((firstDayIndex + totalDays) % 7);
    if (remainingCells < 7) { // check to ensure it's not a full week already
        for (let i = 1; i <= remainingCells; i++) {
            const nextDate = new Date(currentYear, currentMonth + 1, i);
            datesHTML += `<div class="date inactive">${nextDate.getDate()}</div>`;
        }
    }
    datesElement.innerHTML = datesHTML;
}

if (prevBtn) {
    prevBtn.addEventListener('click', ()=> {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    })
}

if (nextBtn) {
    nextBtn.addEventListener('click', ()=> {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    })
}

updateCalendar();


// --- Fungsionalitas Modal Tambah Transaksi ---

// Dapatkan elemen modal
const modal = document.getElementById('addTransactionModal');

// Dapatkan tombol yang membuka modal
const addTransactionButton = document.getElementById('addTransactionBtn');

// Dapatkan elemen <span> (x) yang menutup modal
const closeModalButton = document.querySelector('#addTransactionModal .close-btn');

// Dapatkan form transaksi
const transactionForm = document.getElementById('transactionForm');

// Ketika pengguna mengklik tombol +, buka modal
if (addTransactionButton) {
  addTransactionButton.addEventListener('click', function(event) {
    event.preventDefault(); // Mencegah perilaku default tag <a> (navigasi)
    if (modal) {
      modal.style.display = 'block';
    }
  });
}

// Ketika pengguna mengklik <span> (x), tutup modal
if (closeModalButton) {
  closeModalButton.addEventListener('click', function() {
    if (modal) {
      modal.style.display = 'none';
    }
  });
}

// Ketika pengguna mengklik di mana saja di luar konten modal, tutup modal
window.addEventListener('click', function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});

// Menangani submit form (untuk saat ini hanya menampilkan alert dan menutup modal)
if (transactionForm) {
  transactionForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah submit form standar

    // Ambil data dari form (contoh)
    const category = document.getElementById('transactionCategory').value;
    const amount = document.getElementById('transactionAmount').value;
    const note = document.getElementById('transactionNote').value;

    if (!category) {
        alert('Mohon pilih kategori transaksi.');
        return;
    }
    if (!amount) {
        alert('Mohon masukkan jumlah transaksi.');
        return;
    }

    console.log('Data Transaksi:', { category, amount, note });
    alert('Transaksi berhasil ditambahkan (simulasi)! \nKategori: ' + category + '\nJumlah: Rp' + amount + '\nCatatan: ' + note + '\n\nIntegrasi dengan backend PHP akan diperlukan untuk penyimpanan data aktual.');
    
    if (modal) {
      modal.style.display = 'none'; // Tutup modal setelah submit
    }
    transactionForm.reset(); // Reset isi form
  });
}