document.addEventListener('DOMContentLoaded',function(){
	document.querySelectorAll('body *[lang=no]:not(script):not(noscript):not(style)').forEach(function(el){
		if(el.hasChildNodes()){
			el.childNodes.forEach(function(ch){
				if(ch.nodeType==document.TEXT_NODE){
					ch.nodeValue=ch.nodeValue.replace(/(\w+)-(\w+)/g,'$1\u2011$2');
				}
			});
		}
	});
	document.querySelectorAll('[data-dd-split]').forEach(function(el){
		const s=this.getAttribute('data-dd-split');
		if(s.match(/\.\[\d+\]/)){
			this.innerHTML=this.innerHTML.split(s.substr(0,1))[parseInt(s.substr(2).replace(']',''))];
		}
	});
	document.querySelectorAll('[data-dd-crop]').forEach(function(el){
		let o=parseInt(this.getAttribute('data-dd-crop'));
		if(o>0) this.innerHTML=this.innerHTML.substr(0,o);
		else this.innerHTML=this.innerHTML.substr(o);
	});
});
