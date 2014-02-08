define([ 'dojo/request/xhr',
    'gform/util/Resolver',
    "dojo/_base/declare"
], function (xhr, Resolver, declare) {

    return declare("app.infrastructure.Resolver", [Resolver], {
        constructor: function () {
            this.returnNullForFailed = true;
        },
        _load: function (url) {
            return xhr(url, {handleAs: "json", method: "GET", headers: {"X-Requested-With": null}});
        }

    });

});


