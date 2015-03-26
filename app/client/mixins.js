// Generated by CoffeeScript 1.4.0
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.QueryMixin = {
    componentWillMount: function() {
      if (this.props.query) {
        return this.queryFacts(this.props.query);
      }
    },
    componentWillReceiveProps: function(props) {
      if (props.query) {
        return this.queryFacts(props.query);
      }
    },
    queryFacts: function(query) {
      var result, v;
      result = Facts.find(this.getQuery(query));
      v = {};
      v[this.props.pane] = result.count();
      this.publish('counts', v);
      return this.setState({
        facts: result
      });
    }
  };

  window.globalState = {};

  window.ObserveGlobalState = {
    componentDidMount: function() {
      var _this = this;
      if (!this.globals) {
        console.log("no @globals", this.getDOMNode());
        return;
      }
      this.observer = new ObjectObserver(window.globalState);
      this.observer.open(function(added, removed, changed, oldVal) {
        var news, propname, _i, _len, _ref;
        console.log(added, removed, changed);
        news = {};
        _ref = _this.globals;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          propname = _ref[_i];
          if (propname in added) {
            ns[propname] = added[propname];
          }
          if (propname in changed) {
            ns[propname] = changed[propname];
          }
          if (propname in removed) {
            ns[propname] = null;
          }
        }
        if (news !== {}) {
          return _this.setState(news);
        }
      });
      return console.log("observe..", this.observer, this.getDOMNode());
    },
    componentWillUnmount: function() {
      if (this.globals == null) {
        return;
      }
      console.log("un-observe..", this.getDOMNode());
      return this.observer.close();
    },
    updateGlobal: function(prop, modificator) {
      return window.globalState[prop] = modificator(window.globalState[prop]);
    }
  };

  window.SyncState = {
    doSyncState: function(prop, state) {
      var ns;
      console.log("eve ", prop, state);
      if (__indexOf.call(this.globals, prop) >= 0) {
        ns = {};
        ns[prop] = state;
        console.log("Set state ", ns);
        this.setState(ns);
        console.log("and is set to ", this.state);
      }
      return false;
    },
    componentDidMount: function() {
      var _this = this;
      if (this.globals) {
        return this.globals.map(function(g) {
          console.log("syncstate." + g);
          return $(document).on("syncstate." + g, function(ev, state) {
            return _this.doSyncState(g, state);
          });
        });
      }
    },
    componentWillUnmount: function() {
      var _this = this;
      if (this.globals) {
        return this.globals.map(function(g) {
          return $(document).off("syncstate." + g, function(ev, state) {
            return _this.doSyncState(g, state);
          });
        });
      }
    },
    publish: function(prop, obj) {
      console.log("publish ", prop, obj);
      return $(document).trigger("syncstate." + prop, obj);
    }
  };

}).call(this);
