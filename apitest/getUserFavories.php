
<?php

require_once 'db.php';
require_once 'functions.php';
getParams();

$stmt = $conn->prepare("SELECT * FROM favories WHERE UserId = :id");
$stmt->bindParam(":id", $id);
$stmt->execute();
$car = $stmt->fetchAll();

echo json_encode($car);
