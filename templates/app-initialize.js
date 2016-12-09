$('[data-comp="<%= appName %>"]').each(function(){
	new <%= jsName %> = new project.Comp.<%= jsName %>({
		$el:$(this)
	});
});