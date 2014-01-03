define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/dom-class",
	"dojo/when",
	"dojo/aspect",
	"gform/Editor",	
	"gform/createLayoutEditorFactory",	
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./editor.html",
	"dojo/store/JsonRest",
	"gform/Context",
	"gform/opener/SingleEditorDialogOpener",
	"./urlToIdConverter",
	"dijit/form/Button",
	"dijit/layout/StackContainer",
	"dijit/layout/ContentPane",
	"dijit/ProgressBar",
	"dijit/Dialog"
], function(declare, lang, array, domClass, when, aspect, Editor, createEditorFactory, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, Store,Context, SingleEditorDialogOpener, urlToIdConverter){


	
return declare("gform.tests.gridx.EditorController", [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		baseClass : "gformEditorController",
		templateString : template,
		store: null,
		state:"create",
		postCreate: function() {
			var editorFactory=createEditorFactory();
			editorFactory.addConverterForType(urlToIdConverter, "ref");
			this.editor.set("editorFactory",editorFactory);
			var ctx = new Context();
			var opener = new SingleEditorDialogOpener();
			opener.storeRegistry = ctx.storeRegistry; 
			opener.placeAt(this.opener);
			opener.ctx=ctx;
			ctx.opener = opener;
			opener.startup();
			this.editor.set("ctx",ctx);
			this.editor.setMetaAndPlainValue({attributes:[]}, {});
			
			var dialog=this.dialog;
			this.dialogYesButton.on("click",function() {
				dialog.hide();
				if (dialog.yesCallback) {
					dialog.yesCallback();
				}
			});
			this.dialogNoButton.on("click",function() {dialog.hide();});
		},
		loadData : function(resource, storeRegistry, schemaRegistry) {	
			this.editor.ctx.storeRegistry=storeRegistry;
			this.editor.ctx.schemaRegistry=schemaRegistry;
			window.globalStoreRegistry=storeRegistry;
			this.resource=resource;
			this.editor.setMetaAndPlainValue(resource.resourceType, {});
			this.store= new Store({target: resource.uriPath, idProperty: resource.idProperty});
			this.watch("state",lang.hitch(this,"_onStateChange"));
			this.editor.on("value-changed",lang.hitch(this,"_onStateChange"));
		},
		_onStateChange: function(e) {
			this.discardButton.set("disabled",this.state=="working" || !this.editor.hasChanged());
			this.deleteButton.set("disabled",this.state=="working" || this.state=="create");
			this.saveButton.set("disabled",this.state=="working" || (this.state=="edit" && !this.editor.hasChanged()));
			array.forEach(["create","edit","working"], function(e) {
				domClass.toggle(this.domNode,e,this.state==e);
			},this);
		},
		_checkState: function(callback) {
			if (this.state=="create" && this.editor.hasChanged()) {
				this._startDialog("do you want to disacrd the new entity",callback);
			} else if (this.state=="edit" && this.editor.hasChanged()) {
				this._startDialog("do you want to disacrd the changes",callback);
			}else{
				callback(); 
			}
		},
		edit: function(id) {
			this._checkState(lang.hitch(this,"_edit", id));
		},
		discard: function() {
			this.editor.reset();			
		},
		_showProgressBar: function() {
			this.set("state","working");	
		},
		_edit: function(id) {
			var promise = this.store.get(id);
			this._execute(promise,"LoadForEdit");
		},
		_onLoadForEdit: function(entity) {
			this.set("state","edit");
			this.editor.set("plainValue", entity);
		},
		_onLoadForEditFailed: function(error) {
			this.set("state","edit");
			alert("error while loading entity:\n"+error.response.text);
		},
		_execute: function(promise, command) {
			this._showProgressBar();
			when(promise,lang.hitch(this,"_on"+command),lang.hitch(this,"_on"+command+"Failed"));
		},
		createNew: function() {
			if (this.state=="create") {
				this.editor.reset();
			}	else {
				this._checkState(lang.hitch(this,"_createNew"));
			}
		},
		_createNew: function() {
			this.set("state","create");
			this.editor.set("plainValue", {});
		},
		save: function() {
			var entity = this.editor.get("plainValue");
			if (this.state=="create") {
				delete entity[this.resource.idProperty];
				var promise = this.store.add(entity);
				this._execute(promise,"Add");
			}else{
				var promise = this.store.put(entity);
				this._execute(promise,"Update");
			}
		},
		_onAdd: function(result) {
			this._removeChangeIndicator();
			this.set("state","edit");
			this._edit(result);
		},
		_removeChangeIndicator: function() {
			var entity = this.editor.get("plainValue");
			this.editor.set("plainValue",entity);
		},
		_onAddFailed: function(error) {
			this.set("state","create");
			alert("error while saving entity:\n"+error.response.text);
		},
		_onUpdate: function(result) {
			this._removeChangeIndicator();
			this.set("state","edit");
			this._edit(this.editor.get("plainValue")[this.resource.idProperty]);
		},
		_onUpdateFailed: function(error) {
			this.set("state","edit");
			array.forEach(error.fields, function(error) {
				this.editor.addError(error.path, error.message);
			},this);
			alert("error while updating entity:\n"+ error.response.text);
		},
		startup: function() {
			this.inherited(arguments);
			this._onStateChange();
		},
		_startDialog: function(message,callback) {
			this.dialogMessage.innerHTML=message;
			this.dialog.yesCallback=callback;
			this.dialog.show();
		},
		remove: function() {
			if (this.state!="create") {
				var entity = this.editor.get("plainValue");
				this._removeChangeIndicator();
				this.store.remove(entity.id).then(lang.hitch(this,"_onRemoved"));
			}
		},
		_onRemoved: function() {
			this.set("state","edit");
		},
		_onRemoveFailed: function(error) {
			this.set("state","edit");
			alert("error while removing entity:\n"+ error.response.text);
		}
	});


});
