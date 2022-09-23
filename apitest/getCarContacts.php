
<?php

require_once 'db.php';
require_once 'functions.php';
getParams();


//get image from database
$stmt = $conn->prepare("SELECT * FROM Contacts WHERE CarId = :id");
$stmt->bindParam(":id", $id);
$stmt->execute();
$car = $stmt->fetchAll();

//json encode
echo json_encode($car);
