define([
    "dojo/_base/declare"
],
    function (declare) {

        return declare("app.service.SwaggerMetaService", null, {
            services: null,
            constructor: function () {
                this.services = {};
            },
            onLoaded: function (service, data) {
                if (data == null) {
                    // loading failed
                } else {
                    data.apis.forEach(function (api) {
                        var path = service.url + api.path;
                        this.services[api.path] = {name: api.path, type: "swagger", path: path, description: api.description};
                    }, this)
                }
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
