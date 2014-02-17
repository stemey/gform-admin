define([
    'localstorage/LocalStorage',
    "dojo/_base/declare"
], function (LocalStorage, declare) {
// module:
//		gform/controller/SchemaRegistry


    return declare([LocalStorage],
        {
            constructor: function (kwArgs) {
                this.subsetProperty = "store";
                this.subsetName = kwArgs.target;
            }
        })

});
