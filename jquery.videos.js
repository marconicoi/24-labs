$(function(){
	$('.wistia_embed').each(function(){
		window._wq=window._wq||[];
		const vid=$.grep(this.className.split(' '),(v,i)=>v.indexOf('wistia_async_')===0).join().replace('wistia_async_','');
		let chapters=[];
		$(this).find('chapter').each(function(){
			chapters.push({
				start: parseFloat($(this).attr('start')),
				class: $(this).attr('class')
			});
		});
		chapters.reverse();
		_wq.push({id:vid,onReady:function(video){
			video.bind('timechange',function(t){
				chapters.forEach(function(ch){
					$('.'+ch.class+'[data-dd-chapterclass='+vid+']').removeClass(ch.class);
				});
				const cls=chapters.find((ch)=>ch.start<=t).class;
				$('[data-dd-chapterclass='+vid+']').addClass(cls);
			});
		}});
	});
});
