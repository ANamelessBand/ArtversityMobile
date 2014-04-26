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
            console.log("Take picture");

            // navigator.camera.getPicture(onSuccess, onFail,
            // { destinationType : Camera.DestinationType.DATA_URL,
            //   sourceType : Camera.PictureSourceType.CAMERA,
            //   saveToPhotoAlbum: true });

            // function onSuccess (imageData) {
            //     alert(imageData);
            // }

            // function onFail (message) {
            //     alert("Taking picture failed " + message)
            // }

            document.addEventListener("deviceready", onDeviceReady, false);

            function onDeviceReady() {
            // Retrieve image file location from specified source
            navigator.camera.getPicture(
                uploadPhoto,
                function(message) { alert('get picture failed ' + message); },
                {
                    destinationType : navigator.camera.DestinationType.FILE_URI,
                    sourceType      : navigator.camera.PictureSourceType.CAMERA,
                    saveToPhotoAlbum : true
                }
                );
            }

            function uploadPhoto(imageURI) {
                var options = new FileUploadOptions();
                options.fileKey="file";
                options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
                options.mimeType="image/jpeg";

                var params = {};
                // params.id = that.get("id");

                options.params = params;

                var ft = new FileTransfer();
                ft.upload(imageURI, encodeURI("https://api.imgur.com/3/image"), win, fail, options);
            }

            // Awesome Epic Win!
            function win(r) {
                // console.log("Params= " + r.params)
                console.log("Code = " + r.responseCode);
                console.log("Response = " + r.response);
                console.log("Sent = " + r.bytesSent);
            }

            // Where innocent kittens die
            function fail(error) {
                alert("An error has occurred: Code = " + error.code);
                console.log("upload error source " + error.source);
                console.log("upload error target " + error.target);
            }

        },

        takeVideo: function() {
            navigator.device.capture.captureVideo(captureSuccess, captureFail, {limit: 2, duration: 15});

            function captureSuccess(mediaFiles) {
                for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                    path = mediaFiles[i].fullPath;
                    console.log("Path to video file: " + path);
                }
                kendo.mobile.application.navigate("views/view_performance.html");
            }

            function captureFail(error) {
                console.log("Taking video failed " + error);
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
