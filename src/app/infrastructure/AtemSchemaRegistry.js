define([ "../../dojo/_base/array", "dojo/_base/lang", "dojo/_base/declare", "dojo/store/JsonRest"//
		], function(array, lang, declare, JsonRest
		) {

	return declare( [  ], {
		meta:null,
		id2schema:{},
		constructor: function(meta) {
			this.meta=meta;
		},
		get : function(id) {
			var schema = this.id2schema[id];
			if (!schema) {
				var service=this.meta.services[id];
				if (service==null) {
					var jsonSearch = id.match(/json:(.*)/);
					if(jsonSearch) {
						id = jsonSearch[1];
						var service=this.meta.services[id];
					}
					if (service==null) {
						throw new Error("cannot find schema for "+id);
					}
				}
				schema = service.resourceType;
				this.id2schema[id]=schema;
			}
			return schema;
		}
	});

});
