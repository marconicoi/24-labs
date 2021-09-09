document.addEventListener('DOMContentLoaded',function(){
	document.querySelectorAll('[data-dd-split]').forEach(function(el){
		const s=el.getAttribute('data-dd-split');
		if(s.match(/.\[\d+\]/)){
			if(el instanceof HTMLInputElement) el.value=el.value.split(s.substr(0,1))[parseInt(s.substr(2).replace(']',''))];
			else el.innerHTML=el.innerHTML.split(s.substr(0,1))[parseInt(s.substr(2).replace(']',''))];
		}
	});
	document.querySelectorAll('[data-dd-crop]').forEach(function(el){
		let o=parseInt(el.getAttribute('data-dd-crop'));
		if(el instanceof HTMLInputElement){
			if(o>0) el.value=el.value.substr(0,o);
			else el.value=el.value.substr(o);
		}
		else{
			if(o>0) el.innerHTML=el.innerHTML.substr(0,o);
			else el.innerHTML=el.innerHTML.substr(o);
		}
	});
	document.querySelectorAll('[data-dd-regex]').forEach(function(el){
		const r=new RegExp(el.getAttribute('data-dd-regex'));
		if(el instanceof HTMLInputElement) el.value=el.value.replace(r,'$1');
		else el.innerHTML=el.innerHTML.replace(r,'$1');
	});
	document.querySelectorAll('body *:not(script):not(noscript):not(style)').forEach(function(el){
		if(el.hasChildNodes()){
			el.childNodes.forEach(function(ch){
				if(ch.nodeType==document.TEXT_NODE){
					ch.nodeValue=ch.nodeValue.replace(/(\w+)-(\w+)/g,'$1\u2011$2');
				}
			});
		}
	});
	document.querySelectorAll('.w-dyn-empty').forEach(function(el){
		el.parentNode.removeChild(el);
	});
});
