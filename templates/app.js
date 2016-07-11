$dJ.NS('project.Comp').<%= jsName %> = $dJ.Comp.Base.extend(function () {
    "use strict";
    return {
    	$el: null,
    	$triggers: null,

        init: function(cfg) {
            var _this = this,
                DBG = $dJ.Debug;

            // Call superclass to call shared init and config
            this._super(cfg);

            // Validate the el parameter
            DBG('[project.Comp.<%= jsName %>.init] typeof $el:', typeof _this.$el);
            if (typeof _this.$el === 'object' && _this.$el !== null && _this.$el !== 'undefined') { 
                // Perform setup 
                _this._setup(); 
            }
        },

    	_setup: function(){
            var _this = this; 
            //JS Code Starts Here
            console.log( '<%= jsName %>  js is loaded');

		}
    };

}()); 