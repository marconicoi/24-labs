const public_suffix_list_url='https://raw.githubusercontent.com/publicsuffix/list/master/public_suffix_list.dat';
const url_base_api='https://data.brreg.no/enhetsregisteret/api/enheter?';
const to_ignore=['google','gmail','hotmail','outlook','live','yahoo','aol','uol','bol','inbox','icloud','googlemail','free'];

$(function(){
	let __brreg_response_list=[];
	let __brreg_active_requests=0;
	$(document).on('change','input[data-tfso-brreg-api-request]',function(){
		const v=$(this).val();
		const r=$(this).data('tfso-brreg-api-request');
		let c=$(this).closest('form');
		if(c.length==0) c=$('body');
		$.get(public_suffix_list_url,function(list){
			const url=v.includes('@')?v.split('@').pop():v;
			const sfx=list.split('\n').filter((e)=>e.trim()!=''&&!e.startsWith('//')).reverse().find((e)=>url.endsWith('.'+e));
			const root=sfx===undefined?url:url.substr(0,url.indexOf(sfx)-1).split('.').pop();
			const ignore=$(this).is('[data-tfso-brreg-api-ignore]')?new String($(this).data('tfso-brreg-api-ignore')).split(','):[];
			if(sfx===undefined||to_ignore.indexOf(root)!=-1||ignore.indexOf(root)!=-1){
				c.find('[data-tfso-brreg-api-response]').each(function(){
					if($(this).is(':input')) $(this).val('');
					else $(this).html('');
				});
				return false;
			}
			let done=false;
			r.split(',').forEach(function(i){
				if(!done){
					c.find('[data-tfso-brreg-api-autocomplete],[data-tfso-brreg-api-response]').filter(':input:enabled').addClass('brreg-loading').prop('disabled',true);
					const q=i==='hjemmeside'?root+'.'+sfx:root;
					__brreg_active_requests++;
					$.getJSON(url_base_api+i+'='+q,function(j){
						__brreg_active_requests--;
						if(!done&&j!==undefined&&j._embedded!==undefined&&Array.isArray(j._embedded.enheter)){
							if(j._embedded.enheter.length==1){
								c.find('[data-tfso-brreg-api-autocomplete],[data-tfso-brreg-api-response]').each(function(){
									const a=$(this).is('[data-tfso-brreg-api-response]')?$(this).data('tfso-brreg-api-response'):$(this).data('tfso-brreg-api-autocomplete');
									const s=eval('j._embedded.enheter[0].'+a);
									if(s!==undefined){
										if($(this).is(':input')) $(this).val(s);
										else $(this).html(s);
									}
								});
							}
							else{
								c.find('[data-tfso-brreg-api-autocomplete],[data-tfso-brreg-api-response]').each(function(){
									__brreg_response_list=j._embedded.enheter;
									if($(this).is(':input')) $(this).val('');
									else $(this).html('');
								});
							}
							done=true;
						}
						if(__brreg_active_requests==0){
							c.find('.brreg-loading').removeClass('brreg-loading').prop('disabled',false);
						}
					});
				}
			});
		});
	});
	$(document).on('focus','input[data-tfso-brreg-api-autocomplete]',function(){
		const template=$(this).is('[data-tfso-brreg-api-template]')?$(this).data('tfso-brreg-api-template'):'{{navn}}';
		let c=$(this).closest('form');
		if(c.length==0) c=$('body');
		$('.brreg-dropdown-list').remove();
		if(__brreg_response_list.length>0){
			let m=$('<ul class="brreg-dropdown-list"></ul>');
			__brreg_response_list.forEach(function(o,i){
				const t=template.replaceAll(/\{\{\s*\w+\s*\}\}/g,(s)=>eval('o.'+s.replaceAll(/[\{\}\s]/g,'')));
				m.append('<li id="__brreg_item_'+i+'">'+t+'</li>');
			});
			m.css({
				'position': 'absolute',
				'margin-top': $(this).get(0).scrollHeight+'px'
			});
			$(this).before(m);
			m.find('li').click(function(){
				const obj=__brreg_response_list[parseInt($(this).attr('id').replace('__brreg_item_',''))];
				c.find('[data-tfso-brreg-api-autocomplete],[data-tfso-brreg-api-response]').each(function(){
					const a=$(this).is('[data-tfso-brreg-api-response]')?$(this).data('tfso-brreg-api-response'):$(this).data('tfso-brreg-api-autocomplete');
					const s=eval('obj.'+a);
					if(s!==undefined){
						if($(this).is(':input')) $(this).val(s);
						else $(this).html(s);
					}
				});
			});
		}
	});
	$(document).on('keyup','input[data-tfso-brreg-api-autocomplete]',function(e){
		let s=$('ul.brreg-dropdown-list>li.selected').index();
		if(e.keyCode==38){
			$('ul.brreg-dropdown-list>li').removeClass('selected');
			if(s>0) $('ul.brreg-dropdown-list>li').eq(s-1).addClass('selected');
		}
		else if(e.keyCode==40){
			$('ul.brreg-dropdown-list>li').removeClass('selected');
			if(s===undefined||s==__brreg_response_list.length-1) $('ul.brreg-dropdown-list>li:eq(0)').addClass('selected');
			else $('ul.brreg-dropdown-list>li').eq(s+1).addClass('selected');
		}
		else if(e.keyCode==13){
			$('ul.brreg-dropdown-list>li.selected').click();
			$(this).blur();
		}
		else{
			const self=$(this);
			const k=$(this).data('tfso-brreg-api-autocomplete');
			const v=new String($(this).val());
			if(v.length>2){
				$.getJSON(url_base_api+k+'='+v,function(j){
					if(j!==undefined&&j._embedded!==undefined&&Array.isArray(j._embedded.enheter)){
						__brreg_response_list=j._embedded.enheter;
						self.trigger('focus');
					}
				});
			}
			else if(v.length>0){
				__brreg_response_list=[];
				$(this).trigger('focus');
			}
		}
	});
	$(document).on('blur','input[data-tfso-brreg-api-autocomplete]',function(){
		setTimeout(()=>$('ul.brreg-dropdown-list').remove(),100);
	});
});
