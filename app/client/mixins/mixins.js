(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  if (typeof Panoko === "undefined" || Panoko === null) {
    window.Panoko = {};
  }

  Panoko.QueryMixin = {
    factsPerPage: 50,
    getLimit: function() {
      if ('limit' in this.state) {
        return this.state.limit;
      }
      return this.factsPerPage;
    },
    getMoreFacts: function(this_many) {
      return this.queryFacts(this.props.query, this_many);
    },
    pagination: function() {
      var count;
      if (this.state.facts.count == null) {
        return '';
      }
      count = this.state.facts.count();
      if (count === this.getLimit()) {
        return DOM.div({
          key: 'pagination',
          "class": 'btn-group',
          role: 'group'
        }, DOM.a({
          onClick: (function(_this) {
            return function(ev) {
              ev.preventDefault();
              return _this.getMoreFacts(_this.getLimit() + _this.factsPerPage);
            };
          })(this),
          href: '#',
          "class": 'btn btn-default'
        }, 'Load more...'));
      }
      return '';
    },
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
    queryFacts: function(query, limit) {
      var result, v;
      if (limit == null) {
        limit = this.getLimit();
      }
      result = Facts.find(this.getQuery(query), {
        sort: {
          timestamp_start: -1
        },
        limit: limit
      });
      v = {};
      v[this.props.pane] = result.count();
      console.log("...and got counts: " + (result.count()));
      this.publish('counts', v);
      return this.setState({
        facts: result,
        limit: limit
      });
    },
    whereabouts: function(query) {
      if (query.match(/^\d+[.]\d+[.]\d+[.]\d+$/)) {
        return [
          {
            'client': query
          }
        ];
      }
      return [];
    }
  };

  window.globalState = {};

  Panoko.ObserveGlobalState = {
    componentDidMount: function() {
      if (!this.globals) {
        return;
      }
      this.observer = new ObjectObserver(window.globalState);
      return this.observer.open((function(_this) {
        return function(added, removed, changed, oldVal) {
          var i, len, news, propname, ref;
          news = {};
          ref = _this.globals;
          for (i = 0, len = ref.length; i < len; i++) {
            propname = ref[i];
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
        };
      })(this));
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
      if (indexOf.call(this.globals, prop) >= 0) {
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
      if (this.globals) {
        return this.globals.map((function(_this) {
          return function(g) {
            return $(document).on("syncstate." + g, function(ev, state) {
              return _this.doSyncState(g, state);
            });
          };
        })(this));
      }
    },
    componentWillUnmount: function() {
      if (this.globals) {
        return this.globals.map((function(_this) {
          return function(g) {
            return $(document).off("syncstate." + g, function(ev, state) {
              return _this.doSyncState(g, state);
            });
          };
        })(this));
      }
    },
    publish: function(prop, obj) {
      return $(document).trigger("syncstate." + prop, obj);
    }
  };

}).call(this);

//# sourceMappingURL=mixins.js.map
