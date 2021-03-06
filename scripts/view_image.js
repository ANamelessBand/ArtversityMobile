(function (global) {
    var ImageViewModel,
        app = global.app = global.app || {};

    ImageViewModel = kendo.data.ObservableObject.extend({
      init: function() {
        var that = this;
        kendo.data.ObservableObject.fn.init.apply(that, [that]);
      },

      setURL: function(url) {
        var that = this;
        that.set("url", app.serverEndpoint + url);
      }
    });

    app.imageViewService = {
      show: function(e) {
        app.imageViewService.viewModel.setURL(e.view.params.url);
        $(".km-tabstrip").hide();
        $(".km-header").hide();

        $('img.fullscreen-picture').click(function() {
          kendo.mobile.application.navigate("#:back");
        });
      },

      hide: function() {
        $(".km-tabstrip").show();
        $(".km-header").show();
      },

      viewModel: new ImageViewModel()
    };
})(window);
