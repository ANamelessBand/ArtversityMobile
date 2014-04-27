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
                params.performance_id = app.mediaService.viewModel.get("id");

                var ft = new FileTransfer();
                options.params = params;
                kendo.mobile.application.showLoading();
                ft.upload(imageURI, encodeURI(app.serverEndpoint + "attachments/pictures"), success, fail, options);
            }


            function success(result) {
                kendo.mobile.application.hideLoading();
                app.mediaService.viewModel.skipMedia();
            }   

            // Where innocent kittens die
            function fail(error) {
                kendo.mobile.application.hideLoading();
                navigator.notification.alert("Unable to upload picture.",
                        function () { }, "Upload picture failed", 'OK');
            }

        },

        takeVideo: function() {
            navigator.device.capture.captureVideo(
                captureSuccess, captureFail, {limit: 1, duration: 15});

            function captureSuccess(mediaFiles) {
                for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                    uploadVideo(mediaFiles[i]);
                }
                app.mediaService.viewModel.skipMedia();
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
                params.performance_id = app.mediaService.viewModel.get("id");

                options.params = params;
                var ft = new FileTransfer();
                kendo.mobile.application.showLoading();
                ft.upload(mediaFile.fullPath, encodeURI(app.serverEndpoint + "attachments/videos"), success, fail, options);
            }

            function success(result) {
                kendo.mobile.application.hideLoading();
                app.mediaService.viewModel.skipMedia();
            }   

            function fail(error) {
                kendo.mobile.application.hideLoading();
                navigator.notification.alert("Unable to upload video.",
                        function () { }, "Uploading video failed", 'OK');
            }
        },

        recordAudio: function() {
            navigator.device.capture.captureAudio(captureSuccess, captureFail, {limit: 1, duration: 15});

            function captureSuccess(mediaFiles) {
                for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                    uploadAudio(mediaFiles[i]);
                }

                app.mediaService.viewModel.skipMedia();
            }

            function captureFail(error) {
                navigator.notification.alert("Unable to record audio.",
                        function () { }, "Recording audio failed", 'OK');
            }

            function uploadAudio(mediaFile) {
                var options = new FileUploadOptions();
                options.fileKey="audio";
                options.fileName=mediaFile.name;
                options.mimeType="multipart/form-data";

                var params = {};
                params.performance_id = app.mediaService.viewModel.get("id");

                options.params = params;
                var ft = new FileTransfer();
                kendo.mobile.application.showLoading();
                ft.upload(mediaFile.fullPath, encodeURI(app.serverEndpoint + "attachments/audios"), success, fail, options);
            }

            function success(result) {
                kendo.mobile.application.hideLoading();
                app.mediaService.viewModel.skipMedia();
            }   

            function fail(error) {
                kendo.mobile.application.hideLoading();
                navigator.notification.alert("Unable to upload audio.",
                        function () { }, "Uploading audio failed", 'OK');
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
            if(e.view.params.id) {
                app.mediaService.viewModel.setID(e.view.params.id);
            }
        }

    };
})(window);
