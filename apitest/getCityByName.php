
<?php

require_once 'db.php';
require_once 'functions.php';
getParams();


//get image from database
$stmt = $conn->prepare("SELECT * FROM City WHERE CityName = :name");
$stmt->bindParam(":name", $name);
$stmt->execute();
$car = $stmt->fetchAll();

//json encode
echo json_encode($car);
