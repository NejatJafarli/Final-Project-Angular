<?php 

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "CarDealer";

$conn = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
