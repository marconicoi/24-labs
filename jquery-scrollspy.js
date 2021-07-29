$(function(){
	$('[data-dd-scrollspy]').each(function(){
		const toc=$(this);
		let node=$(toc.data('dd-scrollspy'));
		while(node&&node.get(0).scrollHeight==node.get(0).clientHeight){
			node=node.parent();
		}
		if(node.is('html')) node=$(window);
		node.scroll(function(){
			const spos=node.scrollTop();
			let done=false;
			let curr=toc.find('a:first');
			toc.find('a').removeClass('w--current').each(function(){
				if(!done){
					if($($(this).attr('href')).position().top>spos){
						done=true;
					}
					else{
						curr=$(this);
					}
				}
			});
			if(curr) curr.addClass('w--current');
		}).scroll();
	});
});
