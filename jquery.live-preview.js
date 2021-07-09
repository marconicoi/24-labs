$(function(){
	$(document).on('keyup',':input',function() {
		let input=$(this);
		$('[data-24-bind*="#'+$(this).attr('id')+'"]').each(function(){
			let self=$(this);
			let formula=$(this).data('24-bind');
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
		$('[data-24-calc*="#'+$(this).attr('id')+'"]').each(function(){
			let self=$(this);
			let formula=$(this).data('24-calc');
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
	}).filter('[value!=""]').keyup();
	$(document).on('click',':checkbox',function(){
		if($(this).is(':checked')){
			$('[data-24-show="#'+$(this).attr('id')+'"]').show();
			$('[data-24-hide="#'+$(this).attr('id')+'"]').hide();
		}
		else{
			$('[data-24-show="#'+$(this).attr('id')+'"]').hide();
			$('[data-24-hide="#'+$(this).attr('id')+'"]').show();
		}
	}).click();
});
