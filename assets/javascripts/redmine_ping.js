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