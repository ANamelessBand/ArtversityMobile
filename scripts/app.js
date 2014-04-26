(function (global) {
    var app = global.app = global.app || {};

    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
        app.application = new kendo.mobile.Application(document.body, {
          skin:   "flat",
          layout: "tabstrip-layout"
        });
    }, false);
})(window);
