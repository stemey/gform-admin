define(
    [
        "dojo/_base/declare",
        "dojo/router/RouterBase"


    ],
    function (declare, RouterBase) {

        return declare("app.ServiceRouter", [ RouterBase ],
            {
                goToService: function (service, resource) {
                    this.go(service + "/" + resource);
                }

            });

    });
