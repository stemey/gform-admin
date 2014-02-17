define([
    'gform/util/Resolver',
    '../../gform/schema/JsonSchemaConverter',
    'dojo/aspect',
    "../method/MethodController",
    'dojo/request/xhr',
    "dojo/_base/array", "dojo/_base/lang", "dojo/_base/declare", "dojo/Stateful",
    "app/service/MetaService", "app/service/RestService", 'dojo/data/ItemFileReadStore',
    'gform/createLayoutEditorFactory', "gform/layout/_InvisibleMixin",
    "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/text!./swagger.html", "dojo/query",//
    "dojox/highlight",
    "dojox/highlight/languages/javascript", "dojox/highlight/widget/Code", "dojox/mvc/Output", "dojox/mvc/Group"
], function (Resolver, JsonSchemaConverter, aspect, MethodController, xhr, array, lang, declare, Stateful, metaService, restService, ItemFileReadStore, createStandardEditorFactory, _InvisibleMixin,//
             _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, query, highlight) {


    return declare("app.SwaggerController", [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        methodController: null,
        templateString: template,
        select: null,
        metas: null,
        postCreate: function () {
            this.select.on("change", lang.hitch(this, "onMetaChanged"));
        },
        loadData: function (meta) {
            xhr(meta.path, {headers: {'X-Requested-With': null}, handleAs: "json", method: "GET"}).then(lang.hitch(this, "onMetaLoaded"));
        },
        convertMetas: function (meta) {
            var operations = [];

            meta.apis.forEach(function (api) {
                api.operations.forEach(function (op) {
                    var operation = {};
                    operation.uriPattern = meta.basePath + api.path;
                    operation.verb = op.method;
                    operation.nickname = op.nickname;
                    operation.description = op.description;

                    operation.params = {attributes: []};
                    operation.pathVariables = {attributes: []};
                    operation.requestBody = {attributes: []};
                    op.parameters.forEach(function (p) {
                        var param = {};
                        param.code = p.name;
                        param.type = (p.type == "int" || p.type == "integer" || p.type == "double") ? "number" : p.type;
                        param.description = p.description;
                        if (p.paramType == "query") {
                            operation.params.attributes.push(param);
                        } else if (p.paramType == "path") {
                            operation.pathVariables.attributes.push(param);
                        } else if (p.paramType == "body") {
                            // wrap in an object with single attribute incase this is an array and not an object.
                            var converter = new JsonSchemaConverter();
                            var s = meta.models[p.type];
                            // TODO clone the object
                            var schema;
                            if (s) {
                                schema = {};
                                schema.type = "object";
                                lang.mixin(schema, s);
                            } else {
                                schema = {};
                                lang.mixin(schema, p);
                                if (schema.type == "array" && typeof schema.items.type == "undefined") {
                                    schema.items.type = "object";
                                }
                            }
                            var wrappedType = {properties: {body: schema}};
                            wrappedType.required=["body"];
                            var schema = converter.convert(wrappedType);
                            operation.requestBody = schema;

                        }
                    })

                    operations.push(operation);
                }, this);
            }, this);
            return operations;
        },
        onMetaLoaded: function (allMeta) {
            var resolver = new Resolver();
            resolver.resolve(allMeta);
            this.metas = this.convertMetas(allMeta);
            var idx = 0;
            var options = this.metas.map(function (meta) {
                return {label: meta.nickname, value: idx++};
            });
            this.methodController.loadData(this.metas[0]);
            this.select.set("options", options);
            this.select.set("value", 0);

        },
        onMetaChanged: function (idx) {
            this.methodController.loadData(this.metas[idx]);
        },
        resize: function (dim) {
            if (dim) {
                this.domNode.style.height = dim.h + "px";
            }

        }

    });
});