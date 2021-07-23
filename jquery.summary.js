$(function(){
	$('[data-dd-toc-context]').each(function(){
		const tts=($(this).is('[data-dd-toc-targets]')?$(this).data('dd-toc-targets').toLowerCase():'h1,h2,h3,h4,h5,h6').split(/[,-\s]+/);
		const tpl=$(this).children().length==0?$('<div><ul data-dd-toc-level="h1"><li><a></a><ul data-dd-toc-level="h2"><li><a></a><ul data-dd-toc-level="h3"><li><a></a><ul data-dd-toc-level="h4"><li><a></a><ul data-dd-toc-level="h5"><li><a></a><ul data-dd-toc-level="h6"><li><a></a></li></ul></li></ul></li></ul></li></ul></li></ul></li></ul></div>'):$(this).clone();
		let cur=tpl;
		let lvl=-1;
		$($(this).data('dd-toc-context')).find(tts.join(',')).filter('[id]').each(function(){
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
		tpl.find('[data-dd-toc-level]').each(function(){
			const el=$(this).find('>*');
			if(el.length>1) el.first().remove();
		});
		tpl.find('*').removeAttr('data-dd-toc-level').removeAttr('data-dd-class-match');
		$(this).html(tpl.html());
	});
});
