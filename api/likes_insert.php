<?php  
  
require('require_admin.php');

// post
// likes: {[twitter_id, btn_id, increment], [twitter_id, btn_id, increment], ....}
//setTimeoutで定期的に複数のいいね情報が飛んでくる！！
// ボタンに対してlike数のインクリメント、デクリメントの判断付加を行っている
// さらにlikersに自分の名前をインサートする

if (isset($_POST["likes"])) {
	$data = $_POST['likes'];
	$ary = json_decode($data, true);
	for($i=0; $i<count($ary); $i++){
		$twitter_id = $ary[$i]['twitter_id'];
		$screen_name = $ary[$i]['screen_name'];
		$btn_id = $ary[$i]['id'];
		$increment = $ary[$i]['increment'];
		$sqls = "UPDATE `btn` SET `like`=`like`+".$increment." WHERE `id`=".$btn_id;
		$resource = mysql_query($sqls);
		if (!$resource) {
		    die('クエリーが失敗しました。'.mysql_error());
		}
		//likersにいいねしたscreen_nameを登録
		if($increment > 0) {
			//ない場合登録
			$res = mysql_query("insert into btn (id, likers) values ('".$btn_id."', '".$screen_name."') on duplicate key update id='".$btn_id."', likers='".$screen_name.",';") or die(mysql_error());
		}else{
			//あるやつを消去
			mysql_query("UPDATE btn SET `likers` = REPLACE(`likers`,'".$screen_name.",','') WHERE id=".$btn_id);
		}
		

	}
	/*mysql_close($conn);*/
} else {
	echo "NG! likes";
}
  
?> 