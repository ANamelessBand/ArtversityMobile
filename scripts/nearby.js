(function (global) {
    var NearbyViewModel,
        app = global.app = global.app || {};

    NearbyViewModel = kendo.data.ObservableObject.extend({
        nearbyDataSource: [],
        isLoading: true,

        init: function () {
            var that = this;
            kendo.data.ObservableObject.fn.init.apply(that, []);
        },

        show: function(e) {
            var that = this;
            var position = app.mapService.viewModel.get("position");
            if(position) {
                $.ajax({
                  url: app.serverEndpoint + "performances/nearby/" + position.latitude + "/" + position.longitude
                }).done(function(data) {
                    var performances = data;
                    if(performances.length !== 0) {
                        var dataSource = new kendo.data.DataSource({
                            data: performances,
                        });

                        app.nearbyService.viewModel.set("nearbyDataSource", dataSource);
                        app.nearbyService.viewModel.set("isLoading", false);
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


        },

        onClick: function(e) {
            var $div = $(e.target);
            if (!$div.hasClass("nearby-templ")) {
                $div = $div.parents(".nearby-templ");
            }
            var id = $div.data('performance-id');
            if(!id) {
                return;
            }

            var putData = { "id": id};
            $.ajax({
                type: "PUT",
                url: app.serverEndpoint + "performances",
                data: putData
            })
        }
    });

    app.nearbyService = {
        afterShow: function() {
            kendo.mobile.application.showLoading();
            app.nearbyService.viewModel.set("isLoading", true);
        },
        hide: function () {
            kendo.mobile.application.hideLoading();
        },
        viewModel: new NearbyViewModel()
    };
})(window);
