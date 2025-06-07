<?php
  include_once "models/Model.php";

  class Transaction extends Model {
    
    // Mengambil semua kategori milik seorang pengguna
    public function getCategoriesByUser($userId) {
        $query = "SELECT category_id, category, type FROM kategori WHERE user_id = ?";
        $stmt = $this->dbconn->prepare($query);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Menyimpan data transaksi baru ke database
    public function insertTransaction($data) {
        $query = "INSERT INTO transaksi (user_id, category_id, amount, note, date) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->dbconn->prepare($query);
        
        // Gabungkan tanggal dan waktu saat ini
        $datetime = $data['date'] . ' ' . date('H:i:s');

        $stmt->bind_param(
            "iidss",
            $data['user_id'],
            $data['category_id'],
            $data['amount'],
            $data['note'],
            $datetime
        );
        return $stmt->execute();
    }
  }
?>