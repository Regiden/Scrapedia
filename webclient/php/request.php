<?php
$_GET["page"] = (isset($_GET["page"]))?$_GET["page"]:"";

switch($_GET["page"])
{
  case ("mostlinked"):
	$link="http://ec2-54-246-66-235.eu-west-1.compute.amazonaws.com:8088/statistics/top20/mostlinked";
    break;
  case ("mostlinks"):
	$link="http://ec2-54-246-66-235.eu-west-1.compute.amazonaws.com:8088/statistics/top20/mostlinks";
    break;
  case ("nolinks"):
 	$link="http://ec2-54-246-66-235.eu-west-1.compute.amazonaws.com:8088/statistics/list/nolinks";
    break;
  case ("unlinked"):
	$link="http://ec2-54-246-66-235.eu-west-1.compute.amazonaws.com:8088/statistics/list/unlinked";
    break;
  default:
 	$link="http://www.google.de";
    break;
}

$body = file_get_contents($link); 
print $body;
?>