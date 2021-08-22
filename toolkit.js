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
			if(this instanceof HTMLInputElement) this.value=this.value.split(s.substr(0,1))[parseInt(s.substr(2).replace(']',''))];
			else this.innerHTML=this.innerHTML.split(s.substr(0,1))[parseInt(s.substr(2).replace(']',''))];
		}
	});
	document.querySelectorAll('[data-dd-crop]').forEach(function(el){
		let o=parseInt(this.getAttribute('data-dd-crop'));
		if(this instanceof HTMLInputElement){
			if(o>0) this.value=this.value.substr(0,o);
			else this.value=this.value.substr(o);
		}
		else{
			if(o>0) this.innerHTML=this.innerHTML.substr(0,o);
			else this.innerHTML=this.innerHTML.substr(o);
		}
	});
	document.querySelectorAll('[data-dd-regex]').forEach(function(el){
		const r=new RegExp(this.getAttribute('data-dd-regex'));
		if(this instanceof HTMLInputElement) this.value=this.value.replace(r,'$1');
		else this.innerHTML=this.innerHTML.replace(r,'$1');
	});
});
