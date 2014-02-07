define([
    './ToMongoQueryTransform',
    'dojo/request/xhr',
    'dojo/store/util/QueryResults',
    'dojo/Deferred',
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dojo/store/JsonRest"//
], function (ToMongoQueryTransform, xhr, QueryResults, Deferred, lang, declare, JsonRest) {

    return declare([ JsonRest ], {
        transform: null,
        constructor: function () {
            this.transform = new ToMongoQueryTransform();
        },
        query: function (query, options) {
            var params = {};

            var queryParams = this.transform.transform(query);
            if (queryParams) {
                params.conditions = JSON.stringify(queryParams);
            } else {
                lang.mixin(params, query);
            }

            if (options.sort) {
                var sort = [];
                options.sort.forEach(function (col) {
                    sort.push(col.attribute + (col.descending ? "-" : ""));
                });
                params.sort = sort.join("  ");

            }

            params.skip = options.start;
            params.limit = options.count;
            var results = xhr.get(this.target, {query: params, handleAs: "json"});
            var countParams = {count: true};
            results.total = xhr.get(this.target, {query: countParams, handleAs: "json"});
            return new QueryResults(results);
        }, add: function (object, options) {
            delete object[this.idProperty];
            var promise = this.inherited(arguments);
            var newPromise = new Deferred();
            promise.then(lang.hitch(this, "onAdded", newPromise), newPromise.reject);
            return newPromise;
        }, onAdded: function (promise, data) {
            promise.resolve(data._id);
        }, put: function (object, options) {
            var promise = this.inherited(arguments);
            if (options && options.overwrite===false) {
                // insert
                return promise;
            } else {
                // update
                var newPromise = new Deferred();
                promise.then(lang.hitch(this, "onUpdated", newPromise), newPromise.reject);
                return newPromise;
            }
        }, onUpdated: function (promise, data) {
            var update = [
                {path: "__v", "value": data["__v"]}
            ];
            promise.resolve(update);
        }
    });

});
