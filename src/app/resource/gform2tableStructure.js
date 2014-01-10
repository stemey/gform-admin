define([
    "dojo/_base/array"
], function (array) {


    return function (gformSchema) {
        var columns = [];
        array.forEach(gformSchema.attributes, function (attribute) {
            if (!attribute.groups && !attribute.elements && !attribute.group && !attribute.element) {
                var column = {
                    id: attribute.code,
                    field: attribute.code,
                    name: attribute.label || attribute.code,
                    dataType: attribute.type,
                    // do't seem to work3
                    //disabledConditions: ["contains", "notcontains"],
                    autoComplete: false
                }
                columns.push(column);
            }
        })
        return columns;
    }


});
