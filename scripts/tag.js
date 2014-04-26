(function (global) {
    var TagViewModel,
        app = global.app = global.app || {};

    TagViewModel = kendo.data.ObservableObject.extend({
        show: function() {

        },
        data: {categories: []},
        isArtistSelected: false,
        isMusicianSelected: false,
        isActorSelected: false,

        markSingle: function(e) {
            var $button = $(e.target);
            this.data.type = $button[0].id;
            $(".radioButton").removeClass("marked");
            $($button).addClass("marked");
            this.updateSelection($button[0].id);
        },

        updateSelection: function(id) {
            app.tagService.viewModel.set("isArtistSelected", id == "artist" ? true : false);
            app.tagService.viewModel.set("isMusicianSelected", id == "musician" ? true : false);
            app.tagService.viewModel.set("isActorSelected", id == "actor" ? true : false);
        },
        mark: function(e) {
            var $button = $(e.target)
            if($button.hasClass("marked")) {
                $button.removeClass("marked");
                var newCategories = [];
                for(var cat in this.data.categories) {
                    if(this.data.categories.hasOwnProperty(cat)) {
                        if(cat !== e.id) {
                            newCategories.push(cat);
                        }
                    }
                }
                this.data.categories = newCategories;
            } else {
                $($button).addClass("marked");
                this.data.categories.push($button[0].id);
            }
        },
        setBandSize: function(e) {
            this.data.isBand = $(e.target)[0].id == "0" ? false : true;
        },
        next: function() {
            var position = app.mapService.viewModel.get("position");
            this.data.location_longitude = position.longitude;
            this.data.location_latitude = position.latitude
            kendo.mobile.application.showLoading();
            $.ajax({
                type: "POST",
                url: app.serverEndpoint + "performances",
                data: this.data
            }).done(function(data) {
                kendo.mobile.application.navigate("views/actions.html?=" + data.id);
                kendo.mobile.application.hideLoading();
            })
            .fail(function() {
                kendo.mobile.application.hideLoading();
                navigator.notification.alert("Post failed!",
                        function () { }, "Location failed", 'OK');
            })
        }
    });

    app.tagService = {
        viewModel: new TagViewModel()
    };
})(window);
