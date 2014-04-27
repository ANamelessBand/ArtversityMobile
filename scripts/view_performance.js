(function (global) {
    var PerformanceViewModel,
        app = global.app = global.app || {};

    PerformanceViewModel = kendo.data.ObservableObject.extend({
        isLoading: true,

        init: function () {
            var that = this,
                dataSource;

            kendo.data.ObservableObject.fn.init.apply(that, []);
        },

        loadPerformance: function(id) {
            var that = this;
            that.set('performanceVideoDataSource', []);

            $.getJSON(app.serverEndpoint + "performances/" + id).success(function(data) {
                data.picture = app.serverEndpoint + data.picture;
                that.set('performance', data);

                for (var i = 0; i < data.pictures.length; i++) {
                  data.pictures[i].thumb = app.serverEndpoint + data.pictures[i].thumb;
                }

                if (data.videos.length > 0) {
                  for (var i = 0; i < data.videos.length; i++) {
                    data.videos[i].filename = app.serverEndpoint + data.videos[i].filename;
                  }
                  that.set('performanceVideoDataSource', data.videos);
                } else {
                  that.set('noVideo', true);
                }

                that.set('performanceMediaDataSource', data.pictures)

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
