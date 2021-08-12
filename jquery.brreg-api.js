const public_suffix_list_url='https://raw.githubusercontent.com/publicsuffix/list/master/public_suffix_list.dat';
const url_base_api='https://data.brreg.no/enhetsregisteret/api/enheter?';
const to_ignore=['google','gmail','hotmail','outlook','live','yahoo','aol','uol','bol','inbox','icloud','googlemail','free'];

$(function(){
	let __brreg_response_list=[];
	let __brreg_active_requests=0;
	$(document).on('change','input[data-dd-company-request]',function(){
		const v=$(this).val();
		const r=$(this).data('dd-company-request');
		const s=$(this).is('[data-dd-company-limit]')?$(this).data('dd-company-limit'):20;
		let c=$(this).closest('form');
		if(c.length==0) c=$('body');
		$.get(public_suffix_list_url,function(list){
			const url=v.includes('@')?v.split('@').pop():v;
			const sfx=list.split('\n').filter((e)=>e.trim()!=''&&!e.startsWith('//')).reverse().find((e)=>url.endsWith('.'+e));
			const root=sfx===undefined?url:url.substr(0,url.indexOf(sfx)-1).split('.').pop();
			const ignore=$(this).is('[data-dd-company-ignore]')?new String($(this).data('dd-company-ignore')).split(','):[];
			if(sfx===undefined||to_ignore.indexOf(root)!=-1||ignore.indexOf(root)!=-1){
				c.find('[data-dd-company-response]').each(function(){
					if($(this).is(':input')) $(this).val('');
					else $(this).html('');
				});
				return false;
			}
			let done=false;
			r.split(',').forEach(function(i){
				if(!done){
					c.find('[data-dd-company-autocomplete],[data-dd-company-response]').filter(':input:enabled').addClass('brreg-loading').prop('disabled',true);
					const q=i==='hjemmeside'?root+'.'+sfx:root;
					__brreg_active_requests++;
					$.getJSON(url_base_api+i+'='+q+'&size='+s,function(j){
						__brreg_active_requests--;
						if(!done){
							__brreg_response_list=[];
							if(j!==undefined&&j._embedded!==undefined&&Array.isArray(j._embedded.enheter)){
								if(j._embedded.enheter.length==1){
									c.find('[data-dd-company-autocomplete],[data-dd-company-response]').each(function(){
										const a=$(this).is('[data-dd-company-response]')?$(this).data('dd-company-response'):$(this).data('dd-company-autocomplete');
										const s=eval('j._embedded.enheter[0].'+a);
										if(s!==undefined){
											if($(this).is(':input')) $(this).val(s);
											else $(this).html(s);
										}
									});
								}
								else{
									c.find('[data-dd-company-autocomplete],[data-dd-company-response]').each(function(){
										__brreg_response_list=j._embedded.enheter;
										if($(this).is(':input')) $(this).val('');
										else $(this).html('');
									});
								}
								done=true;
							}
						}
						if(__brreg_active_requests==0){
							c.find('.brreg-loading').removeClass('brreg-loading').prop('disabled',false);
						}
					});
				}
			});
		});
	});
	$(document).on('focus','input[data-dd-company-autocomplete]',function(){
		const template=$(this).is('[data-dd-company-template]')?$(this).data('dd-company-template'):'{{navn}}';
		let c=$(this).closest('form');
		if(c.length==0) c=$('body');
		$('.company-dropdown-list').remove();
		if(__brreg_response_list.length>0){
			let m=$('<ul class="company-dropdown-list"></ul>');
			__brreg_response_list.forEach(function(o){
				const t=template.replaceAll(/\{\{\s*\w+\s*\}\}/g,(s)=>eval('o.'+s.replaceAll(/[\{\}\s]/g,'')));
				m.append('<li class="company-dropdown-item">'+t+'</li>');
			});
			m.css({
				'position': 'absolute',
				'margin-top': $(this).get(0).scrollHeight+'px'
			});
			$(this).before(m);
			m.find('li').click(function(){
				const obj=__brreg_response_list[$(this).index()];
				c.find('[data-dd-company-autocomplete],[data-dd-company-response]').each(function(){
					const a=$(this).is('[data-dd-company-response]')?$(this).data('dd-company-response'):$(this).data('dd-company-autocomplete');
					let s=eval('obj.'+a);
					if(s===undefined) s='';
					if($(this).is(':input')) $(this).val(s);
					else $(this).html(s);
				});
			});
		}
	});
	$(document).on('keypress','input[data-dd-company-autocomplete]',function(e){
		if(e.keyCode==13&&$(this).prev().is('ul.company-dropdown-list')){
			e.preventDefault();
			return false;
		}
	});
	$(document).on('keyup','input[data-dd-company-autocomplete]',function(e){
		let s=$('ul.company-dropdown-list>li.selected').index();
		if(e.keyCode==38){
			$('ul.company-dropdown-list>li').removeClass('selected');
			if(s>0) $('ul.company-dropdown-list>li').eq(s-1).addClass('selected');
		}
		else if(e.keyCode==40){
			$('ul.company-dropdown-list>li').removeClass('selected');
			if(s===undefined||s==__brreg_response_list.length-1) $('ul.company-dropdown-list>li:eq(0)').addClass('selected');
			else $('ul.company-dropdown-list>li').eq(s+1).addClass('selected');
		}
		else if(e.keyCode==13){
			$('ul.company-dropdown-list>li.selected').click();
			$(this).blur();
		}
		else{
			const self=$(this);
			const k=$(this).data('dd-company-autocomplete');
			const v=new String($(this).val());
			const s=$(this).is('[data-dd-company-limit]')?$(this).data('dd-company-limit'):10;
			if(v.length>2){
				$.getJSON(url_base_api+k+'='+v+'&size='+s,function(j){
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
	$(document).on('blur','input[data-dd-company-autocomplete]',function(){
		setTimeout(()=>$('ul.company-dropdown-list').remove(),100);
	});
});
