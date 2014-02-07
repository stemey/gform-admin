define([
    "dojo/_base/declare",
    "dojo/store/Memory",
    "gform/converter/refConverter",
    "gform/createLayoutEditorFactory",
    "./AbstractCrudService"
],
    function (declare, Store, refConverter, createLayoutEditorFactory, AbstractCrudService) {

        return declare("app.service.InMemoryCrudService", [AbstractCrudService], {
            constructor: function () {
                this.storeClass = Store;
                this.editorFactory = createLayoutEditorFactory();
                this.editorFactory.addConverterForType(refConverter, "ref");

            }
        });

    });
