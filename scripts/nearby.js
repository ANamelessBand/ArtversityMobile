(function (global) {
    var NearbyViewModel,
        app = global.app = global.app || {};

    NearbyViewModel = kendo.data.ObservableObject.extend({
        nearbyDataSource: null,

        init: function () {
            var that = this,
                dataSource;

            kendo.data.ObservableObject.fn.init.apply(that, []);
            //$.get("some-url-here", function(data) {
                dataSource = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: "data/nearby.json",
                            dataType: "json"
                        }
                    }
                });

                that.set("nearbyDataSource", dataSource);
            //}));
        }

    });

    app.nearbyService = {
        viewModel: new NearbyViewModel()
    };
})(window);