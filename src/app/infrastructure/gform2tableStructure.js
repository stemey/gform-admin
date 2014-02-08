define([
    "../../dojo/_base/array"
], function (array) {


    var extractFromAttributes = function (attributes) {
        var columns = [];
        array.forEach(attributes, function (attribute) {
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

    var extractFromGroups = function (groups) {
        var columns = [];
        array.forEach(groups, function (group) {
            var moreColumns = extractFromGroup(group);
            moreColumns.forEach(function (c) {
                columns.push(c);
            })
        })
        return columns;
    }

    var extractFromGroup = function (gformSchema) {
        var columns = [];
        if (gformSchema.groups) {
            columns = extractFromGroups(gformSchema.groups);
        } else if (gformSchema.group) {
            columns = extractFromGroup(gformSchema.group);
        } else if (gformSchema.attributes) {
            columns = extractFromAttributes(gformSchema.attributes);
        }
        return columns;
    }

    return extractFromGroup;


});
