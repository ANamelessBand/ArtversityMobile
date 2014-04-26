(function (global) {
    var app = global.app = global.app || {};
    app.serverEndpoint = "http://10.255.5.12:9292/";
    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
        app.application = new kendo.mobile.Application(document.body, {
          skin:   "flat",
          layout: "tabstrip-layout"
        });
    }, false);
})(window);
