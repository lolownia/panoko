// Generated by CoffeeScript 1.4.0
(function() {

  if (typeof Panoko === "undefined" || Panoko === null) {
    window.Panoko = {};
  }

  Panoko.PaneView = {
    raw_html: function(html) {
      return {
        __html: html
      };
    },
    thead: function(headers) {
      var clock, ip;
      clock = DOM.th({
        key: 'time'
      }, DOM.i({
        "class": 'fa fa-clock-o'
      }, []));
      ip = DOM.th({
        key: 'ip'
      }, DOM.i({
        "class": 'fa fa-sitemap'
      }, []));
      return DOM.thead({
        key: 'thead'
      }, DOM.tr([clock, ip].concat(_.map(headers, function(fn) {
        return DOM.th({
          key: fn
        }, fn);
      }))));
    }
  };

  Panoko.IPField = React.createFactory(React.createClass({
    ip_ending: function() {
      return this.props.fact.client.split('.').splice(-1);
    },
    render: function() {
      return DOM.td({
        key: 'id',
        "class": 'table-ip',
        title: "" + this.props.fact.client
      }, "..." + (this.ip_ending()));
    }
  }));

  Panoko.TimeField = React.createFactory(React.createClass({
    timeString: function(milliseconds) {
      var d;
      d = new Date(milliseconds * 1000);
      return s.sprintf("%02d:%02d:%02d", d.getHours(), d.getMinutes(), d.getSeconds());
    },
    render: function() {
      return DOM.td({
        key: 'clock',
        "class": 'table-time'
      }, this.timeString(this.props.fact.timestamp_start));
    }
  }));

  Panoko.FacebookUsers = React.createFactory(React.createClass({
    render: function() {
      return DOM.td({
        key: 'user',
        "class": 'table-user'
      }, (_.map(this.props.fbids, function(fbid) {
        return DOM.a({
          href: "https://facebook.com/" + fbid,
          target: '_blank'
        }, DOM.i({
          "class": 'fa fa-user'
        }, ''));
      })).concat([DOM.span(this.props.names || '(no data)')]));
    }
  }));

}).call(this);
