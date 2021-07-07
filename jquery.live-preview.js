$(function(){
	$(document).on('keyup',':input',function() {
		var self = $(this);
		$('[data-bind=' + $(this).attr('id') + ']').not('a').html($(this).val()).each(function() {
			var html = '';
			var sep = false;
			var container = $(this).closest('[data-separator]');
			container.find('[data-bind]').each(function() {
				if ($(this).html() != '' && $(this).is(':visible')) {
					if (sep) html += '<span>' + container.attr('data-separator') + '</span>';
					sep = true;
				}
				html += $(this).get(0).outerHTML;
			});
			container.html(html);
		});
		$('[data-bind=' + $(this).attr('id') + ']').filter('a').each(function() {
			$(this).attr('href', self.attr('type') == 'email' ? 'mailto:' + self.val() : self.attr('type') == 'tel' ? 'tel:' + self.val() : '');
		});
	}).filter('[value!=""]').keyup();
});