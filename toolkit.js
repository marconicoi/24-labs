document.addEventListener('DOMContentLoaded',function(){
	document.querySelectorAll('body *:not(script):not(noscript):not(style)').forEach(function(el){
		if(el.hasChildNodes()){
			el.childNodes.forEach(function(ch){
				if(ch.nodeType==document.TEXT_NODE){
					ch.nodeValue=ch.nodeValue.replace(/(\w+)-(\w+)/g,'$1\u2011$2');
				}
			});
		}
	});
	document.querySelectorAll('input:required').forEach(function(el){
		document.querySelectorAll('label[for="'+el.id+'"]').forEach(function(el){
			el.classList.add('required');
		});
	});
});
