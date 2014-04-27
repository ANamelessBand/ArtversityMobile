(function (global) {
    var PerformanceViewModel,
        app = global.app = global.app || {};

    PerformanceViewModel = kendo.data.ObservableObject.extend({
        isLoading: true,

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

            $.getJSON(app.serverEndpoint + "performances/" + id).success(function(data) {
                that.set('performance', data);
                that.hideLoading();
            }).fail(function() {
                that.hideLoading();
                navigator.notification.alert("Cannot read performance information!");
            });
        },

        hideLoading: function() {
            kendo.mobile.application.hideLoading();
            app.performanceViewService.viewModel.set("isLoading", false);
        }
    });

    app.performanceViewService = {
        afterShow: function() {
            kendo.mobile.application.showLoading();
            app.performanceViewService.viewModel.set("isLoading", true);
        },
        show: function(e) {
            app.performanceViewService.viewModel.loadPerformance(e.view.params.id);
        },

        hide: function () {
            kendo.mobile.application.hideLoading();
        },

        viewModel: new PerformanceViewModel()
    };
})(window);
