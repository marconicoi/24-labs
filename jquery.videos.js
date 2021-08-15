$(function(){
	$('.wistia_embed').each(function(){
		window._wq=window._wq||[];
		const vid=$.grep(this.className.split(' '),(v,i)=>v.indexOf('wistia_async_')===0).join().replace('wistia_async_','');
		_wq.push({id:vid,onReady:function(video){
			video.bind('timechange',function(t){
				$('[data-dd-wistiaid="'+vid+'"]').filter('[data-dd-activate]').each(function(){
					const cls=$(this).is('[data-dd-activeclass]')?$(this).data('dd-activeclass'):'dd-active';
					let ta=$(this).data('dd-activate');
					if(typeof ta==='string'&&ta.includes(':')){
						let k=1/60;
						ta=ta.split(':').reverse().reduce((a,c)=>a*1+c*(k*=60),0);
					}
					let td=$(this).is('[data-dd-deactivate]')?$(this).data('dd-deactivate'):null;
					if(typeof td==='string'&&td.includes(':')){
						let k=1/60;
						td=td.split(':').reverse().reduce((a,c)=>a*1+c*(k*=60),0);
					}
					if(parseFloat(ta)<=t&&(td===null||parseFloat(td)>t)) $(this).addClass(cls);
					else $(this).removeClass(cls);
				});
			});
		}});
	});
});
