<?php  
  
require('./require_admin.php');
  
// GETパラメーターで最大数、自分のみ、いいね数が多い順
$res = mysql_query('SELECT * from btn ORDER BY id DESC') or die(mysql_error());
/*$json = "[";
// 結果を出力します。  
while ($row = mysql_fetch_array($res, MYSQL_NUM)) {  
    $json.='{"id": "' . $row[0] . '", "html": "' . addslashes($row[1]) . '", "css": "' . addslashes($row[2]) . '", "time": "' . $row[3] . '", "watch": "' . $row[4] . '", "like": "' . $row[5] . '", "twitter_id": "' . $row[6] . '", "twitter_name": "' . $row[7] . '", "screen_name": "' . $row[8] . '", "location": "' . $row[9] . '", "description": "' . $row[10] . '", "url": "' . $row[11] . '", "lang": "' . $row[12] . '", "img": "' . $row[13] . '"},';
}
$json.="]";
$json = str_replace("},]", "}]", $json);*/

$json = array();
while ($row = mysql_fetch_object($res)) {
	$isMyBtn = false;
	$isLike = false;
	if(isset($_GET["user"])) {
		$userscreenname = $_GET["user"];
		if($userscreenname == $row->screen_name) {
			$isMyBtn = true;
		}
		if(strstr($row->likers.",", $userscreenname)) {
			$isLike = true;
		}
	}
	$arr = explode(",", $row->likers, 6);
	$liker5 = implode(",", $arr);
	$liker5 = substr($liker5, 0, -1);
	$liker_img_urls = "";
	$liker_sc_name = "";
	$sqlimg = "SELECT * from users WHERE screen_name IN ('".$liker5."')";
	$imgres = mysql_query($sqlimg);
	while ($rowimg = mysql_fetch_object($imgres)) {
		$liker_img_urls .= $rowimg->img.",";
		$liker_sc_name .= $rowimg->screen_name.",";
	}
	
	$json[] = array(
		'id'=> $row->id
		,'html' => $row->html
		,'css' => $row->css
		,'time'=> $row->time
		,'watch'=> $row->watch
		,'like'=> $row->like
		,'twitter_id'=> $row->twitter_id
		/*,'twitter_name'=> $row->twitter_name*/
		,'screen_name'=> $row->screen_name
		/*,'location'=> $row->location*/
		/*,'description'=> $row->description*/
		/*,'url'=> $row->url*/
		,'lang'=> $row->lang
		,'img'=> $row->img
		,'likers'=> $row->likers
		,'is_my_btn'=> $isMyBtn
		,'isLike'=> $isLike
		,'likers_5'=> $liker_img_urls
		,'likers_5_name'=> $liker_sc_name
	);
}

header('Content-type: application/json');
echo json_encode($json);
// 結果セットを開放し、接続を閉じます。  
/*mysql_free_result($res);  
mysql_close($conn);*/
  
?> 