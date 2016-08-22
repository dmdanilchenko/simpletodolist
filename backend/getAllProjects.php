<?php
//dd file connect db 
require_once('config.php');

//dd array will anclude all data
$data = array();
 
mysql_set_charset('utf8');
//dd query to db
$sql = "SELECT tasks.id, tasks.name,  tasks.status, tasks.priority, projects.id AS project_id, projects.name AS project_name, projects.deadline
		FROM tasks
		RIGHT JOIN projects ON tasks.project_id = projects.id
		ORDER BY project_id;";
$result = mysql_query($sql); 

//dd fill in array
while($row = mysql_fetch_assoc($result)){	
    $data[] = $row; 
}
//dd return as JSON string
echo json_encode($data);
?>