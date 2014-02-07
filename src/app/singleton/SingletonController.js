define([
    'dojo/when',
    'gform/controller/CrudController',
    'gform/Context',
    "dojo/_base/declare"
], function (when, CrudController, Context, declare) {
    return declare("app.singleton.SingletonController", [ CrudController ], {
        loadData: function (singleton) {
            var store = singleton.storeRegistry.get(singleton.resourceUrl);
            this.set("store", store);

            var ctx = new Context();
            ctx.schemaRegistry = singleton.schemaRegistry;
            ctx.storeRegistry = singleton.storeRegistry;
            this.setCtx(ctx);

            this.setEditorFactory(singleton.editorFactory);

            var me = this;
            when(store.get(singleton.resourceId)).then(function (entity) {
                if (entity) {
                    me.edit(singleton.resourceId, singleton.schemaUrl);
                } else {
                    var entity = {};
                    entity[store.idProperty] = singleton.resourceId;
                    var result = store.add(entity);
                    when(result).then(function () {
                        me.edit(singleton.resourceId, singleton.schemaUrl);
                    });

                }
            })


        }
    });
});
