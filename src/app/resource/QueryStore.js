define([ "dojo/_base/array", "dojo/_base/lang", "dojo/_base/declare", "dojo/store/JsonRest"//
		], function(array, lang, declare, JsonRest
		) {

	return declare( [ JsonRest ], {

		query : function(query,options) {
			var queryString={query: JSON.stringify(query)};
			return this.inherited(arguments, [queryString, options]);
		}
	});

});
