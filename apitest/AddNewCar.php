<?php

require_once 'db.php';
require_once 'functions.php';

getParams();

// print_r($_REQUEST);
if (
    isset($CarColor) && isset($Fuel) && isset($GearBox) && isset($CarType) &&
    isset($CarMake) && isset($CarModel) && isset($CarYear) && isset($carEngineSize) &&
    isset($carEnginePower) && isset($CarMillage) && isset($CarPrice) && isset($car_description)
    &&isset($UserId)
) {

    $sql = "SELECT * FROM `color` WHERE ColorName=:ColorName";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':ColorName', $CarColor);
    $stmt->execute();
    $color = $stmt->fetch(PDO::FETCH_ASSOC);
    $color_id = $color['id'];

    $sql = "SELECT * FROM `Fuel` WHERE FuelName=:FuelName";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':FuelName', $Fuel);
    $stmt->execute();
    $Fuel = $stmt->fetch(PDO::FETCH_ASSOC);
    $FuelId = $Fuel['id'];

    $sql = "SELECT * FROM `GearBox` WHERE GearBoxName=:GearBoxName";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':GearBoxName', $GearBox);
    $stmt->execute();
    $GearBox = $stmt->fetch(PDO::FETCH_ASSOC);
    $GearBoxId = $GearBox['id'];

    $sql = "SELECT * FROM `CarType` WHERE CarTypeName=:CarTypeName";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':CarTypeName', $CarType);
    $stmt->execute();
    $CarType = $stmt->fetch(PDO::FETCH_ASSOC);
    $CarTypeId = $CarType['id'];


    $sql = "INSERT INTO `cars`(`ColorId`, `Fuelid`, `GearboxId`, `CarTypeId`, `Make`, `Model`, `Year`, `Engine`, `EnginePower`, `MillAge`, `Price`, `PriceType`, `IsSalon`, `Description`) VALUES";
    $carEnginePower = $carEnginePower;

    $carEngineSize = $carEngineSize / 1000;
    $carEngineSize .= " L";
    $carEngineSize = str_replace(".", ",", $carEngineSize);
    $sql .= "(:CarColor,:Fuel,:GearBox,:CarType,:CarMake,:CarModel,:CarYear,:carEngineSize,:carEnginePower,:CarMillage,:CarPrice,:CarPriceType,'0',:Description)";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':CarColor', $color_id);
    $stmt->bindParam(':Fuel', $FuelId);
    $stmt->bindParam(':GearBox', $GearBoxId);
    $stmt->bindParam(':CarType', $CarTypeId);
    $stmt->bindParam(':CarMake', $CarMake);
    $stmt->bindParam(':CarModel', $CarModel);
    $stmt->bindParam(':CarYear', $CarYear);
    $stmt->bindParam(':carEngineSize', $carEngineSize);
    $stmt->bindParam(':carEnginePower', $carEnginePower);
    $stmt->bindParam(':CarMillage', $CarMillage);
    $stmt->bindParam(':CarPrice', $CarPrice);
    $stmt->bindParam(':CarPriceType', $CarPriceType);
    $stmt->bindParam(':Description', $car_description);

    $stmt->execute();

    $last_id = $conn->lastInsertId();

    // // //ADD image to car there
    $images[] = "";
    $dir = "C:\\Angular\\Final-Project-Angular\\src\\assets\\Cars\\";
    $i = -1;
    foreach ($_FILES['car_image']['name'] as $row => $name) {
        $i = $i + 1;
        $file = basename($name);
        $path = $dir . $file;

        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));


        $check = getimagesize($_FILES["car_image"]["tmp_name"][$row]);


        $ok = $check && in_array($ext, ["jpg", "png", "jpeg"]) &&
            $_FILES["car_image"]["size"][$row] < 5000000;

        if ($ok) {
            move_uploaded_file($_FILES["car_image"]["tmp_name"][$row], $path);
            $images[] = $imageName = $last_id . '-' . $CarMake . '-' . $CarModel . '-' . $i . '.' . $ext;
            rename($dir . $file, $dir . $imageName);
        }
    }


    array_shift($images);


    foreach ($images as $key) {
        $sql = "INSERT INTO `images`(`Value`, `CarId`) VALUES (:Value,:CarId)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':Value', $key);
        $stmt->bindParam(':CarId', $last_id);
        $stmt->execute();
    }


    //extras

    //split string to array
    $ExtraSelected = explode(",", $ExtraSelected);

    foreach ($ExtraSelected as $key) {
        $sql = "INSERT INTO `extras`(`Value`,`CarId`) VALUES";
        $sql .= "(:Value,:CarId)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':Value', $key);
        $stmt->bindParam(':CarId', $last_id);
        $stmt->execute();
    }


    //remove first 4 char

    // 055-844-88-31
    $start = substr($car_seller_phone, 0, strlen($car_seller_phone) - (strlen($car_seller_phone) - 3));
    $start = '(' . $start . ') ';
    $car_seller_phone = substr($car_seller_phone, 4);

    // (055) 844-88-31
    $car_seller_phone = $start . $car_seller_phone;
    //add contact info to car
    $sql = "INSERT INTO `contacts`(`PhoneNumber`,`CarId`) VALUES";
    $sql .= "(:PhoneNumber,:CarId)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':PhoneNumber', $car_seller_phone);
    $stmt->bindParam(':CarId', $last_id);

    $stmt->execute();

    $sql = "SELECT * FROM `city` WHERE CityName=:CityName";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':CityName', $CarCity);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $cityid = $result['id'];

//get user with username

    // $sql = "SELECT * FROM `user` WHERE Username=:Username";
    // $stmt = $conn->prepare($sql);
    // $stmt->bindParam(':Username', $UserName);
    // $stmt->execute();
    // $result = $stmt->fetch(PDO::FETCH_ASSOC);
    // // $userid = $result['id'];


    // echo json_decode($result);

    $sql = "INSERT INTO `elan`(`UserId`,`SellerName`,`CityId`,`CarId`,`Status`) VALUES";
    $sql .= "(:UserId,:SellerName,:CityId,:CarId,1)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':UserId', $UserId);
    $stmt->bindParam(':SellerName', $car_seller_name);
    $stmt->bindParam(':CityId', $cityid);
    $stmt->bindParam(':CarId', $last_id);
    $stmt->execute();

    $message = "success";
    echo json_encode($message);
} else {
    $message = "error";
    echo json_encode($message);
}
