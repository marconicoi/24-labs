$(function(){
	const url_api=$('meta[name=dictionary-url]').attr('content');
	if(url_api){
		$.getJSON(url_api,function(dictionary){
			let current_lang=localStorage.getItem('dd__current_language')||window.navigator.userLanguage||window.navigator.language||'no';
			current_lang=current_lang.substr(0,2);
			let el=$('<b></b>').data('dd-setlang',current_lang);
			$('[data-dd-setlang]').add(el).click(function(){
				let lang=$(this).data('dd-setlang');
				let done=false;
				$('[lang]:not(html)').each(function(){
					const lel=$(this).attr('lang')=='no'?'name':$(this).attr('lang');
					const lpa=lang=='no'?'name':lang;
					const cel=$(this).is('input')?$(this).val():$(this).html();
					const dic=dictionary.findIndex((e)=>e[lel]==cel);
					if($(this).is('[data-dd-timestamp]')){
						$(this).attr('lang',lang);
						$(this).change();
					}
					else if(dic>=0&&lpa in dictionary[dic]&&dictionary[dic][lpa]!=null&&dictionary[dic][lpa].trim()!==''){
						let txt=dictionary[dic][lpa];
						if(lang=='no') txt=txt.replace(/(\w+)-(\w+)/g,'$1\u2011$2');
						$(this).attr('lang',lang);
						if($(this).is('input')) $(this).val(txt);
						else $(this).text(txt);
						done=true;
					}
				});
				if(done) localStorage.setItem('dd__current_language',lang);
			});
			el.click().remove();
			$('[data-dd-setlang='+current_lang+']').click();
		});
	}
});
