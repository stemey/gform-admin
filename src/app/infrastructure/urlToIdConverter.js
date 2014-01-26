define([ "../../dojo/_base/array", //
"dojo/_base/lang",//
"dojo/_base/declare",//
"gform/util/restHelper"
], function(array, lang, declare, restHelper) {
// module:
//		gform/converter/urlToIdConverter


		return  declare([], {
			attribute: null,
			constructor: function(attribute) {
				this.attribute=attribute;
			},
			format : function(value) {
				if (value == null) {
					return "";
				} else {
					return restHelper.decompose(value.$ref).id;
				}
			},
			parse : function(value) {
				if (value=="" || value==null) {
					return null;
				} else {
					var realUrl = globalStoreRegistry.get(this.attribute.url).target;
					realUrl=realUrl.substring(0,realUrl.length-1);
					return {$ref:restHelper.compose(realUrl,value)};
				}
			}
		});
	


});
