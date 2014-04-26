(function (global) {
    var MediaViewModel,
        app = global.app = global.app || {};

    MediaViewModel = kendo.data.ObservableObject.extend({
        skipMedia: function() {
            kendo.mobile.application.navigate("#tabstrip-home");
            var tabstrip = $("#footer-tabstrip").data("kendoMobileTabStrip");
            tabstrip.switchTo("#tabstrip-home");
        },

        takePicture: function() {
            document.addEventListener("deviceready", onDeviceReady, false);

            function onDeviceReady() {

            navigator.camera.getPicture(
                uploadPhoto,
                function(message) {
                    navigator.notification.alert(message,
                        function () { }, "Camera failed", 'OK');
                },
                {
                    destinationType : navigator.camera.DestinationType.FILE_URI,
                    sourceType      : navigator.camera.PictureSourceType.CAMERA,
                    saveToPhotoAlbum : true
                }
                );
            }

            function uploadPhoto(imageURI) {
                var options = new FileUploadOptions();
                options.fileKey="image";
                options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
                options.mimeType="multipart/form-data";

                var params = {};
                params.id = app.mediaService.viewModel.get("id");

                var ft = new FileTransfer();
                options.params = params;
                kendo.mobile.application.showLoading();
                ft.upload(imageURI, encodeURI("http://10.0.200.167:9292/media"), success, fail, options);
            }


            function success(result) {
                kendo.mobile.application.hideLoading();
                kendo.mobile.application.navigate("views/view_performance.html");
            }   

            // Where innocent kittens die
            function fail(error) {
                kendo.mobile.application.hideLoading();
                navigator.notification.alert("Unable to upload picture.",
                        function () { }, "Upload picture failed", 'OK');
            }

        },

        takeVideo: function() {
            navigator.device.capture.captureVideo(captureSuccess, captureFail, {limit: 2, duration: 15});

            function captureSuccess(mediaFiles) {
                for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                    uploadVideo(mediaFiles[i])
                }
                kendo.mobile.application.navigate("views/view_performance.html");
            }

            function captureFail(error) {
                navigator.notification.alert("Unable to take video.",
                        function () { }, "Taking video failed", 'OK');
            }

            function uploadVideo(mediaFile) {
                var options = new FileUploadOptions();
                options.fileKey="video";
                options.fileName=mediaFile.name;
                options.mimeType="multipart/form-data";

                var params = {};
                params.id = app.mediaService.viewModel.get("id");

                options.params = params;
                var ft = new FileTransfer();
                kendo.mobile.application.showLoading();
                ft.upload(mediaFile.fullPath, encodeURI("http://10.0.200.167:9292/media"), success, fail, options);
            }

            function success(result) {
                kendo.mobile.application.hideLoading();
                kendo.mobile.application.navigate("views/view_performance.html");
            }   

            function fail(error) {
                kendo.mobile.application.hideLoading();
                navigator.notification.alert("Unable to upload video.",
                        function () { }, "Uploading video failed", 'OK');
            }
        },

        recordAudio: function() {
            navigator.device.capture.captureAudio(captureSuccess, captureFail, {limit: 2, duration: 15});

            function captureSuccess(mediaFiles) {
                for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                    path = mediaFiles[i].fullPath;
                }

                kendo.mobile.application.navigate("views/view_performance.html");
            }

            function captureFail(error) {
                navigator.notification.alert("Unable to record audio.",
                        function () { }, "Recording audio failed", 'OK');
            }
        },

        setID: function(id) {
            var that = this;
            that.set("id", id);
        }
    });

    app.mediaService = {
        viewModel: new MediaViewModel(),

        show: function (e) {
            app.mediaService.viewModel.setID(e.view.params.id);
        },
    };
})(window);
