$(function(){
	const url_api=$('meta[name=dictionary-url]').attr('content');
	if(url_api){
		$.getJSON(url_api,function(dictionary){
			let current_lang=localStorage.getItem('w--current-language')||window.navigator.userLanguage||window.navigator.language||'en';
			current_lang=current_lang.substr(0,2);
			let el=$('<b></b>').data('dd-setlang',current_lang);
			$('[data-dd-setlang]').add(el).click(function(){
				let lang=$(this).data('dd-setlang');
				let done=false;
				$('[lang]:not(html)').each(function(){
					const lel=$(this).attr('lang');
					const cel=$(this).text();
					const dic=dictionary.findIndex((e)=>e[lel=='en'?'name':lel]==cel);
					if(dic>=0&&lang in dictionary[dic]){
						$(this).attr('lang',lang);
						$(this).text(dictionary[dic][lang]);
						done=true;
					}
				});
				if(done) localStorage.setItem('w--current-language',lang);
			});
			el.click().remove();
		});
	}
});
