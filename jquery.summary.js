$(function(){
	$('[data-dd-toc-context]').each(function(){
		const tts=($(this).is('[data-dd-toc-targets]')?$(this).data('dd-toc-targets').toLowerCase():'h1,h2,h3,h4,h5,h6').split(/[,-\s]+/);
		const tpl=$(this).children().length==0?$('<div><ul data-dd-toc-level="h1"><li><a></a><ul data-dd-toc-level="h2"><li><a></a><ul data-dd-toc-level="h3"><li><a></a><ul data-dd-toc-level="h4"><li><a></a><ul data-dd-toc-level="h5"><li><a></a><ul data-dd-toc-level="h6"><li><a></a></li></ul></li></ul></li></ul></li></ul></li></ul></li></ul></div>'):$(this).clone();
		let cur=tpl;
		let lvl=-1;
		tpl.find('a').removeAttr('href');
		let list=$($(this).data('dd-toc-context')).find(tts.join(',')).filter('[id]').get();
		if($(this).is('[data-dd-toc-order]')){
			const ator=$(this).data('dd-toc-order');
			let order=new Array(tts.length).fill(0);
			$(list).each(function(){
				const level=tts.findIndex((e)=>$(this).is(e));
				for(let i=level+1;i<order.length;i++) order[i]=0;
				if($(this).is('['+ator+']')) order[level]=$(this).attr(ator);
				else order[level]++;
				$(this).attr(ator,order.join('.'));
			});
			list.sort(function(a,b){
				if($(a).attr(ator)>$(b).attr(ator)) return 1;
				if($(a).attr(ator)<$(b).attr(ator)) return -1;
				return 0;
			});
		}
		$(list).each(function(){
			const target=$(this);
			const level=tts.findIndex((e)=>target.is(e));
			let nel=tpl.find('[data-dd-toc-level="'+tts[level]+'"]>*:first').clone();
			nel.find('a:first').attr('href','#'+target.attr('id')).html(target.html());
			nel.find('[data-dd-class-match]').addBack('[data-dd-class-match]').each(function(){
				let self=$(this);
				self.data('dd-class-match').split(/[,\s]/).forEach(function(c){
					c=c.trim();
					if(c!=''&&target.is('.'+c)) self.addClass(c);
				});
			});
			if(lvl<level){
				lvl=level;
				cur=cur.find('[data-dd-toc-level="'+tts[level]+'"]:last');
			}
			else if(lvl>level){
				lvl=level;
				cur=cur.closest('[data-dd-toc-level="'+tts[level]+'"]');
			}
			cur.append(nel);
		});
		tpl.find('a').not('[href]').remove();
		tpl.find('*').each(function(){
			if(!$(this).is('a')&&$(this).find('a').length==0&&$(this).closest('a').length==0) $(this).remove();
		});
		tpl.find('*').removeAttr('data-dd-toc-level').removeAttr('data-dd-class-match');
		$(this).html(tpl.html());
	});
});
