define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
], function(declare, lang, array){


	
	return function(gformSchema) {
		var columns= array.map(gformSchema.attributes, function(attribute) {
			return {
				id : attribute.code,
				field : attribute.code,
				name : attribute.label || attribute.code,
				dataType:attribute.type
			}
		})
		return columns;
	}


});
