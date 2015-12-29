<?php
	require('require_admin.php');
	$url="";
	if(isset($_GET["name"])) {
		$sql = "SELECT * from users WHERE screen_name='".$_GET["name"]."'";
		$res = mysql_query($sql);
		while ($row = mysql_fetch_assoc($res)) {
			$url = $row['img'];
		}
	}
	print $url;
	/*mysql_close($conn);*/
?> 