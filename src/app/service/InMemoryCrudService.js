define([
    "dojo/_base/declare",
    "dojo/store/Memory",
    "gform/createLayoutEditorFactory",
    "./AbstractCrudService"
],
    function (declare, Store, createLayoutEditorFactory, AbstractCrudService) {

        return declare("app.service.InMemoryCrudService", [AbstractCrudService], {
            constructor: function () {
                this.storeClass = Store;
                this.editorFactory = createLayoutEditorFactory();
                this.sync=true;

            }
        });

    });
