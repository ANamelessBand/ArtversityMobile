(function (global) {
    var PerformanceViewModel,
        app = global.app = global.app || {};

    PerformanceViewModel = kendo.data.ObservableObject.extend({
        init: function () {
            var that = this,
                dataSource,
                performance;

            kendo.data.ObservableObject.fn.init.apply(that, []);

            $.getJSON("data/performance.json").success(function(data) {
                performance = data;
                that.set("picture", performance.picture);
                that.set("type", performance.type);
            }).fail(function() {
                console.log('fail');
            })

            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "data/pictures.json",
                        dataType: "json"
                    }
                }
            });


            that.set("performanceMediaDataSource", dataSource);
        }
    });

    app.performanceViewService = {
        viewModel: new PerformanceViewModel()
    };
})(window);
