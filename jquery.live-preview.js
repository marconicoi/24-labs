$(function(){
	$(document).on('change keyup',':input',function() {
		let input=$(this);
		$('[data-dd-bind*="#'+$(this).attr('id')+'"]').each(function(){
			let self=$(this);
			let formula=$(this).data('dd-bind');
			let terms=formula.split(/[,;:\.\s()]/);
			terms.forEach(function(e){
				let v=$(e).val();
				if(v===undefined) v=e;
				formula=formula.replace(e,v);
			});
			formula=formula.replaceAll('()','').replace(/^[,;:\.\s]+/,'').replace(/[,;:\.\s]+$/,'');
			if(self.is(':input')) self.val(formula);
			else self.html(formula);
			if(self.is('a')){
				if(input.is('[type=tel]')) self.attr('href','tel://'+formula);
				else if(input.is('[type=email]')) self.attr('href','mailto://'+formula);
			}
		});
		$('[data-dd-calc*="#'+$(this).attr('id')+'"]').each(function(){
			let self=$(this);
			let formula=$(this).data('dd-calc');
			let terms=formula.replaceAll(' ','').split(/[*+-/]/);
			terms.forEach(function(e){
				let v=$(e).val();
				if(v===undefined) v=e;
				formula=formula.replace(e,v);
			});
			formula=eval(formula).toLocaleString();
			if(self.is(':input')) self.val(formula);
			else self.html(formula);
		});
	}).filter('[value!=""]').change();
	$(document).on('click','[data-dd-onlyoneclass]',function(){
		let cls=$(this).data('dd-onlyoneclass');
		$('.'+cls).removeClass(cls);
		$(this).addClass(cls);
	});
	$(document).on('click',':checkbox',function(){
		if($(this).is(':checked')){
			$('[data-dd-show="#'+$(this).attr('id')+'"]').show();
			$('[data-dd-hide="#'+$(this).attr('id')+'"]').hide();
		}
		else{
			$('[data-dd-show="#'+$(this).attr('id')+'"]').hide();
			$('[data-dd-hide="#'+$(this).attr('id')+'"]').show();
		}
	});
	$('[data-dd-show]').each(function(){
		if($($(this).data('dd-show')).is(':checked')) $(this).show();
		else $(this).hide();
	});
	$('[data-dd-hide]').each(function(){
		if($($(this).data('dd-hide')).is(':checked')) $(this).hide();
		else $(this).show();
	});
});
