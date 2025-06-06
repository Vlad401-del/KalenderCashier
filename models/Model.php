<?php
  class Model {
    // todo: tambahkan koneksi database
    // 1. tambahkan kode koneksi database sesuai yang ada di slide
    protected $dbconn;

      public function __construct() {
        $host = 'localhost';
        $dbuser = 'root';
        $dbpass = '';
        $dbname = 'kalendar';
        $dbport = '3306';

        $this->dbconn = new mysqli($host, $dbuser, $dbpass, $dbname, $dbport);

        if ($this->dbconn->connect_errno) {
          die('database connection failure');
        } 
      }
}