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
					const lel=$(this).attr('lang')=='no'?'name':$(this).attr('lang');
					const lpa=lang=='no'?'name':lang;
					const cel=$(this).html();
					const dic=dictionary.findIndex((e)=>e[lel]==cel);
					if($(this).is('[data-dd-timestamp]')){
						$(this).attr('lang',lang);
						$(this).change();
					}
					else if(dic>=0&&lpa in dictionary[dic]&&dictionary[dic][lpa]!=null&&dictionary[dic][lpa].trim()!==''){
						$(this).attr('lang',lang);
						if($(this).is('input')) $(this).val(dictionary[dic][lpa]);
						else $(this).text(dictionary[dic][lpa]);
						done=true;
					}
				});
				if(done) localStorage.setItem('w--current-language',lang);
			});
			el.click().remove();
		});
	}
});
