define([
    "dojo/_base/declare",
    "../infrastructure/SchemaRegistry",
    "../infrastructure/StoreRegistry",
    "../infrastructure/BaucisStore",
    "gform/primitive/nullablePrimitiveConverter",
    "../infrastructure/gform2tableStructure",
    "gform/createLayoutEditorFactory",
    "dojo/Deferred",
    "dojo/_base/url",
    "dojo/when"
],
    function (declare, SchemaRegistry, StoreRegistry, BaucisStore, identityConverter, gform2tableStructure, createLayoutEditorFactory, Deferred, Url, when) {

        return declare("service.GformMetaService", null, {
            meta: null,
            schemaRegistry: null,
            storeRegistry: null,
            resourcePromises: null,
            constructor: function () {
                this.resourcePromises = {};
                this.resources = {};
                this.editorFactory = createLayoutEditorFactory();
                this.editorFactory.addConverterForType(identityConverter, "ref");

            },
            onLoaded: function (data) {
                this.meta = data.resources;
                this.schemaRegistry = new SchemaRegistry({basePath: this.meta.basePath});
                this.storeRegistry = new StoreRegistry({storeClass: BaucisStore, basePath: this.meta.basePath, idProperty: "_id"});
                this.meta.resources.forEach(function (resource) {
                    this.resources[resource.name] = resource;
                    resource.type = "resource";
                    resource.schemaRegistry = this.schemaRegistry;
                    resource.storeRegistry = this.storeRegistry;
                    resource.editorFactory = this.editorFactory;
                    var fullSchemaUrl = new Url()
                    var promise = this.schemaRegistry.get(resource.schemaUrl);
                    var deferred = new Deferred();
                    this.resourcePromises[resource.name] = deferred;
                    when(promise).then(function (schema) {
                        resource.tableStructure = gform2tableStructure(schema);
                        deferred.resolve(resource);
                    })
                }, this);
            },
            getSchemaRegistry: function () {
                return this.schemaRegistry;
            },
            getStoreRegistry: function () {
                return this.storeRegistry;
            },
            getMeta: function (name) {
                return this.resourcePromises[name];
            },
            getItems: function () {
                return meta.resources;
            }
        });

    });
