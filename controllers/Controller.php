<?php
  class Controller {
    public function loadModel($modelName) {
      $modelClass = ucfirst($modelName);

      $modelFile = "models/{$modelName}.php";

      if (!file_exists($modelFile)) {
        throw new NotFoundException("Model file {$modelFile} not found.");
      }

      include_once "models/Model.php";
      include_once $modelFile;
      
      if (!class_exists($modelClass)) {
        throw new InternalServerErrorException("Model class {$modelName} not found.");
      }

      return new $modelClass();
    }

    public function loadView($viewName, $data = [], $layout = null) {
      foreach ($data as $key => $value) {
        $$key = $value;
      }

      $viewFile = "views/{$viewName}.php";
      
      if (!file_exists($viewFile)) {
        throw new NotFoundException("View file {$viewFile} not found.");
      }

      if ($layout === null) {
        include_once $viewFile;
        return;
      }

      $layoutPath = "views/layouts/{$layout}.php";
      
      if (!file_exists($layoutPath)) {
        throw new NotFoundException("Layout {$layout} not found.");
      }

      include_once $layoutPath;
    }
  }