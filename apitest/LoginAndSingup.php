<?php

require_once 'db.php';
require_once 'functions.php';

$message;


getParams();


if ($action == "login") {
    $password = md5($password);
    $sql = "SELECT * FROM user WHERE email=:email OR username=:user AND password=:pass";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':user', $email);
    $stmt->bindParam(':pass', $password);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user) {
        $message="Login Successfull";
        echo json_encode($message);

    } else {
        $message="Login Failed";
        echo json_encode($message);
    }
} else if ($action == "signup") {

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $message= "Invalid email format";
        echo json_encode($message);
        exit;
    }
    $sql = "SELECT * FROM user WHERE Username=:user";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':user', $username);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user) {
        $message="Username already exists";
        echo json_encode($message);
        exit;
    }
    //check if email is already taken
    $sql = "SELECT * FROM user WHERE email=:email";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user) {
        $message="Email already exists";
        echo json_encode($message);
        exit;
    }
    if (strlen($password) < 6) {
        $message="Password must be at least 6 characters";
        echo json_encode($message);
        exit;
    }

    $dir = "C:\\Angular\\Final-Project-Angular\\src\\assets\\Profile-Pictures\\";
    $file = basename($_FILES["image"]["name"]);
    $path = $dir . $file;

    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));


    $check = getimagesize($_FILES["image"]["tmp_name"]);


    $ok = $check && in_array($ext, ["jpg", "png", "jpeg"]) && $_FILES["image"]["size"] < 5000000;

    if ($ok) {
        move_uploaded_file($_FILES["image"]["tmp_name"], $path);
        $imageName = $username . "." . $ext;
        rename($dir . $file, $dir . $imageName);
    } else {
        $message="Image is not valid";
        $ok = false;
        $imageName = "default.jpg";
        echo json_encode($message);
    }
    $password = md5($password);
    $sql = "INSERT INTO user (Email, Username, Password, Photo) VALUES (:email, :username, :password, :photo)";
    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':password', $password);
    $stmt->bindParam(':photo', $imageName);
    $stmt->execute();

    $message="Signup Successful";
    echo json_encode($message);
}
