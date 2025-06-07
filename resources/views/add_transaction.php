<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tambah Transaksi Baru</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="resources/css/form.css">
</head>
<body>
    <?php include_once 'header.php'; ?>

    <main class="container my-5">
        <div class="form-container">
            <h2 class="text-center mb-4">Catat Transaksi Baru</h2>
            <form action="?c=TransactionController&m=addProcess" method="post">
                <div class="mb-3">
                    <label for="date" class="form-label">Tanggal Transaksi:</label>
                    <input type="date" class="form-control" id="date" name="date" value="<?= date('Y-m-d') ?>" required>
                </div>

                <div class="mb-3">
                    <label for="category_id" class="form-label">Kategori:</label>
                    <select class="form-select" id="category_id" name="category_id" required>
                        <option value="" disabled selected>Pilih Kategori</option>
                        <?php foreach ($categories as $category): ?>
                            <option value="<?= $category['category_id'] ?>">
                                <?= htmlspecialchars($category['category']) ?> (<?= htmlspecialchars($category['type']) ?>)
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="mb-3">
                    <label for="amount" class="form-label">Jumlah (Rp):</label>
                    <input type="number" class="form-control" id="amount" name="amount" placeholder="Contoh: 50000" required min="0">
                </div>
                
                <div class="mb-3">
                    <label for="note" class="form-label">Catatan:</label>
                    <textarea class="form-control" id="note" name="note" rows="3" placeholder="Contoh: Beli bensin Pertamax"></textarea>
                </div>

                <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-primary">Simpan Transaksi</button>
                    <a href="?c=CalendarController&m=index" class="btn btn-secondary">Batal</a>
                </div>
            </form>
        </div>
    </main>
    
    <?php include_once 'footer.php'; ?>
</body>
</html>