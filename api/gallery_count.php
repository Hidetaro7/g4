<?php
	require('require_admin.php');
	$res = mysql_query('select count(*) from btn') or die(mysql_error());
	$row = mysql_fetch_assoc($res);
	print ($row["count(*)"]);
	/*mysql_close($conn);*/
?> 