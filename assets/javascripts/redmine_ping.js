function WindowController () {
    this.id = Math.random();
    this.isMaster = false;
    this.others = {};

    window.addEventListener( 'storage', this, false );
    window.addEventListener( 'unload', this, false );

    this.broadcast( 'hello' );

    var that = this;
    var check = function check () {
        that.check();
        that._checkTimeout = setTimeout( check, 9000 );
    };
    var ping = function ping () {
        that.sendPing();
        that._pingTimeout = setTimeout( ping, 17000 );
    };
    this._checkTimeout = setTimeout( check, 500 );
    this._pingTimeout = setTimeout( ping, 17000 );
}

WindowController.prototype.destroy = function () {
    clearTimeout( this._pingTimeout );
    clearTimeout( this._checkTimeout );

    window.removeEventListener( 'storage', this, false );
    window.removeEventListener( 'unload', this, false );

    this.broadcast( 'bye' );
};

WindowController.prototype.handleEvent = function ( event ) {
    if ( event.type === 'unload' ) {
        this.destroy();
    } else if ( event.key === 'broadcast' ) {
        try {
            var data = JSON.parse( event.newValue );
            if ( data.id !== this.id ) {
                this[ data.type ]( data );
            }
        } catch ( error ) {}
    }
};

WindowController.prototype.sendPing = function () {
    this.broadcast( 'ping' );
};

WindowController.prototype.hello = function ( event ) {
    this.ping( event );
    if ( event.id < this.id ) {
        this.check();
    } else {
        this.sendPing();
    }
};

WindowController.prototype.ping = function ( event ) {
    this.others[ event.id ] = +new Date();
};

WindowController.prototype.bye = function ( event ) {
    delete this.others[ event.id ];
    this.check();
};

WindowController.prototype.check = function ( event ) {
    var now = +new Date(),
        takeMaster = true,
        id;
    for ( id in this.others ) {
        if ( this.others[ id ] + 23000 < now ) {
            delete this.others[ id ];
        } else if ( id < this.id ) {
            takeMaster = false;
        }
    }
    if ( this.isMaster !== takeMaster ) {
        this.isMaster = takeMaster;
        this.masterDidChange();
    }
};

WindowController.prototype.masterDidChange = function () {};

WindowController.prototype.broadcast = function ( type, data ) {
    var event = {
        id: this.id,
        type: type
    };
    for ( var x in data ) {
        event[x] = data[x];
    }
    try {
        localStorage.setItem( 'broadcast', JSON.stringify( event ) );
    } catch ( error ) {}
};




var RedminePing;

RedminePing = (function() {
    
    function RedminePing() {

        var self = this;

        this.currentIssues = 0;
        this.refreshEnabled = true;
        this.refreshRate = 1000;

        this.firstUse = true;

        this.wc = new WindowController();

        this.wc.masterDidChange = function () {
            if (this.isMaster) {
                self.refreshEnabled = true;
            } else {
                self.refreshEnabled = false;
            }
        };
        this.wc.masterDidChange();


        this.favicon = new Favico({
            animation:  'none',
            bgColor :   '#CE3D28',
            textColor : '#fff',
            type :      'rectangle'
        });

        if (localStorage.currentIssues) {
            this.setIssues(parseInt(localStorage.currentIssues));
        }



        var self = this;
        setInterval(function() {
            if (self.refreshEnabled) {
                self.refresh();
            } else {
                self.setIssues(parseInt(localStorage.currentIssues));
            }
        }, this.refreshRate);

    }

    RedminePing.prototype.refresh = function() {
        var self = this;

        $.ajax({
	  		url: "/notify",
	  		dataType: "json",
	  		global: false
		}).done(function(data) {
        	self.setIssues(data.issues);
        });

    }

    RedminePing.prototype.setIssues = function(issuesCount) {

        if (issuesCount != this.currentIssues) {
            this.currentIssues = issuesCount;

            localStorage.currentIssues = this.currentIssues;

            if (this.firstUse) {
                this.favicon.badge(this.currentIssues);
            } else {
                this.favicon.badge(this.currentIssues, { animation:  'slide' });
            }
        }
    }

  return RedminePing;

})();

$(document).ready(function() {
    
    redmine_ping = new RedminePing();

});