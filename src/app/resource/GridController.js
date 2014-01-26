define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/aspect",
    "../infrastructure/gform2tableStructure",
    "gridx/Grid",
    'gridx/core/model/cache/Async',
    "gridx/modules/VirtualVScroller",
    "gridx/modules/ColumnResizer",
    "gridx/modules/SingleSort",
    "gridx/modules/Filter",
    'gridx/modules/filter/FilterBar',
    'gridx/core/model/extensions/Query',
    'gridx/modules/Focus',
    'gridx/modules/RowHeader',
    'gridx/modules/select/Row',

    "dojo/json",
    "./EditorController",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "gform/layout/_InvisibleMixin",
    "dojo/text!./grid.html",
    "gform/Context",
    "gform/createLayoutEditorFactory",
    "gform/primitive/nullablePrimitiveConverter",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/Toolbar"
], function (declare, lang, aspect, gform2TableStructure, Grid, Cache, VirtualVScroller, ColumnResizer, SingleSort, Filter, FilterBar, Query, Focus, RowHeader, RowSelect,  json, EditorController, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _InvisibleMixin, template, Context,createEditorFactory,identityConverter) {


    var allFilterConditions = {"string": ["contain", "equal", "startWith", "endWith", "notEqual", "notContain", "notStartWith", "notEndWith", "isEmpty"],
        "number": ["equal", "greater", "less", "greaterEqual", "lessEqual", "notEqual", "isEmpty"],
        "date": ["equal", "before", "after", "range", "isEmpty"],
        "time": ["equal", "before", "after", "range", "isEmpty"],
        "enum": ["equal", "notEqual", "isEmpty"],
        "boolean": ["equal", "isEmpty"]}
    return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _InvisibleMixin], {
        baseClass: "gformGridController",
        templateString: template,
        opener:null,
        postCreate: function () {
        },
        loadData: function (resource) {
            // resource needs to have the foolowing properties
            //      schemaRegistry
            //      storeRegistry
            //      tableStructure
            //      converter for reference aka EditorFactory
            //      schemaUrl
            //
            if (this.grid) {
                this.grid.destroy();
            }
            var storeRegistry=resource.storeRegistry;
            var schemaRegistry=resource.schemaRegistry;

            var structure = resource.tableStructure;
            var props = { id: "grid", width: "100%", height: "100%"};
            props.cacheClass = Cache;
            props.structure = structure;
            this.store=storeRegistry.get(resource.collectionUrl);
            //this.store = new Store({
            //    target: resource.collectionUri,
            //    idProperty: resource.idProperty,
            //    sortParam: "sortBy"
            //});
            props.store = this.store;
            props.modules = [
                VirtualVScroller,
                {
                    moduleClass: Filter,
                    serverMode: true
                },
                {
                    moduleClass: FilterBar,
                    type: "all",
                    conditions: {
                        "string": ["equal"],
                        "number": ["equal"],
                        "data": ["equal"],
                        "time": ["equal"],
                        "enum": ["equal"]
                    }
                },
                {
                    moduleClass: RowSelect,
                    multiple: false,
                    triggerOnCell: true


                },
                RowHeader,
                SingleSort
            ];
            this.grid = new Grid(props);

            this.grid.select.row.connect(this.grid.select.row, "onSelected", lang.hitch(this, "rowSelected"));
            this.gridContainer.addChild(this.grid);
            this.grid.startup();
            //this.borderContainer.layout();

            this.ctx = new Context();
            this.schemaUrl = resource.schemaUrl;
            this.ctx.schemaRegistry=schemaRegistry;
            this.ctx.storeRegistry=storeRegistry;
            this.ctx.opener=this.opener;
            this.opener.set("ctx",this.ctx);


            var editorFactory = resource.editorFactory;
            //editorFactory.addConverterForType(identityConverter, "ref");
            this.editorController.setEditorFactory(editorFactory);
            this.editorController.setCtx(this.ctx);
            this.editorController.set("store", this.store);
            this.editorController.createNew(this.schemaUrl);

            //this.editorController.loadData(resource, storeRegistry, schemaRegistry);
            aspect.before(this.store, "remove", lang.hitch(this, "_onDelete"));
            aspect.after(this.editorController, "_onUpdate", lang.hitch(this, "reload"));
            aspect.after(this.editorController, "_onAdd", lang.hitch(this, "reload"));
            aspect.after(this.editorController, "_onRemoved", lang.hitch(this, "reload"));
            //this.borderContainer.resize({w:500,h:500});
            this.borderContainer.resize();
        },
        reload: function () {
            this.grid.model.clearCache();
            this.grid.view.load();
        },
        startup: function () {
            this.inherited(arguments);
        },
        rowSelected: function (e) {
            this.editorController.edit(e.id);
        },
        createNew: function () {
            this.editorController.createNew(this.schemaUrl);
        },
        previous: function () {
            this._moveSelection(-1);
        },
        next: function () {
            this._moveSelection(1);
        },
        _onDelete: function () {
            this._moveSelection(1);
        },
        _moveSelection: function (delta) {
            var selectedId = this.grid.select.row.getSelected();
            if (selectedId) {
                var index = this.grid.model.idToIndex(selectedId);
                if (index < 0) {
                    return;
                }
                var nextId = this.grid.model.indexToId(index + delta);
                if (typeof nextId == "undefined") {
                    return;
                } else {
                    this.grid.select.row.deselectById(selectedId);
                    this.grid.select.row.selectById(nextId);
                }
            }
        }
    });


});