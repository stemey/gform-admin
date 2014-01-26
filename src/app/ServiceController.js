define(
    [  './resource/GridController',
        './SwaggerController',
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/_base/declare",
        "app/service/MetaService",
        './MethodController',
        "dojo/when",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin", //
        "dojo/text!./service.html",//
        "gform/layout/_InvisibleMixin",
        "dijit/MenuBar",
        "dijit/PopupMenuBarItem",
        "dijit/DropDownMenu",
        "dijit/MenuItem"


    ],
    function (GridController, SwaggerController, lang, array, declare, metaService, MethodController, when,//
              //
              //
              //
              _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, _InvisibleMixin) {

        return declare(
            "app.ServiceController",
            [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _InvisibleMixin ],
            {
                isLayoutContainer: true,
                templateString: template,
                editor: null,
                meta: null,
                metaUrl: null,
                controllers: {

                },
                postCreate: function () {

                },
                startup: function () {
                    this.inherited(arguments);
                    array.forEach(this.menuBar.getChildren(), function (menuItem) {
                        array.forEach(menuItem.popup.getChildren(), function (navItem) {
                            navItem.onClick = lang.hitch(this, "onNavClicked", navItem);
                        }, this)
                    }, this)
                },
                onNavClicked: function (navItem) {
                    this.selectService(navItem.service);
                },
                selectService: function (service) {
                    var meta = metaService.getMeta(service);
                    when(meta).then(lang.hitch(this, "onMetaLoaded"));

                },
                onMetaLoaded: function (meta) {
                    var controller = this[meta.type];
                    this.serviceStack.selectChild(controller);
                    controller.loadData(meta);
                }
            });

    });