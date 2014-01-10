define([
    'dojo/_base/lang',
    "dojo/_base/declare", "dojo/store/JsonRest"//
], function (lang, declare) {

    return declare([  ], {
        transform: function (gquery) {
            if (gquery.op === "or") {
                var conditions = this.conditions(gquery.data);
                return {"$or": conditions}
            } else if (gquery.op === "and") {

                var conditions = this.conditions(gquery.data);
                var and = {};
                conditions.forEach(function (condition) {

                    lang.mixin(and, condition);
                });
                return and;
            } else {
                return null
            }
        },
        conditions: function (data) {
            return data.map(function (d) {
                return this.condition(d);
            }, this);
        },
        condition: function (gcondition) {
            var op = "transform" + gcondition.op.substring(0, 1).toUpperCase() + gcondition.op.substring(1, gcondition.op.length);
            if (this[op]) {
                return this[op](gcondition.data)
            } else {
                throw new Error("operation " + op + " is not supported.");
            }
        },
        transformEqual: function (operands) {
            var mcondition = {};
            mcondition[operands[0].data] = operands[1].data;
            return mcondition;
        }
    });
});