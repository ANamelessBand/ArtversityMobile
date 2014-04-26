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
                var data = {"bla": "this is coool", "balba": "not so cool"};
                dataSource = new kendo.data.DataSource(data);
                that.set("nearbyDataSource", dataSource);
            //}));

        }
    });

    app.nearbyService = {
        viewModel: new NearbyViewModel()
    };
})(window);