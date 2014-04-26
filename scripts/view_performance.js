(function (global) {
    var PerformanceViewModel,
        app = global.app = global.app || {};

    PerformanceViewModel = kendo.data.ObservableObject.extend({
        init: function () {
            var that = this,
                dataSource;

            kendo.data.ObservableObject.fn.init.apply(that, []);

            $.getJSON(app.serverEndpoint + "/performances/1").success(function(data) {
                that.set('performance', data);
            }).fail(function() {
                navigator.notification.alert("Cannot read performance information!");
            });

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
    });
    app.performanceViewService = {
        show: function(e) {
            console.log('showing')
        },
        viewModel: new PerformanceViewModel()
    };
})(window);
