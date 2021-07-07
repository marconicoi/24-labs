$(function(){
	$('[data-bind]').each(function(){
		let t=$(this);
		let s=$(this).data('bind');
		let o=$(s);
		if(o.length==0) $(this).data('24-warning','"${s}" element not found.');
		else if(o.length>1) $(this).data('24-warning','More than one element found with "${s}"');
		else if(!o.is(':input')) $(this).data('24-warning','"${s}" is not a field');
		else o.keypress(function(){
			if(t.is(':input')) t.val(o.val());
			else t.html(o.val());
		});
	});
});