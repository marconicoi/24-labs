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
		let parent=$(this).data('dd-parentattr')=='href'?$(this).closest('a'):$(this).closest('[role=listitem]');
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
	let els=$();
	$('[data-dd-show]').each(function(){
		let ctl=$($(this).data('dd-show'));
		if(ctl.is(':checked,.dd-selected')) $(this).show();
		else $(this).hide();
		els=els.add(ctl);
	});
	$('[data-dd-hide]').each(function(){
		let ctl=$($(this).data('dd-show'));
		if(ctl.is(':checked,.dd-selected')) $(this).hide();
		else $(this).show();
		els=els.add(ctl);
	});
	$(els).click(function(){
		$('.dd-selected').removeClass('dd-selected');
		$(this).addClass('dd-selected');
		$('[data-dd-show]').filter((i,el)=>$($(el).data('dd-show')).is($(this))).show();
		$('[data-dd-hide]').filter((i,el)=>$($(el).data('dd-hide')).is($(this))).hide();
	});
	$('[data-dd-visibleif]').change(function(){

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
	$(document).on('submit','form[data-dd-errobj]',function(){
		const form=$(this);
		const failMsg=form.data('dd-failmsg');
		const errMsg=form.data('dd-errmsg');
		const okMsg=form.data('dd-okmsg');
		const errObj=form.data('dd-errobj');
		const data=form.serialize();
		$(failMsg).hide();
		$(errMsg).hide();
		$(okMsg).hide();
		form.removeClass('form-fail form-error form-success')
		form.find(':input:enabled').addClass('__disabled').attr('disabled',true);
		form.find('[type=submit],button:not([type])').prepend('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="12" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve" class="__loading"><path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"><animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 50 50" to="360 50 50" repeatCount="indefinite"></animateTransform></path></svg>');
		$.ajax({
			type: form.attr('method'),
			url: form.attr('action'),
			cache: false,
			data: data,
			complete: function(){
				form.find('.__disabled').removeClass('__disabled').removeAttr('disabled');
				form.find('svg.__loading').remove();
			},
			error: function(xhr){
				if(xhr.responseJSON[errObj]){
					$(errMsg).html(xhr.responseJSON[errObj]).show();
					form.addClass('form-error');
				}
				else{
					$(failMsg).show();
					form.addClass('form-fail');
				}
			},
			success: function(json){
				if(json[errObj]){
					$(errMsg).html(json[errObj]).show();
					form.addClass('form-error');
				}
				else{
					$(okMsg).show();
					form.addClass('form-success');
					form.find(':input[name]').each(function(){
						const name=$(this).attr('name');
						if(json[name]) $(this).val(json[name]).change();
					});
					if(form.is('[target]')){
						const target=$(form.attr('target'));
						if(target.length>0){
							let template='';
							if(target.is('[data-dd-targettemplate]')) template=atob(target.data('dd-targettemplate'));
							else{
								template=target.html();
								target.attr('data-dd-targettemplate',btoa(template));
							}
							target.html(template.replaceAll(/\{\{\s*[\w\.]+\s*\}\}/g,(s)=>eval('json.'+s.replaceAll(/[\{\}\s]/g,''))));
							target.find(':input').change();
							$('[data-dd-timestamp]').change(function(){
								__dt__update($(this));
							}).change();
						}
					}
				}
			}
		});
		return false;
	});
	function query(p){
		let r=null;
		window.location.search.substr(1).split('&').forEach(function(q){
			const i=q.split('=');
			if(i[0]==p&&i.length>1) r=i[1];
		});
		return r;
	}
	$('[data-dd-autoload]:not(:input,form)').each(function(){
		const self=$(this);
		const url_base=self.data('dd-autoload');
		const template=self.html();
		const loop=self.is('[data-dd-autoloop]')?self.data('dd-autoloop'):false;
		$.getJSON(url_base.replaceAll(/\{\{[^\}]+\}\}/g,(s)=>eval(s.replaceAll(/[\{\}\s]/g,''))),function(json){
			__auto__target__populate(json,self,template,loop);
		}).fail(function(){
			self.html(template);
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
					html+=template.replaceAll(/\{\{\s*[\w\.\[\]]+\s*\}\}/g,function(s){
						try{
							const v=eval('obj.'+s.replaceAll(/[\{\}\s]/g,''));
							if(v!==undefined) return v;
						}
						finally{}
						return '';
					});
				}
			});
		}
		else{
			html=template.replaceAll(/\{\{\s*[\w\.\[\]]+\s*\}\}/g,function(s){
				try{
					const v=eval('json.'+s.replaceAll(/[\{\}\s]/g,''));
					if(v!==undefined) return v;
				}
				finally{}
				return '';
			});
		}
		target.html(html);
		target.find('[data-dd-autocontent]').each(function(){
			$(this).html($(this).data('dd-autocontent')).removeAttr('data-dd-autocontent');
		});
		target.find(':input').change();
		$('[data-dd-timestamp]').change(function(){
			__dt__update($(this));
		}).change();
		target.find('.w-dyn-bind-empty:not(:empty)').removeClass('w-dyn-bind-empty');
	}
});
