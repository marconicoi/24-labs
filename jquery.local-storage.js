$(function(){
	$(document).on('click','[data-dd-unstore]',function(){
		localStorage.removeItem($(this).data('dd-unstore'));
		return false;
	});
	$(document).on('change','input[data-dd-storage]',function(){
		localStorage.setItem($(this).data('dd-storage'),$(this).val());
		$('[data-dd-hideif]').each(function(){
			if(eval($(this).data('dd-hideif').replaceAll(/([a-zA-Z][\w\._]*)/g,'localStorage.$1'))) $(this).hide();
			else $(this).show();
		});
		$('[data-dd-showif]').each(function(){
			if(eval($(this).data('dd-showif').replaceAll(/([a-zA-Z][\w\._]*)/g,'localStorage.$1'))) $(this).show();
			else $(this).hide();
		});
		$('[data-dd-clickif]').each(function(){
			if(eval($(this).data('dd-clickif').replaceAll(/([a-zA-Z][\w\._]*)/g,'localStorage.$1'))) $(this).click();
		});
		$('[data-dd-removeif]').each(function(){
			if(eval($(this).data('dd-removeif').replaceAll(/([a-zA-Z][\w\._]*)/g,'localStorage.$1'))) $(this).remove();
		});
	});
	$('input[data-dd-storage]').each(function(){
		if($(this).val()==''){
			$(this).val(localStorage.getItem($(this).data('dd-storage')));
		}
	}).change();
});
