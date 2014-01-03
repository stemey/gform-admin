define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/aspect",
	"./gform2tableStructure",
	"gridx/Grid",
	'gridx/core/model/cache/Async',
	"gridx/modules/VirtualVScroller",
	"gridx/modules/ColumnResizer",
	"gridx/modules/SingleSort",
	"gridx/modules/Filter",
	'gridx/modules/filter/FilterBar',
	'gridx/core/model/extensions/Query',
	'gridx/modules/Focus',
	'gridx/modules/RowHeader',
	'gridx/modules/select/Row',
	"./QueryStore",
	"dojo/json",
	"./EditorController",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"gform/layout/_InvisibleMixin",
	"dojo/text!./grid.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dijit/Toolbar"
], function(declare, lang, aspect, gform2TableStructure, Grid, Cache, 
	VirtualVScroller, ColumnResizer, SingleSort, Filter, FilterBar, Query, Focus, RowHeader, RowSelect, 
	 Store, json, EditorController, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _InvisibleMixin, template){


	
return declare( [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,_InvisibleMixin], {
		baseClass : "gformGridController",
		templateString : template,
		postCreate : function() {	
		},
		loadData: function(resource, storeRegistry, schemaRegistry) {
			if (this.grid) {
				this.grid.destroy();
			}
			var structure = gform2TableStructure(resource.tableStructure);
			var props={ id: "grid", width: "100%", height: "100%"};
			props.cacheClass=Cache;
			props.structure = structure;
			this.store = new Store({
				target: resource.collectionUriPath, 
				idProperty: resource.idProperty,
				sortParam: "sortBy"
			});
			props.store = this.store;
			props.modules= [
				VirtualVScroller,
				{
					moduleClass: Filter,
					serverMode: true,
				},
				FilterBar,
				{
					moduleClass: RowSelect,
					multiple: false,
					triggerOnCell: true,
				},
				RowHeader,
				SingleSort
			];
			this.grid = new Grid(props);
			
			this.grid.select.row.connect(this.grid.select.row, "onSelected",lang.hitch(this,"rowSelected"));
			this.gridContainer.addChild(this.grid);
			this.grid.startup();
			//this.borderContainer.layout();
			this.editorController.loadData(resource, storeRegistry, schemaRegistry);
			aspect.before(this.store,"remove",lang.hitch(this,"_onDelete"));
			aspect.after(this.editorController,"_onUpdate",lang.hitch(this,"reload"));
			aspect.after(this.editorController,"_onAdd",lang.hitch(this,"reload"));
			aspect.after(this.editorController,"_onRemoved",lang.hitch(this,"reload"));
			//this.borderContainer.resize({w:500,h:500});
			this.borderContainer.resize();
		},
		reload:function() {
			this.grid.model.clearCache();
			this.grid.view.load();
		},
		startup: function() {
			this.inherited(arguments);
		},
		rowSelected: function(e) {
			this.editorController.edit(e.id);
		},
		createNew: function() {
			this.editorController.createNew();
		},
		previous: function() {
			this._moveSelection(-1);
		},
		next: function() {
			this._moveSelection(1);
		},
		_onDelete: function() {
			this._moveSelection(1);
		},
		_moveSelection: function(delta) {
			var selectedId = this.grid.select.row.getSelected();
			if (selectedId) {
				var index = this.grid.model.idToIndex(selectedId);
				if (index<0) {
					return;
				}
				var nextId = this.grid.model.indexToId(index+delta);
				if (typeof nextId == "undefined") {
					return;
				}else{
					this.grid.select.row.deselectById(selectedId);
					this.grid.select.row.selectById(nextId);
				}
			}
		}	
	});


});
