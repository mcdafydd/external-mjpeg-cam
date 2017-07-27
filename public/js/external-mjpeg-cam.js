(function(window) 
{
    'use strict';
    class ExternalMjpegCam 
    {
        constructor( cockpit )
        {
            console.log('External MJPEG Camera Plugin running');

            var self = this;
            this.cockpit = cockpit;
            this.rov = cockpit.rov;

            this.settings = null;     // These get sent by the local model
   
            // for plugin management:
            this.Plugin_Meta =
            {
                name: 'external-mjpeg-cam',
                viewName: 'External MJPEG Camera plugin',
                defaultEnabled: true
            };

            //Set up actions associated with this plugin
            this.actions = 
            {
                "plugin.external-mjpeg-cam.sayHello":
                {
                    description: "Say Hello!",
                    controls:
                    {
                        button:
                        {
                            down: function() {
                                cockpit.emit('plugin.external-mjpeg-cam.sayHello');
                            }
                        }
                    }
                }
            };

            // Setup input handlers
            this.inputDefaults =
            {
                keyboard:
                {
                    "alt+0": { type: "button",
                               action: "plugin.external-mjpeg-cam.sayHello"}
                }
            };
        };

        sayHello()
        {
          // Send the sayHello command to the node plugin
          this.cockpit.rov.emit( 'plugin.external-mjpeg-cam.sayHello' );
        }

        getTelemetryDefinitions()
        {
            return [{
                name: 'external-mjpeg-cam.message',
                description: 'The message sent from the External MJPEG Camera module in the MCU'
            }]
        };

        // This pattern will hook events in the cockpit and pull them all back
        // so that the reference to this instance is available for further processing
        listen() 
        {
            var self = this;

            // Listen for settings from the node plugin
            this.cockpit.rov.withHistory.on('plugin.external-mjpeg-cam.settingsChange', function(settings)
            {
                // Copy settings
                self.settings = settings;

                // Re-emit on cockpit
                self.cockpit.emit( 'plugin.external-mjpeg-cam.settingsChange', settings );
            });

            // Listen for response messages from the Node plugin
            this.cockpit.rov.withHistory.on('plugin.external-mjpeg-cam.message', function( message )
            {
                // Log the message!
                console.log( "External MJPEG Camera Plugin says: " + message );

                // Rebroadcast for other plugins and widgets in the browser
                self.cockpit.emit( 'plugin.external-mjpeg-cam.message', message );
            });

            // Listen for sayHello requests from other plugins and widgets
            this.cockpit.on('plugin.external-mjpeg-cam.sayHello', function()
            {
                self.sayHello();
            });
        };
    };

    // Add plugin to the window object and add it to the plugins list
    var plugins = namespace('plugins');
    plugins.ExternalMjpegCam = ExternalMjpegCam;
    window.Cockpit.plugins.push( plugins.ExternalMjpegCam );

}(window));
