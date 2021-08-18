$(function(){
	$(document).on('click','[data-dd-unstorage]',function(){
		localStorage.removeItem($(this).data('dd-unstorage'));
	});
	$(document).on('change',':input[data-dd-storage]',function(){
		localStorage.setItem($(this).data('dd-storage'),$(this).val());
		__update_localstorage_elements();
	});
	$(document).on('click','a[data-dd-storage]',function(){
		let href=$(this).attr('href');
		if(href.startsWith('/')) href=new URL(href,document.baseURI).href;
		const value=$(this).is('[data-dd-storagevalue]')?$(this).data('dd-storagevalue'):href;
		localStorage.setItem($(this).data('dd-storage'),value);
		__update_localstorage_elements();
	});
	$(':input[data-dd-storage]').each(function(){
		if(!$(this).is('[value]')){
			$(this).val(localStorage.getItem($(this).data('dd-storage')));
		}
	}).change();
	$('[data-dd-bindif]').each(function(){
		if(eval($(this).data('dd-bindif').replaceAll(/([a-zA-Z_][\w\._]*)/g,'localStorage.$1').replaceAll("'localStorage.","'"))){
			if($(this).is('[data-dd-bindhref]')) $(this).attr('href',$(this).data('dd-bindhref').replaceAll(/\{\{\s*[\w\.]+\s*\}\}/g,(s)=>eval('localStorage.'+s.replaceAll(/[\{\}\s]/g,''))));
			if($(this).is('[data-dd-bindcontent]')) $(this).html($(this).data('dd-bindcontent'));
		}
	});
	function __update_localstorage_elements(){
		$('[data-dd-hideif]').each(function(){
			if(eval($(this).data('dd-hideif').replaceAll(/([a-zA-Z_][\w\._]*)/g,'localStorage.$1').replaceAll("'localStorage.","'"))) $(this).hide();
			else $(this).show();
		});
		$('[data-dd-showif]').each(function(){
			if(eval($(this).data('dd-showif').replaceAll(/([a-zA-Z_][\w\._]*)/g,'localStorage.$1').replaceAll("'localStorage.","'"))) $(this).show();
			else $(this).hide();
		});
		$('[data-dd-clickif]').each(function(){
			if(eval($(this).data('dd-clickif').replaceAll(/([a-zA-Z_][\w\._]*)/g,'localStorage.$1').replaceAll("'localStorage.","'"))) $(this).get(0).click();
		});
		$('[data-dd-removeif]').each(function(){
			if(eval($(this).data('dd-removeif').replaceAll(/([a-zA-Z_][\w\._]*)/g,'localStorage.$1').replaceAll("'localStorage.","'"))) $(this).remove();
		});
	}
	__update_localstorage_elements();
});
