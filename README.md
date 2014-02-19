#admin-gform

admin-gform is a generic client application to administrate data and invoke services.

### Data administration

admin-gform generates master detail views to browse, create, update and delete entities via restful services.
The ui consists of a table for browsing resource documents and a form to edit a single resource. Both table and
form are created according to the resource's schema. This schema must be supplied in either json schema or gform schema format.


### Service invokation

admin-gform is a [swagger](http://swagger.wordnik.com) client. It actually exceeds the default swagger ui's features by providing a complete form for
posting and putting new or changed resources.

Limitations:

* does not support file upload


## Installation

to install and run the build app use:

    git clone https://github.com/stemey/gform-admin
    bower install
    grunt build
    grunt server dist
    open browser at localhost:3333

to run the dev app use:

    grunt server
    open browser at localhost:3333


## Configuration

The configuration contains the default swagger and gform services to connect to. It is a json file located at /src/app/services.json:


    {
        "services": [
            {
                "type": "app/service/BaucisCrudService",
                "name": "blog (crud)",
                "url": "http://localhost:3333/api/gform"

            },
            {
                "type": "app/service/SwaggerMetaService",
                "name": "swagger example",
                "url": "http://localhost/source/gform-admin-new/src/app/wordnik/api"

            }
     ]
    }


A service has a name displayed in the menu, a url of the service's api and a type. The type defines how to interpret the api - as swagger or gform api.

## Gform-Rest-Api

The schemata to create the generic front end is provided through rest services. It works similar to the swagger api, The Api consists of two calls:

### 1. Listing of available resources

The main service call returns general meta data of all resources. A resource meta data consists of a name and urls to the schema, the resource and optionally the collection.
These urls must be absolute or relative to the provided basePath or the url of the listing itself.


    {
      "basePath": "http://localhost:3333/api/",
      "resources": [
        {
          "name": "vegetable"
          "schemaUrl": "./gform/vegetables",
          "resourceUrl": "./vegetables/",
          "collectionUrl": "./vegetables/",
        }
      ]
    }

### 2. The schemata

All referenced schema may reference external schemas relative to the basePath as well.


## Libraries and examples

### Mongoose

A complete implementation of the gform rest api for [mongoose](http://www.github.com/Learnboost/mongoose) is available  [here](http://www.github.com/stemey/baucis-gform). An example application
is available [here](http://www.github.com/stemey/mongoose-administration-example)



