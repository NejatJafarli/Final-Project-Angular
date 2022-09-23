<?php

require_once 'db.php';
require_once 'functions.php';
getParams();
$sql  = " SELECT cars.id as id,UserId,elan.id as elanid,ColorName as Color,";
$sql .= " CarTypeName as CarType,FuelName as Fuel,GearboxName as Gearbox,Make,Model,Year,Engine,EnginePower,MillAge as Milage";
$sql .= " ,Price,PriceType,IsSalon,Description,CityName as SellerCity,SellerName ";
$sql .= " FROM cars,elan,City,gearbox,fuel,color,carType WHERE ";
$sql .= " cars.id = elan.CarId ";
$sql .= " AND elan.CityId = City.id";
$sql .= " AND cars.GearboxId = Gearbox.id";
$sql .= " AND cars.Fuelid = Fuel.id";
$sql .= " AND cars.ColorId = Color.id";
$sql .= " AND cars.CarTypeId = CarType.id ";
$sql .= " AND elan.status = 1 ";
if ($query != "All")
    $sql .= " AND make = '$query' ORDER BY cars.id";
else
    $sql .= " ORDER BY cars.id";

$stmt = $conn->prepare($sql);
$stmt->execute();
$cars = $stmt->fetchAll();

echo json_encode($cars);
