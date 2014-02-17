define([
    'app/infrastructure/LocalStore',
    "dojo/_base/declare",
    "gform/createLayoutEditorFactory",
    "./AbstractCrudService"
],
    function (LocalStore, declare, createLayoutEditorFactory, AbstractCrudService) {

        return declare("app.service.InMemoryCrudService", [AbstractCrudService], {
            constructor: function () {
                this.storeClass = LocalStore;
                this.editorFactory = createLayoutEditorFactory();
                this.sync=true;

            }
        });

    });
