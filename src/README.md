#admin-gform

admin-gform is a generic client application to administrate data and invoke services.

### Data administration

admin-gform generates master detail views to browse, create, update and delete entities via restful services.
The ui consists of a table for browsing resource documents and a form to edit a single resource. Both table and
form are created according to the resource's schema. This schema must be supplied in either json schema or gform schema format.


### Service invokation

admin-gform is a complete [swagger](www.wordnik.com/swagger) client. It actually exceeds the default swagger ui's features by providing a complete form for
posting and putting new or changed resources.

## Gform-Rest-Api

The schemata to create the generic front end is provided through rest services. It wirks similar to the swagger api, The Api consists of two calls:

### 1. Listing of available resources

The main service call returns all resources. A resource consists of a name and urls to the schema, the resource and optionally the collection.
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


## Examples

### Mongoose

A complete implementation of the gform rest api for [mongoose](www.github.com/Learnboost/mongoose) is available  [here](www.github.com/stemey/baucis-gform)


