#admin-gform

admin-gform is a generic client application to administrate data and invoke services.

## Data administration

admin-gform generates master detail views to browse, create, update and delete entities via restful services.
The ui usually consists of a table for browsing resource documents and a form to edit a single resource. Both table and
form are created according to the resource's schema. This is schema must be supplied in either json schema or gform schema format.
A converter for Mongoose schema to both can be found here.


## Service invokation

admin-gform is a complete swagger client. It actually exceeds the default swagger ui's features by providing a complete form for
posting and putting new or changed resources.

## Gform-Rest-Api

To create a data administration the gform rest api needs to provide the necesary meta information. This Api consists of two calls:

1. Listing of available resources

The main service call returns all resources. A resource consists of a name and urls to the schema, the resource and optionally the collection.
These urls must be absolute or relativ to the provided basePath or the url of the listing itself.


    {
      "version": "0.0.1",
      "resources": [
        {
          "name": "vegetable"
          "schemaUrl": "./gform/vegetables",
          "resourceUrl": "./vegetables/",
          "collectionUrl": "./vegetables/",
        }
      ],
      "basePath": "http://localhost:3333/api/"
    }

2. The schemata

All referenced schema may reference external schemas relative to the basePath as well.