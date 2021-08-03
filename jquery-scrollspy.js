$(function(){
	$('[data-dd-scrollspy]').each(function(){
		const toc=$(this);
		const curclass=$(this).is('[data-dd-spyclass]')?$(this).data('dd-spyclass'):'w--current';
		let node=$(toc.data('dd-scrollspy'));
		while(node&&node.get(0).scrollHeight==node.get(0).clientHeight){
			node=node.parent();
		}
		if(node.is('html')) node=$(window);
		node=$(window);
		node.scroll(function(){
			const spos=node.scrollTop();
			let done=false;
			let curr=[];
			toc.find('a').removeClass(curclass).each(function(){
				if(!done){
					let level=0;
					let el=$(this);
					while(!el.is(toc)){
						el=el.parent();
						level++;
					}
					if($($(this).attr('href')).offset().top>spos){
						done=true;
					}
					else{
						curr.length=level-1;
						curr[level]=$(this);
					}
				}
			});
			if(curr.length==0) curr[0]=toc.find('a:first');
			curr.forEach(function(el){
				if(el) el.addClass(curclass);
			});
		}).scroll();
	});
});
