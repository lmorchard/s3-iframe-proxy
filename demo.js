//
// demo.js: Code to exercise and demo the S3 iframe proxy
//
var Demo = (function () {
    return {
        KEY_ID: 'AKIAJHXCFSDAKSBJPG4A',
        SECRET_KEY: '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',
        BUCKET: 'random-crap.lmorchard.com',
        CONTENT_TMPL: "<html><body><h1>Content from client</h1>" + 
                      "<p>Last modified at: {{DATE}}</p></body></html>",
        
        init: function () {
            var $this = this;
            S3_API.onReady(function () { $this.ready(); });
            console.log("DEMO INIT");
            return this;
        },

        ready: function () {
            var $this = this;
            console.log("DEMO READY");

            S3_API.configure({
                key_id: $this.KEY_ID,
                secret_key: $this.SECRET_KEY,
                bucket: $this.BUCKET
            }, function (result) {
                $this.writeTheContent();
            });
        },

        writeTheContent: function () {
            var content = this.CONTENT_TMPL.replace('{{DATE}}', ''+(new Date()));
            S3_API.put(
                'index.html',
                content, 
                { content_type: 'text/html; charset=UTF-8' },
                function () {
                    console.log("DEMO WRITE HAPPENED", arguments);
                },
                function () {
                    console.log("DEMO WRITE ERROR!", arguments);
                }
            );
        },

        EOF:null
    };
})().init();
