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
	$('[data-dd-parentattr]').each(function(){
		let parent=$(this).closest('[role=listitem]');
		parent=parent.length==1?parent:$(this).parent();
		parent.attr($(this).data('dd-parentattr'),$(this).html());
		$(this).remove();
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
	$('[data-dd-timestamp]').change(function(){
		__dt__update($(this));
	}).change();
	function __dt__update(el){
		const tm=el.data('dd-timestamp');
		const ct=new Date();
		const dt=new Date(isNaN(tm)?tm.replace('T',' ').replace('Z',' GMT'):tm*1000);
		if(isNaN(dt.getTime())) return false;
		const cy=ct.getFullYear();
		const dy=dt.getFullYear();
		const cd=cy*10000+ct.getMonth()*100+ct.getDate();
		const dd=dy*10000+dt.getMonth()*100+dt.getDate();
		const lang=el.attr('lang');
		let str='';
		let ti=new Date().setHours(23,59,59,999)-ct;
		if(lang=='no'){
			const MONTH=['jan','feb','mar','apr','mai','jun','jul','aug','sep','okt','nov','des'];
			if(cd==dd) str='i dag';
			else if(cd==dd+1) str='i går';
			else if(cy==dy) str=dt.getDate()+'. '+MONTH[dt.getMonth()];
			else str=dt.getDate()+'.'+MONTH[dt.getMonth()]+' '+dy;
		}
		else if(lang=='se'){
			const MONTH=['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec'];
			if(cd==dd) str='i dag';
			else if(cd==dd+1) str='i går';
			else if(cy==dy) str=dt.getDate()+' '+MONTH[dt.getMonth()];
			else str=dt.getDate()+' '+MONTH[dt.getMonth()]+' '+dy;
		}
		else {
			const MONTH=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			if(cd==dd) str='TODAY';
			else if(cd==dd+1) str='Yesterday';
			else if(cy==dy) str=MONTH[dt.getMonth()]+' '+dt.getDate();
			else str=MONTH[dt.getMonth()]+' '+dt.getDate()+', '+dy;
		}
		el.text(str);
		if(ti>0) setTimeout(function(){
			__dt__update(el);
		},ti);
	}
	$('[data-dd-autoload]:not(:input,form)').each(function(){
		const self=$(this);
		const template=self.html();
		const loop=self.is('[data-dd-autoloop]')?self.data('dd-autoloop'):false;
		$.getJSON(self.data('dd-autoload'),function(json){
			__auto__target__populate(json,self,template,loop);
		});
		self.removeAttr('data-dd-autoload').removeAttr('data-dd-autoloop').html('');
	});
	$(':input[data-dd-autoload]').each(function(){
		const self=$(this);
		const url_base=self.data('dd-autoload');
		const target=$(self.attr('target'));
		const template=target.html();
		const loop=target.is('[data-dd-autoloop]')?target.data('dd-autoloop'):false;
		$(this).change(function(){
			$.getJSON(url_base.replaceAll(/\{\{[^\}]+\}\}/g,(s)=>eval(s.replaceAll(/[\{\}\s]/g,''))),function(json){
				__auto__target__populate(json,target,template,loop);
			});
		});
		target.removeAttr('data-dd-autoloop').html('');
		self.removeAttr('data-dd-autoload').change();
	});
	$('form[data-dd-autoload]').each(function(){
		const self=$(this);
		const url_base=self.data('dd-autoload');
		const template=self.html();
		const loop=false;
		$(this).submit(function(){
			$.getJSON(url_base.replaceAll(/\{\{[^\}]+\}\}/g,(s)=>eval(s.replaceAll(/[\{\}\s]/g,''))),self.serialize(),function(json){
				__auto__target__populate(json,self,template,loop);
			});
			return false;
		});
		target.removeAttr('data-dd-autoloop').html('');
		self.removeAttr('data-dd-autoload').change();
	});
	function __auto__target__populate(json,target,template,loop){
		let html='';
		let stm=loop?'json.'+loop:false;
		let offset=0;
		let limit=1000;
		if(loop&&loop.includes(':')){
			let prts=loop.split(':');
			stm='json.'+prts[0];
			if(prts.length==2) limit=prts[1];
			else{
				offset=prts[1];
				limit=prts[2];
			}
		}
		if(stm){
			eval(stm).forEach(function(obj){
				if(offset>0) offset--;
				else if(limit-->0){
					html+=template.replaceAll(/\{\{\s*[\w\.]+\s*\}\}/g,(s)=>eval('obj.'+s.replaceAll(/[\{\}\s]/g,'')));
				}
			});
		}
		else{
			html=template.replaceAll(/\{\{\s*[\w\.]+\s*\}\}/g,(s)=>eval('json.'+s.replaceAll(/[\{\}\s]/g,'')));
		}
		target.html(html);
		target.find('[data-dd-autocontent]').each(function(){
			$(this).html($(this).data('dd-autocontent')).removeAttr('data-dd-autocontent');
		});
		target.find(':input').change();
		target.find('[data-dd-timestamp]').change(function(){
			__dt__update($(this));
		}).change();
	}
});
