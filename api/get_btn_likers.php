<?php  
  
require('./require_admin.php');


$ids = $_GET["ids"];
// SQL クエリを実行します。  
$res = mysql_query('SELECT * from btn WHERE `id` IN('.$ids.')') or die(mysql_error());

$user= array();
while ($row = mysql_fetch_object($res)) {
	$lks="";
	if(isset($_GET["mini"])) {
		$lks = explode(",", $row->likers, 6);
		if(count($lks) > 1) {
			array_pop($lks);
		}
		//$lks = implode(",", $arr)."ssss";
	}else{
		$lks=explode(",", $row->likers);
	}
 $user[] = array(
    'id'=> $row->id
    ,'likers' => $lks
    );
}
header('Content-type: application/json');
echo json_encode($user);
 
/*mysql_close($conn);*/
  
?> 