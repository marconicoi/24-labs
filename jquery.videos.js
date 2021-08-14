$(function(){
	$('.wistia_embed').each(function(){
		window._wq=window._wq||[];
		const vid=$.grep(this.className.split(' '),(v,i)=>v.indexOf('wistia_async_')===0).join().replace('wistia_async_','');
		_wq.push({id:vid,onReady:function(video){
			video.bind('timechange',function(t){
				$('[data-dd-wistiaid="'+vid+'"]').filter('[data-dd-activate]').each(function(){
					const cls=$(this).is('[data-dd-activeclass]')?$(this).data('dd-activeclass'):'w--active';
					const ta=parseFloat($(this).data('dd-activate'));
					const td=$(this).is('[data-dd-deactivate]')?parseFloat($(this).data('dd-deactivate')):null;
					if(ta<=t&&(td===null||td>t)) $(this).addClass(cls);
					else $(this).removeClass(cls);
				});
			});
		}});
	});
});
