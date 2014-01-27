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

                },
                startup: function () {
                    this.inherited(arguments);
                    array.forEach(this.menuBar.getChildren(), function (menuItem) {
                        array.forEach(menuItem.popup.getChildren(), function (navItem) {
                            navItem.onClick = lang.hitch(this, "onNavClicked", navItem);
                        }, this)
                    }, this)
                    // use a proper promise here
                    setTimeout(lang.hitch(this, "addMenu"), 500);


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
                            var menuItem = new MenuItem({label: item.name, onClick: lang.hitch(this, "selectService", service.name+":"+item.name)});
                            menu.addChild(menuItem);
                        }, this);
                        groups.push(groupItem);
                    }, this);
                    return groups;
                }

            });

    });
