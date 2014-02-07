define([
    "dojo/_base/declare",
    "../infrastructure/BaucisStore",
    "gform/primitive/nullablePrimitiveConverter",
    "gform/createLayoutEditorFactory",
    "./AbstractCrudService"
],
    function (declare, BaucisStore, identityConverter, createLayoutEditorFactory, AbstractCrudService) {

        return declare("app.service.BaucisCrudService", [AbstractCrudService], {
            conditions: {
                "string": ["contain", "equal", "startWith", "endWith", "notEqual"],
                "number": ["equal"],
                "date": ["equal"],
                "time": ["equal"],
                "enum": ["equal"]
            },
            constructor: function () {
                this.storeClass = BaucisStore;
                this.editorFactory = createLayoutEditorFactory();
                this.editorFactory.addConverterForType(identityConverter, "ref");
                this.idProperty = "_id";

            },
            _createResource: function (resource) {
                resource.conditions = this.conditions;
                return this.inherited(arguments, [resource])
            }
        });

    });
