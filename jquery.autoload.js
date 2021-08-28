$(function(){
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
        	let stm=loop===''?'json':(loop?'json.'+loop:false);
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
			const v=$(this).data('dd-autocontent');
			const p=v.match(/^@(\w+[\w-_]+):(.*)$/);
			if(p) $(this).attr(p[1],p[2]);
			else $(this).html(v).removeAttr('data-dd-autocontent');
		});
		target.find(':input').change();
		$('[data-dd-timestamp]').change(function(){
			__dt__update($(this));
		}).change();
		target.find('.w-dyn-bind-empty:not(:empty)').removeClass('w-dyn-bind-empty');
	}
});
