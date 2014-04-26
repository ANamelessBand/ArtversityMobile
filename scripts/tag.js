(function (global) {
    var TagViewModel,
        app = global.app = global.app || {};

    TagViewModel = kendo.data.ObservableObject.extend();

    app.tagService = {
        viewModel: new TagViewModel()
    };
})(window);
