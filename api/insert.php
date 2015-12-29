<?php  
  
require('require_admin.php');

// この辺り参照
// http://mio-koduki.blogspot.jp/2012/03/phpjavascript-ajax.html

if (isset($_POST["html"])) {
	$html = $_POST["html"];
	$css = $_POST["css"];
	$twitter_id = $_POST["twitter_id"];
	$twitter_name = $_POST["twitter_name"];
	$screen_name = $_POST["screen_name"];
	$location = $_POST["location"];
	$description = $_POST["description"];
	$url = $_POST["url"];
	$lang = $_POST["lang"];
	$img = $_POST["img"];
	//$lens = $ary[$i]['lens'];
	$sqls = "INSERT INTO btn(id,html,css,time,twitter_id,twitter_name,screen_name,location,description,url,lang,img) VALUES (0,'".$html."','".$css."','".date("Y-m-d H:i:s")."','".$twitter_id."','".$twitter_name."','".$screen_name."','".$location."','".$description."','".$url."','".$lang."','".$img."')";
	$res = mysql_query($sqls, $conn);
	if (!$res) {
	    die('クエリーが失敗しました。'.mysql_error());
	} else {
		echo "OK";
	}
	/*mysql_close($conn);*/
} else {
	echo "NG! btn_data";
}
  
?> 