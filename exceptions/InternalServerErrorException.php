<?php
  class InternalServerErrorException extends Exception {
    protected $message = "There was an error on the server";
    protected $code = 500;
  }