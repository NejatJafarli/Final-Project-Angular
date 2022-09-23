<?php

require_once 'db.php';
require_once 'functions.php';

getParams();

if (
    isset($UserId) &&
    isset($CarColor) && isset($Fuel) && isset($GearBox) && isset($CarType) &&
    isset($CarMake) && isset($CarModel) && isset($CarYear) && isset($carEngineSize) &&
    isset($carEnginePower) && isset($CarMillage) && isset($CarPrice) && isset($CarPriceType) && isset($car_description) &&
    isset($Status) && isset($car_seller_name) && isset($CarCity) && isset($elanid) && isset($car_seller_phone)
    && isset($IsSalon) && isset($ExtraSelected)
) {
    $sql = "SELECT * FROM `color` WHERE ColorName=:ColorName";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':ColorName', $CarColor);
    $stmt->execute();
    $color = $stmt->fetch(PDO::FETCH_ASSOC);
    $CarColor = $color['id'];

    $sql = "SELECT * FROM `Fuel` WHERE FuelName=:FuelName";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':FuelName', $Fuel);
    $stmt->execute();
    $Fuel = $stmt->fetch(PDO::FETCH_ASSOC);
    $Fuel = $Fuel['id'];

    $sql = "SELECT * FROM `GearBox` WHERE GearBoxName=:GearBoxName";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':GearBoxName', $GearBox);
    $stmt->execute();
    $GearBox = $stmt->fetch(PDO::FETCH_ASSOC);
    $GearBox = $GearBox['id'];

    $sql = "SELECT * FROM `CarType` WHERE CarTypeName=:CarTypeName";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':CarTypeName', $CarType);
    $stmt->execute();
    $CarType = $stmt->fetch(PDO::FETCH_ASSOC);
    $CarType = $CarType['id'];



    $sql = "SELECT * FROM `city` WHERE CityName=:CityName";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':CityName', $CarCity);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $CarCity = $result['id'];


    $sql = "UPDATE elan SET Status=:status,SellerName=:SellerName,CityId=:CityId WHERE id=:id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':status', $Status);
    $stmt->bindParam(':SellerName', $car_seller_name);
    $stmt->bindParam(':CityId', $CarCity);
    $stmt->bindParam(':id', $elanid);
    $stmt->execute();

    $carEngineSize = $carEngineSize / 1000;
    $carEngineSize .= " L";
    $carEngineSize = str_replace(".", ",", $carEngineSize);


    $sql = "UPDATE `cars` SET `ColorId`=:CarColor,`Fuelid`=:Fuel,`GearboxId`=:GearBox,`CarTypeId`=:CarType,`Make`=:CarMake,`Model`=:CarModel,`Year`=:CarYear,`Engine`=:carEngineSize,`EnginePower`=:carEnginePower,`MillAge`=:CarMillage,`Price`=:CarPrice,`PriceType`=:CarPriceType,`IsSalon`=:salon,`Description`=:Description WHERE id=:id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':CarColor', $CarColor);
    $stmt->bindParam(':Fuel', $Fuel);
    $stmt->bindParam(':GearBox', $GearBox);
    $stmt->bindParam(':CarType', $CarType);
    $stmt->bindParam(':CarMake', $CarMake);
    $stmt->bindParam(':CarModel', $CarModel);
    $stmt->bindParam(':CarYear', $CarYear);
    $stmt->bindParam(':carEngineSize', $carEngineSize);
    $stmt->bindParam(':carEnginePower', $carEnginePower);
    $stmt->bindParam(':CarMillage', $CarMillage);
    $stmt->bindParam(':CarPrice', $CarPrice);
    $stmt->bindParam(':CarPriceType', $CarPriceType);
    $stmt->bindParam(':salon', $IsSalon);
    $stmt->bindParam(':Description', $car_description);
    $stmt->bindParam(':id', $CarId);
    $stmt->execute();



    $sql = "SELECT id FROM `extras` WHERE CarId=:id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $CarId);
    $stmt->execute();
    $ExtrasIDS = $stmt->fetchAll();

    $ExtraSelected = explode(",", $ExtraSelected);


    $ExtraId;
    $ExtraSel;
    $sql = "UPDATE `extras` SET `Value`=:Value WHERE id=:id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':Value', $ExtraSel);
    $stmt->bindParam(':id', $ExtraId);
    if (count($ExtraSelected) > count($ExtrasIDS)) {
        for ($i = 0; $i < count($ExtrasIDS); $i++) {
            $ExtraId = $ExtrasIDS[$i]['id'];
            $ExtraSel = $ExtraSelected[$i];
            $stmt->execute();
        }
        $sql = "INSERT INTO `extras` (`CarId`, `Value`) VALUES (:CarId, :Value)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':CarId', $CarId);
        $stmt->bindParam(':Value', $ExtraSel);
        for ($i = count($ExtrasIDS); $i < count($ExtraSelected); $i++) {
            $ExtraSel = $ExtraSelected[$i];
            $stmt->execute();
        }
    } else {
        $counter=0;
        for ($i = 0; $i < count($ExtraSelected); $i++) {
            $ExtraId = $ExtrasIDS[$i]['id'];
            $ExtraSel = $ExtraSelected[$i];
            $stmt->execute();
            $counter++;
        }

        $sql = "DELETE FROM `extras` WHERE id=:id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $ExtraId);

        for ($i = $counter; $i < count($ExtrasIDS); $i++) {

            $ExtraId = $ExtrasIDS[$i]['id'];;
            $stmt->execute();
        }
    }



    $sql = "SELECT * FROM Contacts WHERE CarId=:CarId LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':CarId', $CarId);
    $stmt->execute();
    $contactsId = $stmt->fetch();

    $sql = "UPDATE Contacts SET PhoneNumber=:Phone WHERE CarId=:CarId AND id=:id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':Phone', $car_seller_phone);
    $stmt->bindParam(':CarId', $CarId);
    $stmt->bindParam(':id', $contactsId['id']);
    $stmt->execute();

    $message="Success";


    echo json_encode($message);
} else{

    $message="Error";
    
    echo json_encode($message);
}
