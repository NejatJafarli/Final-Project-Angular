<?php

require_once 'db.php';
require_once 'functions.php';

getParams();


$listOfWhereCommand = [];
if (isset($lastId)) $listOfWhereCommand[] = " cars.id > :id";
// if (isset($UserId))
//     if ($_SESSION['user']['id'] == $UserId)
//         $listOfWhereCommand[] = " elan.UserId = :UserId";
if (isset($Make) && $Make != "All") $listOfWhereCommand[] = "Make = :Make";
if (isset($SellerName)) $listOfWhereCommand[] = "SellerName = :SellerName";
if (isset($Model) && $Model != "All") $listOfWhereCommand[] = "Model = :Model";
if (isset($CarType) && $CarType != "All") $listOfWhereCommand[] = "CarTypeName = :CarType";
if (isset($EngineSize) && $EngineSize != "All") $listOfWhereCommand[] = "Engine = :Engine";
if (isset($Power) && $Power != "All") $listOfWhereCommand[] = "EnginePower = :Power";
if (isset($Fuel) && $Fuel != "All") $listOfWhereCommand[] = "FuelName = :Fuel";
if (isset($Gearbox) && $Gearbox != "All") $listOfWhereCommand[] = "GearboxName = :Gearbox";
if (isset($Color) && $Color != "All") $listOfWhereCommand[] = "ColorName = :Color";
if (isset($City) && $City != "All") $listOfWhereCommand[] = "CityName = :City";
if (isset($MinPrice) && is_numeric($MinPrice)) $listOfWhereCommand[] = "Price >= :MinPrice";
if (isset($MaxPrice) && is_numeric($MaxPrice)) $listOfWhereCommand[] = "Price <= :MaxPrice";
if (isset($MinYear) && is_numeric($MinYear)) $listOfWhereCommand[] = "Year >= :MinYear";
if (isset($MaxYear) && is_numeric($MaxYear)) $listOfWhereCommand[] = "Year <= :MaxYear";
if (isset($MinMileage) && is_numeric($MinMileage)) $listOfWhereCommand[] = "MillAge >= :MinMileage";
if (isset($MaxMileage) && is_numeric($MaxMileage)) $listOfWhereCommand[] = "MillAge <= :MaxMileage";

$MySql  = " SELECT cars.id as id,elan.UserId as userid,elan.id as elanid,ColorName as Color,";
$MySql .= " CarTypeName as CarType,FuelName as Fuel,GearboxName as Gearbox,Make,Model,Year,Engine,EnginePower,MillAge as Milage";
$MySql .= " ,Price,PriceType,IsSalon,Description,CityName as SellerCity,SellerName ";
$MySql .= " FROM cars,elan,City,gearbox,fuel,color,carType ";
if(isset($FavUserId))
    $MySql .= ",favories ";
$MySql.=" WHERE";
$MySql .= " cars.id = elan.CarId ";
if(isset($FavUserId))
{
    $MySql .= " AND favories.ElanId = elan.id";
    $MySql .= " AND favories.UserId = :FavUserId";
}
    $MySql .= " AND elan.CityId = City.id";
$MySql .= " AND cars.GearboxId = Gearbox.id";
$MySql .= " AND cars.Fuelid = Fuel.id";
$MySql .= " AND cars.ColorId = Color.id";
$MySql .= " AND cars.CarTypeId = CarType.id ";
$MySql .= " AND Elan.status = 1 ";
if (count($listOfWhereCommand) > 0) $MySql .= " AND " . implode(" AND ", $listOfWhereCommand);
$MySql .= " ORDER BY cars.id ".(isset($limit) ? " LIMIT $limit" : "LIMIT 51");
$stmt = $conn->prepare($MySql);

if (isset($FavUserId)) $stmt->bindParam(':FavUserId', $FavUserId);
if (isset($lastId)) $stmt->bindParam(':id', $lastId);
if (isset($SellerName)) $stmt->bindParam(':SellerName', $SellerName);
if (isset($Make) && $Make != "All") $stmt->bindParam(':Make', $Make);
if (isset($Model) && $Model != "All") $stmt->bindParam(':Model', $Model);
if (isset($CarType) && $CarType != "All") $stmt->bindParam(':CarType', $CarType);
if (isset($EngineSize) && $EngineSize != "All") $stmt->bindParam(':Engine', $EngineSize);
if (isset($Power) && $Power != "All") $stmt->bindParam(':Power', $Power);
if (isset($Fuel) && $Fuel != "All") $stmt->bindParam(':Fuel', $Fuel);
if (isset($Gearbox) && $Gearbox != "All") $stmt->bindParam(':Gearbox', $Gearbox);
if (isset($Color) && $Color != "All") $stmt->bindParam(':Color', $Color);
if (isset($City) && $City != "All") $stmt->bindParam(':City', $City);
if (isset($MinPrice) && is_numeric($MinPrice)) $stmt->bindParam(':MinPrice', $MinPrice);
if (isset($MaxPrice) && is_numeric($MaxPrice)) $stmt->bindParam(':MaxPrice', $MaxPrice);
if (isset($MinYear) && is_numeric($MinYear)) $stmt->bindParam(':MinYear', $MinYear);
if (isset($MaxYear) && is_numeric($MaxYear)) $stmt->bindParam(':MaxYear', $MaxYear);
if (isset($MinMileage) && is_numeric($MinMileage)) $stmt->bindParam(':MinMileage', $MinMileage);
if (isset($MaxMileage) && is_numeric($MaxMileage)) $stmt->bindParam(':MaxMileage', $MaxMileage);
$stmt->execute();
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($result);








// if (isset($lastId)) {

//     $MySql  = " SELECT cars.id as id,elan.UserId as userid,elan.id as elanid,ColorName as Color,";
//     $MySql .= " CarTypeName as CarType,FuelName as Fuel,GearboxName as Gearbox,Make,Model,Year,Engine,EnginePower,MillAge as Milage";
//     $MySql .= " ,Price,PriceType,IsSalon,Description,CityName as SellerCity,SellerName ";
//     $MySql .= " FROM cars,elan,City,gearbox,fuel,color,carType WHERE ";
//     $MySql .= " cars.id = elan.CarId ";
//     $MySql .= " AND elan.CityId = City.id";
//     $MySql .= " AND cars.GearboxId = Gearbox.id";
//     $MySql .= " AND cars.Fuelid = Fuel.id";
//     $MySql .= " AND cars.ColorId = Color.id";
//     $MySql .= " AND cars.CarTypeId = CarType.id ";

//     if (count($listOfWhereCommand) > 0) $MySql .= " AND " . implode(" AND ", $listOfWhereCommand);

//     $MySql .= " ORDER BY cars.id ASC LIMIT 21";


//     $stmt = $conn->prepare($MySql);
//     $stmt->bindParam(':id', $lastId);
//     if (isset($UserId))
//         $stmt->bindParam(':UserId', $UserId);
//     if (isset($Make) && $Make != "All")
//         $stmt->bindParam(':Make', $Make);
//     if (isset($Model) && $Model != "All")
//         $stmt->bindParam(':Model', $Model);
//     if (isset($Color) && $Color != "All")
//         $stmt->bindParam(':Color', $Color);
//     if (isset($CarType) && $CarType != "All")
//         $stmt->bindParam(':CarType', $CarType);
//     if (isset($EngineSize) && $EngineSize != "All")
//         $stmt->bindParam(':Engine', $EngineSize);
//     if (isset($Power) && $Power != "All")
//         $stmt->bindParam(':Power', $Power);
//     if (isset($Fuel) && $Fuel != "All")
//         $stmt->bindParam(':Fuel', $Fuel);
//     if (isset($Gearbox) && $Gearbox != "All")
//         $stmt->bindParam(':Gearbox', $Gearbox);
//     if (isset($City) && $City != "All")
//         $stmt->bindParam(':City', $City);
//     if (isset($MinPrice) && is_numeric($MinPrice))
//         $stmt->bindParam(':MinPrice', $MinPrice);
//     if (isset($MaxPrice) && is_numeric($MaxPrice))
//         $stmt->bindParam(':MaxPrice', $MaxPrice);
//     if (isset($MinYear) && is_numeric($MinYear))
//         $stmt->bindParam(':MinYear', $MinYear);
//     if (isset($MaxYear) && is_numeric($MaxYear))
//         $stmt->bindParam(':MaxYear', $MaxYear);
//     if (isset($MinMileage) && is_numeric($MinMileage))
//         $stmt->bindParam(':MinMileage', $MinMileage);
//     if (isset($MaxMileage) && is_numeric($MaxMileage))
//         $stmt->bindParam(':MaxMileage', $MaxMileage);

//     $stmt->execute();

//     $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

//     echo json_encode($result);
// }
