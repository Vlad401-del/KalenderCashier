<?php
  include_once "models/Model.php";

  class Calendar extends Model {
    public function __construct() {
      parent::__construct();
    }

    /**
     * Mengambil data transaksi dan ringkasan (pemasukan, pengeluaran, saldo)
     * berdasarkan tanggal (format YYYY-MM-DD).
     * * Asumsi: Tabel 'transactions' ada dengan kolom 'transaction_date', 'category', 'amount', dan 'type' ('income'/'expense').
     */
    public function getTransactionsByDate($date) {
        // Contoh query untuk mengambil data dari database
      // $query = "SELECT * FROM transactions WHERE transaction_date = ?";
      // $stmt = $this->dbconn->prepare($query);
      // $stmt->bind_param("s", $date);
      // $stmt->execute();
      // return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      $query = "SELECT category, amount, type, note FROM transactions WHERE transaction_date = ?";
      $stmt = $this->dbconn->prepare($query);
      if (!$stmt) {
        return ['error' => 'Query preparation failed: ' . $this->dbconn->error];
      }
      $stmt->bind_param("s", $date);
      $stmt->execute();
      $transactions = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      $stmt->close();

      $income = 0;
      $expense = 0;
      foreach ($transactions as $transaction) {
        if ($transaction['type'] == 'income') {
          $income += $transaction['amount'];
        } else {
          $expense += $transaction['amount'];
        }
      }

      return [
        'transactions' => $transactions,
        'summary' => [
          'income' => $income,
          'expense' => $expense,
          'balance' => $income - $expense,
          'total' => $income - $expense
        ]
      ];
    }
  }
?>