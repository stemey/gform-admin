define([ 'gform/schema/JsonSchemaConverter',
    'dojo/request/xhr',
    'dojo/promise/all',
    'dojo/Deferred',
    'gform/util/Resolver',
    'dojo/_base/json',
    "dojo/text!../services.json",
    "dojo/_base/lang",
    "dojo/_base/declare",
    "gform/controller/SchemaRegistry",
    "gform/controller/StoreRegistry"
],
    function (JsonSchemaConverter, xhr, all, Deferred, Resolver, json, servicesJson, lang, declare, SchemaRegistry, StoreRegistry) {

        declare("app.service.SwaggerMetaService", null, {
            services: null,
            metaPromise: null,
            schemaRegistry: null,
            constructor: function () {
                var services = json.fromJson(servicesJson);
                var resolver = new Resolver();
                this.metaPromise = new Deferred();
                resolver.resolve(services).then(lang.hitch(this, "onLoaded", services));

                this.schemaRegistry = new SchemaRegistry();
                this.storeRegistry = new StoreRegistry();
            },
            onLoaded: function (services, data) {
                this.services = {};
                var promises = [];
                services.services.forEach(function (service) {
                    var promise = this["on" + service.type.substring(0, 1).toUpperCase() + service.type.substring(1, service.type.length) + "Loaded"](services, service);
                    promises.push(promise);
                }, this);
                all(promises).then(lang.hitch(this, "onAllLoaded"));
            },
            onGformLoaded: function (services, service) {
                service.resources.forEach(function(resource) {
                    this.resoures
                })
            },
            onAllLoaded: function () {
                this.metaPromise.resolve();
                for (var key in this.services) {
                    if (this.services[key].type === "resource") {
                        this.schemaRegistry.register(key, this.services[key].resourceSchema);
                        this.schemaRegistry.register(this.services[key].resourceSchema.code.toLowerCase(), this.services[key].resourceSchema);
                        this.storeRegistry.register(key, new Store({target:this.services[key].uri}));
                        // baucis
                        this.storeRegistry.register(this.services[key].resourceSchema.code.toLowerCase(), new Store({target:this.services[key].uri, idProperty:"_id"}));
                    }
                }
            },
            onSwaggerLoaded: function (services, service) {
                service.apis.apis.forEach(function (api) {
                    this.services[service.prefix + api.path] = {type: "swagger", path: service.apis.basePath + api.path, description: api.description};
                }, this)
                return "";
            },
            onCrudSwaggerLoaded: function (services, service) {
                var promises = [];
                service.apis.apis.forEach(function (api) {
                    var promise = xhr(service.apis.basePath + api.path, {handleAs: "json", headers: {"X-Requested-With": null}, method: "GET"});
                    promise.then(lang.hitch(this, "onCrudSwaggerDetailLoaded", services, service, api));
                    promises.push(promise);
                }, this);
                return all(promises);
            },
            onCrudSwaggerDetailLoaded: function (services, service, api, detail) {
                // let's assume a single model for now
                for (var key in detail.models) {
                    var schema = new JsonSchemaConverter().convert(detail.models[key])
                }
                var uri = detail.basePath + detail.resourcePath + "/";
                var meta = {
                    type: "resource",
                    uri: uri,
                    collectionUri: uri,
                    idProperty: "_id",
                    resourceSchema: schema,
                    collectionSchema: schema
                };
                this.services[service.prefix + api.path] = meta;

            },
            getSchemaRegistry: function () {
                return this.schemaRegistry;
            },
            getStoreRegistry: function () {
                return this.storeRegistry;
            },
            getMeta: function (service) {
                var deferred = new Deferred();
                var me = this;
                this.metaPromise.then(function () {
                    deferred.resolve(me.services[service])
                });
                return deferred;
            }
        });

        metaService = new service.MetaService();
        return metaService;

    });
