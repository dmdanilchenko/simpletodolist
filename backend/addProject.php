<?php

//dd connect to db
require_once('config.php');

if(isset($_POST) && !empty($_POST['data'])) { 
	 /* var_dump($data);; */
	 mysql_set_charset('utf8');
	$data = json_decode($_POST['data'],true);
	
	$strSQL = "INSERT INTO `projects` (`ID`, `name`) VALUES ";
	$strSQL .= "(NULL, '');";

	/* var_dump($strSQL); */
	
	mysql_query($strSQL) or die(mysql_error());


	$sql = "SELECT projects.id, projects.name, projects.deadline
		FROM projects
		ORDER BY id DESC;";
	$result = mysql_query($sql);

	$row = mysql_fetch_assoc($result);
	//dd return as JSON string
	echo json_encode($row);

} else {
	echo 0;
} 




