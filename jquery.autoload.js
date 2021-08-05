$(function(){
	$('[data-dd-autoload]').each(function(){
		const self=$(this);
		const template=self.html();
		const loop=self.is('[data-dd-autoloop]')?self.data('dd-autoloop'):false;
		$.getJSON(self.data('dd-autoload'),function(json){
			let html='';
			if(loop){
				eval('json.'+loop).forEach(function(obj){
					html+=template.replaceAll(/\{\{\s*[\w\.]+\s*\}\}/g,(s)=>eval('obj.'+s.replaceAll(/[\{\}\s]/g,'')));
				});
			}
			else{
				html=template.replaceAll(/\{\{\s*[\w\.]+\s*\}\}/g,(s)=>eval('json.'+s.replaceAll(/[\{\}\s]/g,'')));
			}
			self.html(html);
		});
		self.removeAttr('data-dd-autoload').removeAttr('data-dd-autoloop').html();
	});
});
