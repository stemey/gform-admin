define([
    "dojo/_base/declare",
    "dojo/_base/url",
    "dojo/_base/lang"
], function (declare, Url, lang) {
// module:
//		gform/controller/StoreRegistry


    return declare([], {
        // summary:
        //		A registry for stores. Makes it easy to reuse and mock stores.

        // id2store: object
        //		id (probably url) to store mapping
        id2store: {},
        basePath: null,
        idProperty: null,

        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs);
        },

        // StoreClass:
        //		the class used for initializing stores.
        storeClass: null,
        get: function (url) {
            // summary:
            //		get the store for the id. If none exist then instantiate the default store with the given properties
            // id: String
            //		the id (e.g. url) of the store
            // props: object
            //		the properties of the store (e.g.: target/url and idProperty)
            var fullUrl = new Url(this.basePath, url).uri;
            var cached = this.id2store[fullUrl];
            if (!cached) {
                cached = new this.storeClass({target: fullUrl, idProperty: this.idProperty});
                this.id2store[fullUrl] = cached;
            }
            return cached;
        },
        register: function (id, store) {
            // summary:
            //		register a store with the id
            // id: String
            //		the id
            // store: dojo/store/Store
            //		a store instance
            this.id2store[id] = store;
        }
    });


});
