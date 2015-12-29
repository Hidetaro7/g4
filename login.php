<?php session_start();
require "common.php";
require "twitteroauth/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);
$request_token = $connection->oauth('oauth/request_token', array('oauth_callback' => OAUTH_CALLBACK));
$_SESSION['oauth_token'] = $request_token["oauth_token"];
$_SESSION['oauth_token_secret'] = $request_token["oauth_token_secret"];
$url = $connection->url('oauth/authorize', array('oauth_token' => $request_token['oauth_token']));
//print("<a href = \"${url}\" id=\"twitter_login\"><i class=\"fa fa-twitter\"></i>TWITTER LOGIN</a>");

//print("javascript:window.open(\"${url}\")");
header( 'location: '. $url );
?>