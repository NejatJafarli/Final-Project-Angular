
<?php

require_once 'db.php';
require_once 'functions.php';
getParams();

$stmt = $conn->prepare("SELECT PhoneNumber FROM Contacts WHERE CarId = :id");
$stmt->bindParam(":id", $id);
$stmt->execute();
$car = $stmt->fetch();

//json encode
echo json_encode($car);
