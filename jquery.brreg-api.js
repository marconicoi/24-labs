const public_suffix_list_url='https://raw.githubusercontent.com/publicsuffix/list/master/public_suffix_list.dat';
const url_base_api='https://data.brreg.no/enhetsregisteret/api/enheter?';
const to_ignore=['google','gmail','hotmail','outlook','live','yahoo','aol','uol','bol','inbox','icloud','googlemail','free'];

$(function(){
	$(document).on('change','input[data-tfso-brreg-api-request]',function() {
		const v=$(this).val();
		const r=$(this).data('tfso-brreg-api-request');
		let c=$(this).closest('form');
		if(c.length==0) c=$('body');
		$.get(public_suffix_list_url,function(list){
			const url=v.includes('@')?v.split('@').pop():v;
			const sfx=list.split('\n').filter((e)=>e.trim()!=''&&!e.startsWith('//')).reverse().find((e)=>url.endsWith('.'+e));
			const root=sfx===undefined?url:url.substr(0,url.indexOf(sfx)-1).split('.').pop();
			if(sfx===undefined||to_ignore.indexOf(root)!=-1){
				c.find('[data-tfso-brreg-api-response]').each(function(){
					if($(this).is(':input')) $(this).val('');
					else $(this).html('');
				});
				return false;
			}
			let done=false;
			r.split(',').forEach(function(i){
				if(!done){
					const q=i==='hjemmeside'?root+'.'+sfx:root;
					$.getJSON(url_base_api+i+'='+q,function(j){
						if(!done&&j!==undefined&&j._embedded!==undefined&&Array.isArray(j._embedded.enheter)){
							c.find('[data-tfso-brreg-api-response]').each(function(){
								const s=eval('j._embedded.enheter[0].'+$(this).data('tfso-brreg-api-response'));
								if(s!==undefined){
									if($(this).is(':input')) $(this).val(s);
									else $(this).html(s);
								}
							});
							done=true;
						}
					});
				}
			});
		});
	});
});
