<?php
error_reporting(0);
//dd connect to database
$host = 'localhost';
$db_name = 'todo_list';
$login = 'root';
$pswrd = '';
$connect = mysql_connect($host,$login,$pswrd);
/* $connect = mysqli_connect($host, $login, $pswrd); */
if(!$connect){
        exit(mysql_error());	
} else {
        mysql_select_db($db_name, $connect);
}
mysql_query("SET NAMES 'utf-8'");
?>