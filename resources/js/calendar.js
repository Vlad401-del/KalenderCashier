const monthYearElement = document.getElementById('monthYear');
const datesElement = document.getElementById('dates');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const descriptionDateEl = document.getElementById('description-date'); // Pastikan elemen ini terpilih
const descriptionTotalEl = document.getElementById('description-total');
const descriptionTableEl = document.getElementById('description-table');
const calendarSummaryEl = document.getElementById('calendar-summary');

let currentDate = new Date();

// --- Fungsi Helper ---
const formatCurrency = (number) => 'Rp' + new Intl.NumberFormat('id-ID').format(number);

// --- Fungsi Utama untuk Memperbarui Tampilan ---

/**
 * Memperbarui seluruh bagian deskripsi dengan data baru dari server.
 * @param {object} data - Objek data dari server (berisi summary dan transactions).
 * @param {string} dateString - Tanggal dalam format 'YYYY-MM-DD'.
 */
const updateDescriptionView = (data, dateString) => {
    // 1. PERBAIKAN: Memperbarui tampilan tanggal
    if (descriptionDateEl) {
        // Tambahkan log ini untuk debugging. Buka console browser (F12) untuk melihat pesannya.
        console.log(`[Debug] Trying to update date display to: ${dateString}`);
        
        // Buat objek Date dari string YYYY-MM-DD. Menambahkan 'T00:00:00' membantu menghindari masalah timezone.
        const selectedDate = new Date(dateString + 'T00:00:00');
        
        // Format tanggal ke format "7 Juni 2025"
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        descriptionDateEl.textContent = selectedDate.toLocaleDateString('id-ID', options);
    }

    // 2. Memperbarui ringkasan (Pengeluaran, Pemasukan, Saldo)
    if (calendarSummaryEl && data.summary) {
        calendarSummaryEl.innerHTML = `
            <p class="calendar__text__outcomes">Pengeluaran: ${formatCurrency(data.summary.expense)}</p>
            <p class="calendar__text__incomes">Pendapatan: ${formatCurrency(data.summary.income)}</p>
            <p class="calendar__text__balance">Saldo: ${formatCurrency(data.summary.balance)}</p>
        `;
    }
    
    // 3. Memperbarui total pada header deskripsi
    if (descriptionTotalEl && data.summary) {
        descriptionTotalEl.textContent = formatCurrency(data.summary.total);
    }

    // 4. Memperbarui tabel daftar transaksi
    if (descriptionTableEl) {
        let tableHTML = '';
        if (!data.transactions || data.transactions.length === 0) {
            tableHTML = '<p>Tidak ada transaksi pada tanggal ini.</p>';
        } else {
            data.transactions.forEach(transaction => {
                const amountColor = (transaction.type.toLowerCase().includes('pemasukan') || transaction.type.toLowerCase().includes('income')) ? 'green' : '#c5172e';
                tableHTML += `
                    <div class="description__row">
                        <img src="resources/assets/car-icon.png" class="icon-small" />
                        <div class="description__item">${transaction.category}</div>
                        <div class="description__item" style="color: ${amountColor};">
                            ${formatCurrency(transaction.amount)}
                            ${transaction.note ? `<div class="description__timestamp">${transaction.note}</div>` : ''}
                        </div>
                    </div>
                `;
            });
        }
        descriptionTableEl.innerHTML = tableHTML;
    }
};

/**
 * Mengambil data dari server dan memanggil fungsi untuk memperbarui tampilan.
 * @param {string} dateString - Tanggal dalam format 'YYYY-MM-DD'.
 */
const fetchAndDisplayTransactions = async (dateString) => {
    try {
        const response = await fetch(`?c=CalendarController&m=showTransactions&date=${dateString}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        updateDescriptionView(data, dateString); // Panggil fungsi update dengan data dan tanggal
    } catch (error) {
        console.error("Tidak dapat mengambil data transaksi:", error);
        if(descriptionTableEl) descriptionTableEl.innerHTML = '<p style="color: red;">Gagal memuat data.</p>';
    }
};

const updateCalendar = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    monthYearElement.textContent = currentDate.toLocaleString('id-ID', {month: 'long', year: 'numeric'});
    
    let datesHTML = '';
    const prevLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayIndex; i > 0; i--) {
        datesHTML += `<div class="date inactive">${prevLastDay - i + 1}</div>`;
    }

    const today = new Date();
    const activeDateEl = document.querySelector('.date.active');
    let activeDay = null;

    if (activeDateEl && activeDateEl.dataset.fulldate) {
        const activeFullDate = new Date(activeDateEl.dataset.fulldate + 'T00:00:00');
        if (activeFullDate.getMonth() === currentMonth && activeFullDate.getFullYear() === currentYear) {
            activeDay = activeFullDate.getDate();
        }
    } else if (currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
        activeDay = today.getDate();
    }
    
    for (let i = 1; i <= totalDays; i++) {
        const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const activeClass = i === activeDay ? 'active' : '';
        datesHTML += `<div class="date ${activeClass}" data-fulldate="${fullDate}">${i}</div>`;
    }

    const remainingCells = 7 - ((firstDayIndex + totalDays) % 7);
    if (remainingCells < 7) {
        for (let i = 1; i <= remainingCells; i++) {
            datesHTML += `<div class="date inactive">${i}</div>`;
        }
    }
    datesElement.innerHTML = datesHTML;
};

datesElement.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('date') && !target.classList.contains('inactive')) {
        const active = datesElement.querySelector('.active');
        if (active) active.classList.remove('active');
        target.classList.add('active');
        
        const formattedDate = target.dataset.fulldate;
        fetchAndDisplayTransactions(formattedDate);
    }
});

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });
}

updateCalendar();

// --- Fungsionalitas Modal Tambah Transaksi (AJAX) ---

const modal = document.getElementById('addTransactionModal');
const addTransactionButton = document.getElementById('addTransactionBtn');
const closeModalButton = document.querySelector('#addTransactionModal .close-btn');
const transactionForm = document.getElementById('transactionForm');

// Tampilkan modal saat tombol + diklik
if (addTransactionButton) {
  addTransactionButton.addEventListener('click', function(event) {
    if (modal) modal.style.display = 'block';
  });
}

// Sembunyikan modal saat tombol (x) diklik
if (closeModalButton) {
  closeModalButton.addEventListener('click', function() {
    if (modal) modal.style.display = 'none';
  });
}

// Sembunyikan modal saat area di luar modal diklik
window.addEventListener('click', function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});

// Tangani submit form menggunakan AJAX (Fetch)
if (transactionForm) {
  transactionForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah reload halaman

    const formData = new FormData(transactionForm);
    const submitButton = transactionForm.querySelector('.btn-submit-transaction');
    submitButton.textContent = 'Menyimpan...';
    submitButton.disabled = true;

    fetch('?c=TransactionController&m=addProcess', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        alert(data.message);
        modal.style.display = 'none'; // Tutup modal
        transactionForm.reset(); // Kosongkan form
        // Optional: Refresh data kalender untuk tanggal yang aktif
        const activeDate = document.querySelector('.date.active');
        if (activeDate) {
          activeDate.click(); // Pancing klik untuk refresh daftar transaksi
        } else {
            location.reload(); // Atau reload halaman jika tidak ada tanggal aktif
        }
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Fetch Error:', error);
      alert('Terjadi kesalahan koneksi.');
    })
    .finally(() => {
        // Kembalikan tombol ke kondisi semula
        submitButton.textContent = 'Simpan';
        submitButton.disabled = false;
    });
  });
}