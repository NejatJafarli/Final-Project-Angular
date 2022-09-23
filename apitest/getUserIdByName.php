
<?php

require_once 'db.php';
require_once 'functions.php';
getParams();
$stmt = $conn->prepare("SELECT * FROM user WHERE Username = :username");
$stmt->bindParam(":username", $name);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);


echo json_encode($user['id']);
