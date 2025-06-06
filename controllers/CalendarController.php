<?php
  include_once "controllers/Controller.php";
  include_once "exceptions/NotFoundException.php";

  class CalendarController extends Controller {
    public function index() {
      $calendarModel = $this->loadModel('Calendar');
      $today = date('Y-m-d');
      $data = $calendarModel->getTransactionsByDate($today);
      $data['selected_date'] = $today;

      $this->loadView('calendar', $data);
    }

    public function showTransactions() {
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
      $data = $calendarModel->getTransactionsByDate($date);

      header('Content-Type: application/json');
      echo json_encode($data);
    }
  }
?>