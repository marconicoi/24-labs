$(function(){
	$('input[data-24-email-autocomplete]').each(function(){
		let i=$(this);
		let d=new String('@'+i.data('24-email-autocomplete')).replace('@@','@');
		let p=i.clone().removeAttr('id').removeAttr('data-24-email-autocomplete').css({
			'position': 'absolute',
			'border-color': 'transparent',
			'background': 'transparent',
			'width': i.get(0).scrollWidth+'px'
		}).insertBefore(i).keyup(function(){
			i.val(!p.val().includes('@')&&p.val()!=''?p.val()+d:'');
		});
		let c=new String(window.getComputedStyle(i.get(0)).getPropertyValue('color'));
		if(c.includes('rgba')){
			let a=c.replace(/[rgba()\s]/,'').split(',');
			c='rgba('+a[0]+','+a[1]+','+a[2]+','+(parseFloat(a[3])/3)+')';
		}
		else{
			c=c.replace('rgb','rgba').replace(')',',.3)');
		}
		i.css({
			'color': c
		});
		window.addEventListener('resize',function(){
			p.css('width',i.get(0).scrollWidth+'px');
		});
	});
});
