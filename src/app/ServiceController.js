define(
    [  './resource/GridController',
        './SwaggerController',
        "./router",
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
    function (GridController, SwaggerController, router, lang, array, declare, metaService, MethodController, when,//
              //
              //
              //
              _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, _InvisibleMixin, MenuBar, PopupMenuBarItem, DropDownMenu, MenuItem) {

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
                    router.register(":name/:resource", cb);
                    router.startup();
                },
                _pathChanged: function (evt) {
                    this.selectService(evt.params.name, evt.params.resource);
                },
                startup: function () {
                    this.inherited(arguments);
                   // use a proper promise here
                    setTimeout(lang.hitch(this, "addMenu"), 500);


                },
                navigateToService: function (service, resource) {
                    router.goToService(service, resource.split("/").join("_"))

                },
                selectService: function (service, resource) {
                    var resource=resource.split("_").join("/");
                    var meta = metaService.getMeta(service + ":" + resource);
                    when(meta).then(lang.hitch(this, "onMetaLoaded"));

                },
                onMetaLoaded: function (meta) {
                    var controller = this[meta.type];
                    this.serviceStack.selectChild(controller);
                    controller.loadData(meta);
                },
                addMenu: function () {
                    var groupItems = this.createMenuItems();
                    groupItems.forEach(function (item) {
                        this.menuBar.addChild(item);
                    }, this);
                    // layout this if menu was empty before
                    this.resize();
                },
                createMenuItems: function () {
                    var groups = [];
                    var services = metaService.getServices();
                    services.forEach(function (service) {
                        var menu = new DropDownMenu();
                        var groupItem = new PopupMenuBarItem({label: service.name, popup: menu});
                        var items = metaService.getItems(service.name);
                        items.forEach(function (item) {
                            var menuItem = new MenuItem({label: item.name, onClick: lang.hitch(this, "navigateToService", service.name, item.name)});
                            menu.addChild(menuItem);
                        }, this);
                        groups.push(groupItem);
                    }, this);
                    return groups;
                }

            });

    });
