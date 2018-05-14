<?php
require_once "./DataBaseParams.php";
require_once "./DataBaseProducts.php";

$database = new DataBaseProducts($host,$user,$password,$db_name);

echo json_encode($database->getPasswords());

?>