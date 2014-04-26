(function (global) {
    var NearbyViewModel,
        app = global.app = global.app || {};

    NearbyViewModel = kendo.data.ObservableObject.extend({
        nearbyDataSource: [],

        init: function () {
            var that = this;
            kendo.data.ObservableObject.fn.init.apply(that, []);
        },

        show: function(e) {
            var position = app.mapService.viewModel.get("position");
            console.dir(position);
            if(position) {
                kendo.mobile.application.showLoading();
                $.ajax({
                  url: app.serverEndpoint + "/performances/nearby/" + position.latitude + "/" + position.longitude
                }).done(function(data) {
                    var performances = jQuery.parseJSON( data );
                    if(performances.length !== 0) {
                        var dataSource = new kendo.data.DataSource({
                            data: performances,
                        });

                        app.nearbyService.viewModel.set("nearbyDataSource", dataSource);
                    }
                    else {
                        kendo.mobile.application.navigate("views/tag.html")    
                    }
                })
                .fail(function() {
                    kendo.mobile.application.navigate("views/tag.html")
                })
                .complete(function() {
                    kendo.mobile.application.hideLoading();
                })
            } else {
                kendo.mobile.application.navigate("views/tag.html")
            }
        }
    });

    app.nearbyService = {
        viewModel: new NearbyViewModel()
    };
})(window);