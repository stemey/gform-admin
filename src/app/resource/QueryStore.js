define([ './ToMongoQueryTransform',
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
            var queryParams = this.transform.transform(query);

            var sort = [];
            if (options.sort) {

                options.sort.forEach(function (col) {
                    sort.push(col.attribute+(col.descending ? "-" : ""));
                });

            }

            var params = {sort: sort.join(" "), conditions: JSON.stringify(queryParams), skip: options.start, limit: options.count};
            var results = xhr.get(this.target, {query: params, handleAs: "json"});
            var countParams = {count: true};
            results.total = xhr.get(this.target, {query: countParams, handleAs: "json"});
            return new QueryResults(results);
        }, add: function (object, options) {
            var promise = this.inherited(arguments);
            var newPromise = new Deferred();
            promise.then(lang.hitch(this, "onAdded", newPromise), newPromise.reject);
            return newPromise;
        }, onAdded: function (promise, data) {
            promise.resolve(data._id);
        }
    });

});
