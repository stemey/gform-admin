define([
    'dojo/request/xhr',
    'dojo/Deferred',
    'dojo/when',
    './Resolver',
    'dojo/_base/json',
    "dojo/text!../services.json",
    "dojo/_base/lang",
    "dojo/_base/declare"
],
    function (xhr, Deferred, when, Resolver, json, servicesJson, lang, declare) {

        var MetaService = declare("app.service.MetaService", null, {
            services: null,
            metaPromise: null,
            schemaRegistry: null,
            expectedCount: null,
            loadedCount: 0,
            constructor: function () {
                this.services = {};
                var services = json.fromJson(servicesJson);
                this.metaPromise = new Deferred();
                this.expectedCount = services.services.length;
                services.services.forEach(function (service) {
                    var p = xhr(service.url, {method: "GET", handleAs: "json", headers: {"X-Requested-With": null}});
                    p.then(lang.hitch(this, "onServiceLoaded", service), lang.hitch(this, "onServiceFailed", service));
                }, this)
            },
            onServiceFailed: function (service, e) {
                console.error("failed to load " + service.name, e);
                this._loaded();
            },
            onServiceLoaded: function (service, data) {
                var serviceMap = this.services;
                var me =this;
                require([service.type], function (MetaServiceType) {
                    var metaService = new MetaServiceType();
                    serviceMap[service.name] = metaService;
                    metaService.onLoaded(service, data);
                    me._loaded();
                });
            },
            _loaded: function () {
                this.loadedCount++;
                if (this.loadedCount == this.expectedCount) this.metaPromise.resolve(true);
            },
            _defer: function (cb) {
                var deferred = new Deferred();
                var me = this;
                var cb2 = function () {
                    var promise = cb.apply(me);
                    when(promise).then(function (result) {
                        deferred.resolve(result)
                    });
                }
                when(this.metaPromise).then(cb2);
                return deferred;
            },
            getServices: function () {
                return this._defer(function () {
                    var services = [];
                    Object.keys(this.services).forEach(function (name) {
                        services.push({name: name});
                    }, this);
                    return services;
                });
            },
            getItems: function (name) {
                return this._defer(function () {
                    return this.services[name].getItems();
                });
            },
            _decomposeName: function (name) {
                return name.split(":");
            },
            getMetaService: function (name) {
                return this._defer(function () {
                    var split = this._decomposeName(name);
                    return this.services[split[0]];
                });

            },
            getMeta: function (name) {
                return this._defer(function () {
                    var split = this._decomposeName(name);
                    var metaService = this.services[split[0]];
                    return metaService.getMeta(split[1]);
                });
            }
        });

        metaService = new MetaService();
        return metaService;

    });
