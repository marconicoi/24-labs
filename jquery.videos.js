$(function(){
	$('.wistia_embed').each(function(){
		window._wq=window._wq||[];
		const vid=$.grep(this.className.split(' '),(v,i)=>v.indexOf('wistia_async_')===0).join().replace('wistia_async_','');
		let chapters=[];
		$('[data-dd-wistiaid="'+vid+'"]').filter('[data-dd-currentat]').each(function(){
			const t=parseFloat($(this).data('dd-currentat'));
			const i=chapters.findIndex((ch)=>ch.start==t);
			if(i==-1) chapters.push({
					start: t,
					elements: $(this)
				});
			else chapters[i].elements=chapters[i].elements.add($(this));
		});
		chapters.sort((a,b)=>b.start-a.start);
		_wq.push({id:vid,onReady:function(video){
			video.bind('timechange',function(t){
				let se=true;
				chapters.forEach(function(ch){
					if(se&&ch.start<=t){
						ch.elements.addClass('w--current');
						se=false;
					}
					else{
						ch.elements.removeClass('w--current');
					}
				});
			});
		}});
	});
});
