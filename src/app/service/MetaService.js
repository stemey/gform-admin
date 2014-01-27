define([
    'dojo/Deferred',
    'gform/util/Resolver',
    'dojo/_base/json',
    "dojo/text!../services.json",
    "dojo/_base/lang",
    "dojo/_base/declare"
],
    function (Deferred, Resolver, json, servicesJson, lang, declare) {

        declare("service.MetaService", null, {
            services: null,
            metaPromise: null,
            schemaRegistry: null,
            constructor: function () {
                var services = json.fromJson(servicesJson);
                var resolver = new Resolver();
                this.metaPromise = new Deferred();
                resolver.resolve(services).then(lang.hitch(this, "onLoaded", services));
            },
            onLoaded: function (services, data) {
                var serviceMap = {};
                ;
                this.services = serviceMap;
                services.services.forEach(function (service) {
                    require([service.type], function (MetaServiceType) {
                        var metaService = new MetaServiceType();
                        serviceMap[service.name] = metaService;
                        metaService.onLoaded(service);
                    });
                }, this);
            },
            getServices: function () {
                var services = [];
                Object.keys(this.services).forEach(function (name) {
                    services.push({name:name});
                }, this);
                return services;
            },
            getItems: function (name) {
                // TODO add prefix
                return this.services[name].getItems();
            },
            _decomposeName: function (name) {
                return name.split(":");
            },
            getMetaService: function (name) {
                var split = this._decomposeName(name);
                return this.services[split[0]];
            },
            getMeta: function (name) {
                var split = this._decomposeName(name);
                var metaService = this.services[split[0]];
                return metaService.getMeta(split[1]);
            }
        });

        metaService = new service.MetaService();
        return metaService;

    });
