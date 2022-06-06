function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}
function rand(min,max,interval) {
  if(interval)
    return min + Math.round(Math.random() * (max - min))
  else
    return min + Math.round(Math.random() * interval) * (max - min) / interval
}

var isEventSupported = (function(){
 var TAGNAMES = {
   'select':'input','change':'input',
   'submit':'form','reset':'form',
   'error':'img','load':'img','abort':'img'
 }
 function isEventSupported(eventName) {
   var el = document.createElement(TAGNAMES[eventName] || 'div');
   eventName = 'on' + eventName;
   var isSupported = (eventName in el);
   if (!isSupported) {
     el.setAttribute(eventName, 'return;');
     isSupported = typeof el[eventName] == 'function';
   }
   el = null;
   return isSupported;
 }
 return isEventSupported;
})();



	$(document).ready(function(){
		$('#scores').load('scores.php').fadeIn('slow');
		});
		
		var refreshId2 = setInterval(loadScores, 6E4);

		function loadScores()
		{
			$('#scores').stop(true, true).fadeOut('slow').load('scores.php').fadeIn('slow');
		}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 30);
          };
})();


 var chatovodOnLoad = chatovodOnLoad || [];
    chatovodOnLoad.push(function() {
        chatovod.addChatButton({host: "eatmegame.chatovod.com", align: "bottomRight",
            width: 400, height: 380, defaultLanguage: "en"});
    });
    (function() {
        var po = document.createElement('script');
        po.type = 'text/javascript'; po.charset = "UTF-8"; po.async = true;
        po.src = (document.location.protocol=='https:'?'https:':'http:') + '//st1.chatovod.com/api/js/v1.js?2';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(po, s);
    })();
	
	
