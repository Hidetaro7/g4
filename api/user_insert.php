<?php  
  
require('require_admin.php');

// この辺り参照
// http://mio-koduki.blogspot.jp/2012/03/phpjavascript-ajax.html
if(isset($_POST["twitter_id"])) {
	$twitter_id = $_POST["twitter_id"];
	$twitter_name = $_POST["twitter_name"];
	$screen_name = $_POST["screen_name"];
	$location = $_POST["location"];
	$description = $_POST["description"];
	$url = $_POST["url"];
	$lang = $_POST["lang"];
	$img = $_POST["img"];
	// まずはuser重複チェッック
	$res = mysql_query('SELECT * from users ORDER BY id DESC') or die(mysql_error());
	$data = "";
	$flg = false;
	while ($row = mysql_fetch_array($res, MYSQL_NUM)) {
		if($twitter_id === $row[1]) {
			$flg = true;
		}
	}
	if(!$flg) {
		//登録可能
		$sqls = "INSERT INTO users(id,twitter_id,twitter_name,screen_name,location,description,url,lang,img) VALUES (0,'".$twitter_id."','".$twitter_name."','".$screen_name."','".$location."','".$description."','".$url."','".$lang."','".$img."')";
		$res = mysql_query($sqls, $conn);
		if (!$res) {
		    die('クエリーが失敗しました。'.mysql_error());
		} else {
			echo "ユーザー新規登録しました";
		}
	}else{
		print("ユーザー新規登録しませんでした");
	}

	//mysql_free_result($res);  
	/*mysql_close($conn);*/
}

  
?> 