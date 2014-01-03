define([ 'gform/schema/JsonSchemaConverter',
    'dojo/aspect',
    'dojo/request/xhr',
    "dojo/_base/array", "dojo/_base/lang", "dojo/_base/declare", "dojo/Stateful",
    "app/service/MetaService", "app/service/RestService", 'dojo/data/ItemFileReadStore',
    'gform/createLayoutEditorFactory', "gform/layout/_InvisibleMixin",
    "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/text!./swagger.html", "dojo/query",//
    "dojox/highlight",
    "dojox/highlight/languages/javascript", "dojox/highlight/widget/Code", "dojox/mvc/Output", "dojox/mvc/Group"
], function (JsonSchemaConverter, aspect, xhr, array, lang, declare, Stateful, metaService, restService, ItemFileReadStore, createStandardEditorFactory, _InvisibleMixin,//
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
                    operation.verb = op.httpMethod;
                    operation.nickname = op.nickname;
                    operation.description = op.description;

                    operation.params = {attributes: []};
                    operation.pathVariables = {attributes: []};
                    operation.requestBody = {attributes: []};
                    op.parameters.forEach(function (p) {
                        var param = {};
                        param.code = p.name;
                        param.type = (p.dataType == "int" || p.dataType == "double") ? "number" : p.dataType;
                        param.description = p.description;
                        if (p.paramType == "query") {
                            operation.params.attributes.push(param);
                        } else if (p.paramType == "path") {
                            operation.pathVariables.attributes.push(param);
                        }else if (p.paramType == "body") {
                            var converter = new JsonSchemaConverter();
                            var schema=converter.convert(meta.models[p.dataType]);
                            operation.requestBody=schema;
                        }
                    })

                    operations.push(operation);
                }, this);
            }, this);
            return operations;
        },
        onMetaLoaded: function (allMeta) {
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