define(
    [  './singleton/SingletonController',
        './resource/GridController',
        './swagger/SwaggerController',
        "./router",
        "dojo/_base/lang",
        "dojo/_base/declare",
        "app/service/MetaService",
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
    function (SingletonController, GridController, SwaggerController, router, lang, declare, metaService, when, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, _InvisibleMixin, MenuBar, PopupMenuBarItem, DropDownMenu, MenuItem) {

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
                    var cb = lang.hitch(this, "_pathChanged");
                    var index = lang.hitch(this, "_index");
                    router.register(":name/:resource", cb);
                    router.register("", index);
                    router.startup();
                },
                _index: function () {
                    this.serviceStack.selectChild(this.noselection);
                },
                _pathChanged: function (evt) {
                    this.selectService(evt.params.name, evt.params.resource);
                },
                startup: function () {
                    this.inherited(arguments);
                    this.addMenu();
                },
                navigateToService: function (service, resource) {
                    router.goToService(service, encodeURIComponent(resource));

                },
                selectService: function (service, resource) {
                    var resource = decodeURIComponent(resource);
                    var meta = metaService.getMeta(service + ":" + resource);
                    when(meta).then(lang.hitch(this, "onMetaLoaded"));


                },
                onMetaLoaded: function (meta) {
                    var controller = this[meta.type];
                    this.serviceStack.selectChild(controller);
                    controller.loadData(meta);
                },
                addMenu: function () {
                    var groups = [];
                    var services = metaService.getServices();
                    var me = this;
                    when(services).then(function (services) {
                        services.forEach(function (service) {
                            var menu = new DropDownMenu();
                            var groupItem = new PopupMenuBarItem({label: service.name, popup: menu});
                            me.menuBar.addChild(groupItem);
                            var items = metaService.getItems(service.name);
                            when(items).then(function (items) {
                                items.forEach(function (item) {
                                    var menuItem = new MenuItem({label: item.name, onClick: lang.hitch(me, "navigateToService", service.name, item.name)});
                                    menu.addChild(menuItem);
                                }, me);

                            });
                            me.resize();
                        }, me);
                    });

                }

            });

    });
