(function (global) {
    var TagViewModel,
        app = global.app = global.app || {};

    TagViewModel = kendo.data.ObservableObject.extend({
        data: {categories: []},
        isArtistSelected: false,
        isMusicianSelected: false,
        isActorSelected: false,

        markSingle: function(e) {
            var $button = $(e.target).parent("div");
            if(!$button[0].id) {
                return;
            }

            this.data.type = $button[0].id;
            $(".category").removeClass("marked");
            this.data.categories = [];
            $button.addClass("marked");
            this.updateSelection(this.data.type);
        },

        updateSelection: function(id) {
            app.tagService.viewModel.set("isArtistSelected", id == "artist" ? true : false);
            app.tagService.viewModel.set("isMusicianSelected", id == "musician" ? true : false);
            app.tagService.viewModel.set("isActorSelected", id == "actor" ? true : false);
        },
        mark: function(e) {
            var $button = $(e.target).parent("div");
            var _id = $button[0].id;

            if($button.hasClass("marked")) {
                var newCategories = [];
                for(var i=0; i<this.data.categories.length; i++) {
                    if(this.data.categories[i] == _id) {
                        newCategories.push(this.data.categories[i]);
                    }
                }
                this.data.categories = newCategories;
            } else {
                this.data.categories.push(_id);
            }
            $button.toggleClass("marked");
        },
        setBandSize: function(e) {
            this.data.isBand = $(e.target)[0].id == "0" ? false : true;
        },
        next: function() {
            var position = app.mapService.viewModel.get("position");
            this.data.location_longitude = position.longitude;
            this.data.location_latitude = position.latitude;
            this.data.isBand = true;
            kendo.mobile.application.showLoading();
            $.ajax({
                type: "POST",
                url: app.serverEndpoint + "performances",
                data: this.data
            }).done(function(data) {
                kendo.mobile.application.navigate("views/actions.html?id=" + data.id);
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
