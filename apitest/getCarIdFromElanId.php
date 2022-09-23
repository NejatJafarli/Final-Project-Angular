
<?php

require_once 'db.php';
require_once 'functions.php';
getParams();

$stmt = $conn->prepare("SELECT elan.CarId FROM elan WHERE  elan.id = :id");
$stmt->bindParam(":id", $id);
$stmt->execute();
$car = $stmt->fetch();

//json encode
echo json_encode($car);
