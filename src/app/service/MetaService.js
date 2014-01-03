define([ 'dojo/Deferred',
    'gform/util/Resolver',
    'dojo/_base/json',
    'dojo/request/xhr', "dojo/text!../services.json",
    "dojo/_base/lang", "dojo/_base/declare", "dojo/_base/array" ],
    function (Deferred, Resolver, json, xhr, servicesJson, lang, declare, array) {

        declare("service.MetaService", null, {
            services: null,
            constructor: function () {
                var services = json.fromJson(servicesJson);
                var resolver = new Resolver();
                var me = this;
                this.metaPromise = resolver.resolve(services);
                this.metaPromise.then(lang.hitch(this, "onLoaded", services));
            },
            onLoaded: function (services, data) {
                this.services = {};
                services.services.forEach(function (service) {
                    this["on" + service.type.substring(0, 1).toUpperCase() + service.type.substring(1, service.type.length) + "Loaded"](service);
                }, this);
            },
            onSwaggerLoaded: function (service) {
                service.apis.apis.forEach(function (api) {
                    this.services[api.path] = {path: service.apis.basePath + api.path, description: api.description};
                }, this)
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
