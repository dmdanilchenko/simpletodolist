<?php

//dd connect to db
require_once('config.php');

if(isset($_POST) && !empty($_POST['data'])) { 
	 /* var_dump($data);; */
	 mysql_set_charset('utf8');
	$data = json_decode($_POST['data'],true);

	$operation 		= $data['operation'];

	if($operation=='edit'){

		$id 			= $data['id'];
		$name 			= $data['name'];
		$deadline 		= $data['deadline'];

		$strSQL = "UPDATE `projects` SET `name` = '{$name}', `deadline` = '{$deadline}' WHERE `projects`.`id` = '{$id}';";
		mysql_query($strSQL) or die(mysql_error());

		echo 1;

	} elseif ($operation=='remove'){

		$id 			= $data['id'];

		$strSQL = "DELETE FROM `projects` WHERE `projects`.`id` = '{$id}';";
		mysql_query($strSQL) or die(mysql_error());

		$strSQL = "DELETE FROM `tasks` WHERE `tasks`.`project_id` = '{$id}';";
		mysql_query($strSQL) or die(mysql_error());

		echo 1;

	} elseif ($operation=='addtask'){

		$name 			= $data['taskname'];
		$priority 		= $data['priority'];
		$project_id 	= $data['projectid'];

		$strSQL = "INSERT INTO `tasks` (`id`, `name`, `status`, `priority`, `project_id`) VALUES (NULL, '{$name}', '0', '{$priority}', '{$project_id}')";
		mysql_query($strSQL) or die(mysql_error());

		$strSQL = "SELECT * FROM tasks ORDER BY id DESC;";
		$result = mysql_query($strSQL);

		$row = mysql_fetch_assoc($result);
		//dd return as JSON string
		echo json_encode($row);

	}elseif ($operation=='removetask'){

		$taskid			= $data['taskid'];

		$strSQL = "DELETE FROM `tasks` WHERE `tasks`.`id` = '{$taskid}';";
		mysql_query($strSQL) or die(mysql_error());

		echo 1;
	}elseif ($operation=='statustask'){

		$id			= $data['taskid'];
		$status		= $data['status'];

		$strSQL = "UPDATE `tasks` SET `status` = '{$status}' WHERE `tasks`.`id` = '{$id}';";
		mysql_query($strSQL) or die(mysql_error());

		echo 1;


	}elseif ($operation=='edittask'){
		$id			= $data['taskid'];
		$name		= $data['name'];

		$strSQL = "UPDATE `tasks` SET `name` = '{$name}' WHERE `tasks`.`id` = '{$id}';";
		mysql_query($strSQL) or die(mysql_error());

		echo 1;

	}elseif ($operation=='prioritytask'){
		$thistaskid			= $data['thistaskid'];
		$thisTaskPriority	= $data['thisTaskPriority'];
		$prevtaskid			= $data['prevtaskid'];
		$prevTaskPriority	= $data['prevTaskPriority'];

		$strSQL = "UPDATE `tasks` SET `priority` = '{$prevTaskPriority}' WHERE `tasks`.`id` = '{$thistaskid}';";
		mysql_query($strSQL) or die(mysql_error());



		$strSQL = "UPDATE `tasks` SET `priority` = '{$thisTaskPriority}' WHERE `tasks`.`id` = '{$prevtaskid}';";
		mysql_query($strSQL) or die(mysql_error());

		echo 1;
	}

} else {
	echo 0;
} 




