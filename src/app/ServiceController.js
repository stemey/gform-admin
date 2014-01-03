define(
    [  './SwaggerController',
        "dojo/_base/lang", "dojo/_base/declare",
        "app/service/MetaService",
        './MethodController',
        //
        //
        "dojox/mvc/Group",//
        "dijit/_WidgetBase", "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin", //
        "dojo/text!./service.html",//
        "gform/layout/_InvisibleMixin",
        "dojo/on",
        "dijit/MenuBar",
        "dijit/PopupMenuBarItem",
        "dijit/DropDownMenu",
        "dijit/MenuItem"

    ],
    function (SwaggerController, lang, declare, metaService, MethodController, //
              //
              //
              Group,//
              _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, _InvisibleMixin, on) {

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
                    this.selectService("/vegetables");
                },
                selectService: function (service) {
                    var meta = metaService.getMeta(service);
                    meta.then(lang.hitch(this, "onMetaLoaded"));

                },
                onMetaLoaded: function (meta) {
                    var controller = this.swagger;
                    this.serviceStack.selectChild(controller);
                    controller.loadData(meta);
                }
            });

    });
