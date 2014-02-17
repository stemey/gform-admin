var profile = {

    action: "release",
    optimize: "closure",
    layerOptimize: "closure",
    cssOptimize: "comments",
    mini: true,

    layers: {
        "dojo/dojo": {
            include: [ "dojo/i18n", "dojo/main" ],
            customBase: true,
            boot: true
        },
        "app/app": {
            include: [ "app/ServiceController" ]
        }
    }
};