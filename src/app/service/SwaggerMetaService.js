define([
    "dojo/_base/declare"
],
    function (declare) {

        return declare("app.service.SwaggerMetaService", null, {
            services: null,
            constructor: function () {
                this.services = {};
            },
            onLoaded: function (data) {
                data.apis.apis.forEach(function (api) {
                    this.services[api.path] = {name: api.path, type: "swagger", path: data.apis.basePath + api.path, description: api.description};
                }, this)
            },
            getMeta: function (service) {
                return this.services[service];
            },
            getItems: function () {
                var services = [];
                Object.keys(this.services).forEach(function (name) {
                    services.push({name: name, path: this.services[name].path})
                }, this);
                return services;
            }
        });


    });
