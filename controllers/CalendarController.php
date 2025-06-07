<?php
  include_once "controllers/Controller.php";
  include_once "exceptions/NotFoundException.php";

  class CalendarController extends Controller {
    public function __construct() {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
    }

    /**
     * Memeriksa status login.
     * Jika tidak ada sesi, alihkan (redirect) ke halaman login
     * menggunakan format URL MVC.
     */
    private function checkLogin() {
        if (!isset($_SESSION['user_id'])) {
            // Pengalihan menggunakan header() dengan format ?c=...&m=...
            header('Location: ?c=UserController&m=loginView');
            exit();
        }
    }

    public function index() {
      $this->checkLogin();
      $userId = $_SESSION['user_id'];
      
      // Load kedua model
      $calendarModel = $this->loadModel('Calendar');
      $transactionModel = $this->loadModel('Transaction'); // Gunakan model Transaction

      // 1. Ambil data transaksi harian
      $today = date('Y-m-d');
      $data = $calendarModel->getTransactionsByDate($today, $userId);
      $data['selected_date'] = $today;

      // 2. Ambil daftar kategori untuk form pop-up
      $data['categories'] = $transactionModel->getCategoriesByUser($userId);

      // 3. Kirim semua data ke view
      $this->loadView('calendar', $data);
    }

    public function showTransactions() {
      $this->checkLogin();
      
      if (!isset($_GET['date'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Date parameter is missing.']);
        return;
      }
      
      $date = $_GET['date'];
      if (!preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $date)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid date format. Please use YYYY-MM-DD.']);
        return;
      }
      
      $calendarModel = $this->loadModel('Calendar');
      $userId = $_SESSION['user_id'];
      $data = $calendarModel->getTransactionsByDate($date, $userId);

      header('Content-Type: application/json');
      echo json_encode($data);
    }
  }
?>