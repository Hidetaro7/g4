<?php  
  
require('./api/require_admin.php');
  
// SQL クエリを実行します。  
$res = mysql_query('SELECT * from btn ORDER BY id DESC') or die(mysql_error());  
echo "<table>";
echo "<tr><th>id</th><th>html</th><th>css</th><th>time</th></tr>"; 
// 結果を出力します。  
while ($row = mysql_fetch_array($res, MYSQL_NUM)) {  
    echo "<tr><td>" . $row[0] . "</td><td>" . $row[1] . "</td><td>" . $row[2] . "</td><td>" . $row[3] . "</td></tr>";
}
echo "</table>";
// 結果セットを開放し、接続を閉じます。  
mysql_free_result($res);  
mysql_close($conn);  
  
?> 