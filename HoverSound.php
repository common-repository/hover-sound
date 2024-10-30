<?php
/*
Plugin Name: Hover Sound
Plugin URI: http://tempspace.net/plugins/?page_id=308
Description: You can introduce the behavior of playing sound by hovering mouse pointer on an HTML element and stopping playing sound by putting the mouse pointer away from the HTML element.
Version: 1.0.0
Author: Atsushi Ueda
Author URI: http://tempspace.net/plugins/
License: GPL2
*/

define("HVS_DEBUG", 0);

//function dbg2($str){$fp=fopen("/tmp/smdebug.txt","a");fwrite($fp,$str . "\n");fclose($fp);}

function hoverSound_init() {
	wp_enqueue_script('jquery');
}
add_action('init', 'hoverSound_init');


$hover_sound_number = 1;
$hoverSound_plugin_URL = get_option( 'siteurl' ) . '/wp-content/plugins/' . plugin_basename(dirname(__FILE__));


function HoverSound_filter_0($raw_text) 
{
	$ret = mb_ereg_replace("\]<br />[\n]\[hoversound", "] [hoversound", $raw_text);
	$ret = mb_ereg_replace("[\n]*\[hoversound", "[hoversound", $ret);
	$ret = mb_ereg_replace("\]\[hoversound", "] [hoversound", $ret);
	return $ret;
}
add_filter('the_content',  "HoverSound_filter_0", 10) ;


function HoverSound_shortcode($atts, $content = null) {
	global $hover_sound_number;

	$autoload = "true";
	$id = "";
	$url = "http://example.com/a.mp3";

	do_shortcode($content);
	extract($atts);

	$hs_var = "hoversound_".$hover_sound_number;
	$ret .= "<input type=\"hidden\" id=\"".$hs_var."\" value=\""
		. $id
		. '|'  
		. $url
		. '|' 
		. $autoload
		. "\">\n";

	$hover_sound_number ++;
	return $ret;
}

add_shortcode('hoversound', 'HoverSound_shortcode',11);
add_filter('widget_text', 'do_shortcode');



/*  <head>sectionに、player Javascriptを追加   */
add_action( 'wp_head', 'HoverSound_title_filter' );

function HoverSound_title_filter( $title ) {
	global $hoverSound_plugin_URL;

	echo "<script type=\"text/javascript\">\n".
		"var hoverSound_plugin_URL = '" . $hoverSound_plugin_URL . "';\n".
		"</script>\n";
	echo  "<script type=\"text/javascript\" src=\"" . $hoverSound_plugin_URL . "/HoverSound.js\"></script>\n";	
} 



?>
