(function (global) {
    var map,
        MapViewModel,
        app = global.app = global.app || {};

    MapViewModel = kendo.data.ObservableObject.extend({
        _loadingRemaining: 0,
        _markers: [],
        position: null,

        isGoogleMapsInitialized: false,

        loadCurrentLocation: function () {
            var that = this;

            that.updateLoading(1);

            navigator.geolocation.getCurrentPosition(
                function (position) {
                    var currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    map.panTo(currentPosition);
                    that.putMarker(currentPosition, "user-marker-16");
                    app.mapService.viewModel.set("position", 
                        { latitude: position.coords.latitude, longitude: position.coords.longitude });

                    that.updateLoading(-1);
                },
                function (error) {
                    navigator.notification.alert(error);
                    //default map coordinates set at FMI
                    var defaultPosition = new google.maps.LatLng(42.673658, 23.3301228);
                    map.panTo(defaultPosition);

                    that.updateLoading(-1);

                    navigator.notification.alert("Unable to determine current location. Cannot connect to GPS satellite.",
                        function () { }, "Location failed", 'OK');
                },
                {
                    timeout: 30000,
                    enableHighAccuracy: false
                }
            );
        },

        loadMarkers: function () {
            var that = this;

            that.updateLoading(1);

            $.ajax({
              url: app.serverEndpoint + "/performances"
            }).done(function(data) {
                var markers = jQuery.parseJSON( data );
                
                $.each(markers, function(index ,element) {
                    position = new google.maps.LatLng(element.Latitude, element.Longitude);
                    that.putMarker(position, "performer-marker-16", element.id, function(marker) {
                        that.set("performance_id", marker.performance_id);
                        kendo.mobile.application.navigate("views/view_performance.html");
                    });
                });
                that.updateLoading(-1);
            })
            .fail(function() {
                navigator.notification.alert("Unable to get the list of performances",
                        function () { }, "Updating performances failed", 'OK');
 
                that.updateLoading(-1);
            })
        },

        updateLoading: function (change) {
            this._loadingRemaining += change;
            if (this._loadingRemaining > 0) {
                kendo.mobile.application.showLoading();
            } else {
                kendo.mobile.application.hideLoading();
            }
        },

        putMarker: function (position, icon, performance_id, onClick) {
            var that = this;

            var marker = new google.maps.Marker({
                performance_id: performance_id,
                map: map,
                position: position,
                icon: "styles/images/" + icon + ".png",
            });

            if(onClick) {
                google.maps.event.addListener(marker, 'click', function() {
                    onClick(marker);
                });
            }

            that._markers.push(marker);
        }
    });

    app.mapService = {
        initLocation: function () {
            var mapOptions;

            if (typeof google === "undefined") {
                return;
            }

            app.mapService.viewModel.set("isGoogleMapsInitialized", true);

            mapOptions = {
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.TERRAIN ,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                },

                mapTypeControl: false,
                streetViewControl: false
            };

            map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
            app.mapService.viewModel.loadCurrentLocation.apply(app.mapService.viewModel, []);
            app.mapService.viewModel.loadMarkers.apply(app.mapService.viewModel, []);
        },

        show: function () {
            if (!app.mapService.viewModel.get("isGoogleMapsInitialized")) {
                return;
            }

            google.maps.event.trigger(map, "resize");
        },

        hide: function () {
            kendo.mobile.application.hideLoading();
        },

        viewModel: new MapViewModel()
    };
}
)(window);