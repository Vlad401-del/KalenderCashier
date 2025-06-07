<?php
  include_once "controllers/Controller.php";

  class TransactionController extends Controller {
    public function __construct() {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
    }

    private function checkLogin() {
        if (!isset($_SESSION['user_id'])) {
            header('Location: ?c=UserController&m=loginView');
            exit();
        }
    }

    // Menampilkan halaman form tambah transaksi
    public function addView() {
        $this->checkLogin();
        // Load model untuk mengambil data kategori
        $transactionModel = $this->loadModel('Transaction');
        $categories = $transactionModel->getCategoriesByUser($_SESSION['user_id']);
        
        // Kirim data kategori ke view
        $this->loadView('add_transaction', ['categories' => $categories]);
    }

    // Memproses data dari form
    public function addProcess() {
        $this->checkLogin();
        $response = ['status' => 'error', 'message' => 'Invalid request.'];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = [
                'category_id' => $_POST['category_id'],
                'amount' => $_POST['amount'],
                'note' => $_POST['note'],
                'date' => $_POST['date'],
                'user_id' => $_SESSION['user_id']
            ];

            $transactionModel = $this->loadModel('Transaction');
            if ($transactionModel->insertTransaction($data)) {
                $response = ['status' => 'success', 'message' => 'Transaksi berhasil disimpan!'];
            } else {
                $response['message'] = 'Gagal menyimpan transaksi ke database.';
            }
        }
        
        // Kembalikan respons dalam format JSON
        header('Content-Type: application/json');
        echo json_encode($response);
        exit();
    }
  }
?>