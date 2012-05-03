//
// api.js: Client API for using s3-iframe-proxy
//
var S3_API = (function () {
    return {

        PROXY_URL: 'http://s3.amazonaws.com/s3-iframe-proxy/proxy.html',

        // ## init()
        // Initialize the API
        init: function () {
            var $this = this;

            this._ready_cbs = [];

            // Inject the hidden iframe for proxy communication
            var doc = window.document;
            var new_if = document.createElement('iframe');
            new_if.style.display = 'none';
            new_if.src = this.PROXY_URL + '?__=' + ((new Date()).getTime());
            doc.body.appendChild(new_if);

            // Establish the comm channel
            var chan = this.chan = Channel.build({
                debugOutput: true,
                window: new_if.contentWindow,
                origin: this.PROXY_URL,
                scope: 's3-iframe-proxy',
                onReady: function () {
                    chan.call({
                        method: 'loaded',
                        success: function () {
                            console.log("CHAN ONREADY SUCCESS");
                            $this._ready_cbs.forEach(function (cb) {
                                cb($this);
                            });
                        },
                        error: function () {
                            console.log("CHAN ONREADY ERROR");
                        }
                    });
                }
            });

            console.log("API INIT");
            return this;
        },

        onReady: function (cb) {
            this._ready_cbs.push(cb);
        },

        configure: function (options, success, error) {
            this.chan.call({
                method: 'configure', params: options,
                success: success, error: error
            });
        },

        put: function (key, content, params, success, error) {
            this.chan.call({
                method: 'put',
                params: [key, content, params],
                success: success,
                error: error
            });
        },

        EOF:null
    };
})().init();
