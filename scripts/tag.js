(function (global) {
    var TagViewModel,
        app = global.app = global.app || {};

    TagViewModel = kendo.data.ObservableObject.extend({
    	isNewTag: false,

    	show: function(e) {
    		var position = app.mapService.viewModel.get("position");
    		if(position && !e.view.params.forceNewTag) {
    			kendo.mobile.application.showLoading();
	    		$.ajax({
	              url: app.serverEndpoint + "/performances/nearby/" + position.latitude + "/" + position.longitude
	            }).done(function(data) {
	            	//
	            })
	            .fail(function() {
	            	app.tagService.viewModel.set("isNewTag",true);
	            })
	            .complete(function() {
	            	kendo.mobile.application.hideLoading();
	            })
	        } else {
        		app.tagService.viewModel.set("isNewTag",true);
	        }
    	}
    });

    app.tagService = {
        viewModel: new TagViewModel()
    };
})(window);
