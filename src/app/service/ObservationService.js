define([ "dojo/_base/lang", "dojo/_base/declare", "dojo/_base/array",
		"dojox/cometd", 'dojo/io-query',"dojo/cookie",'./MetaService','dojo/_base/json' 
		],
		function(lang, declare, array, cometd, ioquery,cookie,metaService) {

			declare("service.ObservationService", null, {
				constructor: function() {
					cometd.init(new String(document.location).replace(/\/app\/.*$/, '') + "/cometd");
				},
				observe: function(topic,listener) {
					var sessionId=metaService.getSessionId();
					var sessionTopic=lang.replace(topic,{sessionId:sessionId});
					cometd.subscribe(sessionTopic, listener);
				}
			});

			restService = new service.ObservationService();
			return restService;

		});
