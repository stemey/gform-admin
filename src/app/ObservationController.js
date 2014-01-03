define([ "dojo/_base/array", "dojo/_base/lang", "dojo/_base/declare", "dojo/Stateful",
		"app/service/MetaService", "app/service/RestService", 'dojo/data/ItemFileReadStore',
    'gform/createStandardEditorFactory',//
		"dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
		"dojo/text!./observation.html","app/service/ObservationService",//
		"gform/layout/_InvisibleMixin"
], function(array, lang, declare, Stateful,
		metaService, restService, ItemFileReadStore, createStandardEditorFactory,//
		_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,observationService, _InvisibleMixin
		) {
	/**
	 * select service select id fromselctor (prefilled by getEntities)
	 * 
	 * 
	 * entity id : detail view: -> create detail
	 * 
	 * 
	 * 
	 */
	declare("app.ObservationController", [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
		_relTargetProp : "target",
		templateString : template,
		meta : null,
		model : new Stateful({}),
		startup : function() {
//			this.target = new Stateful({
//				editorFactory : new EditorFactory(),
//				modelHandle:new Stateful({}),
//				meta:new Stateful({})
//			});
		},
		loadData : function(singleton) {
			this.singleton = singleton;
			// this.editor.set("modelHandle", this.model);
			restService.loadSingleton({
				singleton : this.singleton,
				callback : lang.hitch(this, "onLoaded")
			});

		},
		onLoaded : function(entity) {
			this.editor.set("editorFactory", createStandardEditorFactory());
			this.editor.setMetaAndPlainValue(this.singleton.resourceType, entity);
			this.editor.startup();
			observationService.observe(this.singleton.topic,lang.hitch(this,"onMessage"));
		},
		onMessage: function(e) {
			console.log(e);
			this.editor.updateValue(e.data.path,e.data.newValue);
		},
		update : function() {
			var entity = this.editor.get("plainValue");
			restService.updateSingleton({
				singleton : this.singleton,
				entity : entity,
				callback: function(e){console.log("updated")}
			});
		}
	});

	return app.ObservationController;
});
