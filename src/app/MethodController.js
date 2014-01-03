define([ 'dojo/request/xhr',
    "dojo/_base/array", "dojo/_base/lang", "dojo/_base/declare", "dojo/Stateful",
    "app/service/MetaService", "app/service/RestService", 'dojo/data/ItemFileReadStore',
    'gform/createLayoutEditorFactory', "gform/layout/_InvisibleMixin",
    "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/text!./method.html", "dojo/query",//
    "dojox/highlight",
    "dojox/highlight/languages/javascript", "dojox/highlight/widget/Code", "dojox/mvc/Output", "dojox/mvc/Group"
], function (xhr, array, lang, declare, Stateful, metaService, restService, ItemFileReadStore, createStandardEditorFactory, _InvisibleMixin,//
             _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, query, highlight) {


    return declare("app/MethodController", [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        resizing:true,
        _relTargetProp: "model",
        templateString: template,
        editor: null,
        meta: null,
        model: new Stateful(),
        constructor: function () {
        },
        postCreate: function () {

            var editorFactory = createStandardEditorFactory();

            this.editorVariables.set("editorFactory", editorFactory);
            this.editorParams.set("editorFactory", editorFactory);
            this.editorBody.set("editorFactory", editorFactory);

            if (this.resizing) {
                this.domNode.style.overflow="scroll";
                this.domNode.style.height="100%";
            }

        },
        loadData: function (meta) {
            this.hideResponse();
            this.set("meta", meta);
            this.model.set("uriPattern", meta.uriPattern);
            this.model.set("verb", meta.verb);

           if (meta.params) {
                this.editorParams.domNode.style.display = "initial";
                this.editorParams.setMetaAndPlainValue(meta.params, {});
            } else {
                this.editorParams.domNode.style.display = "none";
            }

            if (this.meta.pathVariables) {
                this.editorVariables.domNode.style.display = "initial";
                this.editorVariables.setMetaAndPlainValue(this.meta.pathVariables, {});
            } else {
                this.editorVariables.domNode.style.display = "none";
            }

            if (this.meta.requestBody) {
                this.editorBody.domNode.style.display = "initial";
                this.editorBody.setMetaAndPlainValue(this.meta.requestBody, {});
            } else {
                this.editorBody.domNode.style.display = "none";
            }

        },
        onRestResponse: function (response) {
            this.displayArea.innerHTML = "<pre class='response'><code class='javascript'></code></pre>";
            var nodes = query("pre > code", this.displayArea);
            var node = nodes[0];
            node.innerHTML = dojo.toJson(response, true);
            highlight.init(node);
            this.model.set("statusCode", 200);
        },
        onRestError: function (error) {
            this.displayArea.innerHTML = "";
            this.model.set("statusCode", error.response.status);
        },
        hideResponse: function (e) {
            this.displayArea.innerHTML = "";
        },
        validate: function () {
            var totalErrorCount = 0;
            if (this.meta.pathVariables) {
                totalErrorCount += this.editorVariables.validate(true);
            }
            if (this.meta.params) {
                totalErrorCount += this.editorParams.validate(true);
            }
            if (this.meta.requestBody) {
                totalErrorCount += this.editorBody.validate(true);
            }
            return totalErrorCount == 0;
        },
        getValuesFromEditor: function (editor, meta) {
            if (meta) {
                return editor.get("plainValue");
            } else {
                return undefined;
            }
        },
        submit: function () {
            var valid = this.validate();
            if (!valid) {
                return;
            }

            var callback = lang.hitch(this, "onRestResponse");
            var error = lang.hitch(this, "onRestError");
            var plainParams = this.editorParams.get("plainValue");
            this.hideResponse();

            if (this.meta.verb == "GET") {
                restService.executeGet({
                    params: this.getValuesFromEditor(this.editorParams, this.meta.params),
                    variables: this.getValuesFromEditor(this.editorVariables, this.meta.pathVariables),
                    meta: this.meta,
                    callback: callback,
                    error: error
                });
            } else if (this.meta.verb == "POST") {
                restService.executePost({
                    params: this.getValuesFromEditor(this.editorParams, this.meta.params),
                    variables: this.getValuesFromEditor(this.editorVariables, this.meta.pathVariables),
                    requestBody: this.getValuesFromEditor(this.editorBody, this.meta.requestBody),
                    meta: this.meta,
                    callback: callback,
                    error: error
                });
            } else if (this.meta.verb == "PUT") {
                restService.executePut({
                    params: this.getValuesFromEditor(this.editorParams, this.meta.params),
                    variables: this.getValuesFromEditor(this.editorVariables, this.meta.pathVariables),
                    requestBody: this.getValuesFromEditor(this.editorBody, this.meta.requestBody),
                    meta: this.meta,
                    callback: callback,
                    error: error
                });
            } else if (this.meta.verb == "DELETE") {
                restService.executeDelete({
                    params: this.getValuesFromEditor(this.editorParams, this.meta.params),
                    variables: this.getValuesFromEditor(this.editorVariables, this.meta.pathVariables),
                    requestBody: this.getValuesFromEditor(this.editorBody, this.meta.requestBody),
                    meta: this.meta,
                    callback: callback,
                    error: error
                });
            }
        }, resize: function (dim) {
            if (this.resizing && dim) {
                this.domNode.style.height = dim.h + "px";
            }
        }

    });
});