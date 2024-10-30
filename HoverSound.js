
var HoverSoundObject = Array();
var HoverSound_jquery_prepared = false;
var HoverSound_initsm2_id = -1;
var HoverSound_initsm2_cnt = 0;
var HoverSound_initsm2_load = false;
var HoverSound_soundManager_ready = false;

jQuery(document).ready(function(){
	HoverSound_jquery_prepared = true;
	for (var i=1; i<2048 ; i++) {
		var params = jQuery("#hoversound_"+i).val();
		if (typeof params == 'undefined') break;
		var args = params.split("|");
		HoverSoundObject [i-1] = new HoverSound(args[0], args[1], args[2]);
	}
	HoverSound_initsm2_id = setInterval("HoverSound_initsm2()",100);
});

window.onload = function(){
	if (HoverSound_initsm2_cnt<19) HoverSound_initsm2_cnt=19;
};

function HoverSound_initsm2()
{
	if ( typeof soundManager !== 'object' ) {
		if (++HoverSound_initsm2_cnt < 20) {
			return;
		}
		if (!HoverSound_initsm2_load) {
			jQuery.getScript( hoverSound_plugin_URL + '/soundmanager2-jsmin.js');
			HoverSound_initsm2_load = true;
			return;
		}
	}

	if ( typeof soundManager === 'object' ) {
		if (HoverSound_initsm2_load) {
			soundManager.debugMode = false;
			soundManager.url = hoverSound_plugin_URL + '/swf/';
			soundManager.nullURL = 'about:blank';
			soundManager.useFastPolling = false;
			soundManager.waitForWindowLoad = false;
		}
		soundManager.useHighPerformance = true;
		soundManager.onready(function(){
			HoverSound_soundManager_ready = true;
		});
		clearInterval(HoverSound_initsm2_id);
	}
}


var HoverSound = function(id, sURL, flgAutoload) {
	this.sURL = sURL;
	this.mySound;
	this.created=false;
	this.that = this;
	this.id = id;
	this.ready = false;
	this.flgAutoload = (flgAutoload=="true"?true:false);
	
	var that = this;
	var callMethod_init = function() {that.init();};
	this.init_id = setInterval(callMethod_init, 100);
};


// function name: init
// description : initialization
// argument : void
HoverSound.prototype.init = function() 
{
	if (!HoverSound_jquery_prepared) return;
	clearInterval(this.init_id);
	var that = this;

	jQuery('#'+this.id).hover(
		function(event){if (that.created) {that.mySound.play();}},
		function(event){if (that.created) {that.mySound.stop();}}
	);

	// sound initialization
	var  callMethod_init = function() {that.initSound();};
	this.initSound_interval_id = setInterval(callMethod_init, 200);
};

// function name: initSound
// description : initialize Soundmanager2 object
// argument : void
HoverSound.prototype.initSound = function() 
{
	if (!this.created) {
		if (HoverSound_soundManager_ready) {
			if (soundManager.canPlayURL(this.sURL)) {
				this.mySound = soundManager.createSound({
					id:this.id,
					url:this.sURL,
					autoLoad:this.flgAutoload,
					stream: true,
					autoPlay: false,
					volume:this.volume
				});
			}
			this.created=true;
			clearInterval(this.initSound_interval_id);
		}
	}
};



