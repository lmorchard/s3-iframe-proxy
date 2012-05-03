//
// proxy.js: Code meant to live within an iframe on an s3.amazonaws.com origin
//
var S3_Proxy = (function () {
    return {

        // ## init()
        // Initialize the proxy
        init: function () {
            var $this = this;

            // Establish the comm channel
            var chan = this.chan = Channel.build({
                debugOutput: true,
                window: window.parent,
                origin: '*',
                scope: 's3-iframe-proxy'
            });

            var cmds = ['loaded', 'configure', 'put'];
            cmds.forEach(function (name, idx) {
                chan.bind(name, function () {
                    $this['handle_'+name].apply($this, arguments);
                });
            });

            console.log("PROXY INIT");
            return this;
        },

        handle_loaded: function (trans, options) {
            console.log("NEW PROXY RECEIVED LOADED I LIKE IT");
        },

        handle_configure: function (trans, options) {
            this.s3 = new S3Ajax({
                key_id: options.key_id,
                secret_key: options.secret_key
            });
            this.bucket = options.bucket;
        },

        handle_put: function (trans, args) {
            var $this = this;
            var key = args.shift(),
                content = args.shift(),
                params = args.shift() || {};

            this.s3.put(this.bucket, key, content, params,
                function (req, obj) {
                    trans.complete("SUCCESS");
                },
                function (req, obj) {
                    trans.error("CRAP");
                }
            );
            trans.delayReturn(true);
        },

        EOF:null
    };
})().init();
