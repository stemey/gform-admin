define([
    "dojo/_base/declare",
    "../infrastructure/SchemaRegistry",
    "../infrastructure/StoreRegistry",
    "../infrastructure/gform2tableStructure",
    "dojo/Deferred",
    "dojo/_base/url",
    "dojo/when"
],
    function (declare, SchemaRegistry, StoreRegistry, gform2tableStructure, Deferred, Url, when) {

        return declare("service.AbstractCrudService", null, {
            meta: null,
            schemaRegistry: null,
            storeRegistry: null,
            resourcePromises: null,
            storeClass: null,
            idProperty: "id",
            constructor: function () {
                this.resourcePromises = {};
            },
            onLoaded: function (data) {
                this.meta = data.resources;
                if (this.meta == null) {
                    // loading failed
                } else {
                    this.schemaRegistry = new SchemaRegistry({basePath: this.meta.basePath});
                    this.storeRegistry = new StoreRegistry({storeClass: this.storeClass, basePath: this.meta.basePath, idProperty: this.meta.idProperty || this.idProperty});
                    this.meta.resources.forEach(function (resource) {
                        var promise = this._createResource(resource);
                        this.resourcePromises[resource.name] = promise;
                    }, this);
                }
            },
            _createResource: function (resource) {
                if (resource.type === "singleton") {
                    resource.type = "singleton";
                    //resource.resourceId

                } else {
                    resource.type = "resource";
                }
                resource.schemaRegistry = this.schemaRegistry;
                resource.storeRegistry = this.storeRegistry;
                resource.editorFactory = this.editorFactory;
                var fullSchemaUrl = new Url()
                var promise = this.schemaRegistry.get(resource.schemaUrl);
                var deferred = new Deferred();
                when(promise).then(function (schema) {
                    if (resource.type !== "singelton") {
                        resource.tableStructure = gform2tableStructure(schema);
                    }
                    deferred.resolve(resource);
                })
                return deferred;
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
                return this.meta.resources;
            }
        });

    });
