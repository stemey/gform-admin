define([ "dojo/_base/array", "dojo/_base/lang", "dojo/_base/declare", "dojo/store/JsonRest"//
		], function(array, lang, declare, JsonRest
		) {

	return declare( [  ], {
		meta:null,
		id2store:{},
		constructor: function(meta) {
			this.meta=meta;
		},
		get : function(id, props) {
			var nameSearch = id.match(/name:(.*)/);
			if(nameSearch) {
				id = nameSearch[1];
			}
			var jsonSearch = id.match(/json:(.*)/);
			if(jsonSearch) {
				id = jsonSearch[1];
			}
			var store = this.id2store[id];
			if (!store) {
				var service=this.meta.services[id];
				if (service==null) {
					throw new Error("cannot find service with id "+id);
				}
				var idProperty= nameSearch?"id":service.idProperty
				store = new JsonRest( {target:service.uriPath, idProperty:idProperty});
				this.id2store[id]=store;
			}
			return store;
		}
	});

});
