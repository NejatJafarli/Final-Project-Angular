<?php

require_once 'db.php';
require_once 'functions.php';
getParams();

//get elan id from car id
$MySql = "SELECT id FROM elan WHERE CarId = :CarId";
$stmt = $conn->prepare($MySql);
$stmt->bindParam(':CarId', $CarId);
$stmt->execute();

$elanId = $stmt->fetch(PDO::FETCH_ASSOC)['id'];

//Add to favories
$MySql = "INSERT INTO favories (UserId,ElanId) VALUES (:UserId,:ElanId)";
$stmt = $conn->prepare($MySql);
$stmt->bindParam(':UserId', $UserId);
$stmt->bindParam(':ElanId', $elanId);
$stmt->execute();

$message="Your car added to favories";
echo json_encode($message);

