$(function(){
	$(document).on('change','input[data-dd-storage]',function(){
		localStorage.setItem($(this).data('dd-storage'),$(this).val());
		$('[data-dd-hide-if]').each(function(){
			if(eval($(this).data('dd-hide-if').replaceAll(/([a-zA-Z][\w\._]*)/g,'localStorage.$1'))) $(this).hide();
			else $(this).show();
		});
		$('[data-dd-show-if]').each(function(){
			if(eval($(this).data('dd-show-if').replaceAll(/([a-zA-Z][\w\._]*)/g,'localStorage.$1'))) $(this).show();
			else $(this).hide();
		});
		$('[data-dd-click-if]').each(function(){
			if(eval($(this).data('dd-click-if').replaceAll(/([a-zA-Z][\w\._]*)/g,'localStorage.$1'))) $(this).click();
		});
		$('[data-dd-remove-if]').each(function(){
			if(eval($(this).data('dd-remove-if').replaceAll(/([a-zA-Z][\w\._]*)/g,'localStorage.$1'))) $(this).remove();
		});
	});
	$('input[data-dd-storage]').each(function(){
		if($(this).val()==''){
			$(this).val(localStorage.getItem($(this).data('dd-storage')));
		}
	}).change();
});
