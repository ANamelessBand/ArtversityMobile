(function (global) {
    var PerformanceViewModel,
        app = global.app = global.app || {};

    PerformanceViewModel = kendo.data.ObservableObject.extend({
        init: function () {
            var that = this,
                dataSource;

            kendo.data.ObservableObject.fn.init.apply(that, []);

            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "data/pictures.json",
                        dataType: "json"
                    }
                }
            });

            that.set("performanceMediaDataSource", dataSource);
        },

        loadPerformance: function(id) {
            var that = this;

            $.getJSON(app.serverEndpoint + "/performances/" + id).success(function(data) {
                that.set('performance', data);
            }).fail(function() {
                navigator.notification.alert("Cannot read performance information!");
            });
        },
    });

    app.performanceViewService = {
        show: function(e) {
            app.performanceViewService.viewModel.loadPerformance(1);
        },

        viewModel: new PerformanceViewModel()
    };
})(window);
