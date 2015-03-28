// Generated by CoffeeScript 1.4.0
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  if (typeof Panoko === "undefined" || Panoko === null) {
    window.Panoko = {};
  }

  Panoko.QueryMixin = {
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

  Panoko.ObserveGlobalState = {
    componentDidMount: function() {
      var _this = this;
      if (!this.globals) {
        return;
      }
      this.observer = new ObjectObserver(window.globalState);
      return this.observer.open(function(added, removed, changed, oldVal) {
        var news, propname, _i, _len, _ref;
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
    },
    componentWillUnmount: function() {
      if (this.globals == null) {
        return;
      }
      return this.observer.close();
    },
    updateGlobal: function(prop, modificator) {
      return window.globalState[prop] = modificator(window.globalState[prop]);
    }
  };

  Panoko.SyncState = {
    doSyncState: function(prop, state) {
      var ns;
      if (__indexOf.call(this.globals, prop) >= 0) {
        ns = {};
        if ((this.mergers != null) && prop in this.mergers) {
          ns[prop] = this.mergers[prop](this.state[prop], state);
        } else {
          ns[prop] = state;
        }
        return this.setState(ns);
      }
    },
    componentDidMount: function() {
      var _this = this;
      if (this.globals) {
        return this.globals.map(function(g) {
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
      return $(document).trigger("syncstate." + prop, obj);
    }
  };

}).call(this);
