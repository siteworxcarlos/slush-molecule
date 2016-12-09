$('[data-comp="<%= appName %>"]').each(function(){
	var new<%= jsName %> = new project.Comp.<%= jsName %>({
		$el:$(this)
	});
});