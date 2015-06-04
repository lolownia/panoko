(function() {
  var PaneController, QueryInput, SidebarController, Test,
    slice = [].slice;

  PaneController = React.createFactory(React.createClass({
    mixins: [Panoko.SyncState],
    globals: ['pane', 'query'],
    getInitialState: function() {
      return {
        query: '',
        pane: 'messages'
      };
    },
    newQuery: function(query) {
      return this.setState({
        query: query
      });
    },
    show: function(pane) {
      return this.setState({
        pane: pane
      });
    },
    panes: [['messages', Panoko.FacebookMessageView], ['search', Panoko.SearchQueryView], ['cred', Panoko.CredView], ['upload', Panoko.UploadView], ['email', Panoko.EmailView], ['browsing', Panoko.BrowseView]],
    render: function() {
      var children, comp, components, i, j, len, len1, pane, ref, ref1;
      children = [];
      ref = this.panes;
      for (i = 0, len = ref.length; i < len; i++) {
        ref1 = ref[i], pane = ref1[0], components = 2 <= ref1.length ? slice.call(ref1, 1) : [];
        for (j = 0, len1 = components.length; j < len1; j++) {
          comp = components[j];
          children.push(comp({
            key: pane,
            query: this.state.query,
            shown: pane === this.state.pane,
            sidebar: this.props.sidebar,
            pane: pane
          }));
        }
      }
      return DOM.div(children);
    }
  }));

  SidebarController = React.createFactory(React.createClass({
    mixins: [Panoko.SyncState],
    globals: ['pane', 'counts'],
    mergers: {
      counts: function(old, change) {
        return _.extend(old || {}, change);
      }
    },
    panes: ['messages', 'email', 'search', 'cred', 'upload', 'browsing'],
    getInitialState: function() {
      return {
        pane: 'messages',
        counts: {}
      };
    },
    changePane: function(pane) {
      return this.publish('pane', pane);
    },
    render: function() {
      var is_selected, show_badge;
      show_badge = (function(_this) {
        return function(counts) {
          if (counts != null) {
            return {};
          }
          return {
            display: 'none'
          };
        };
      })(this);
      is_selected = (function(_this) {
        return function(pane) {
          if (_this.state.pane === pane) {
            return 'selected';
          }
          return '';
        };
      })(this);
      return DOM.ul({
        id: 'active',
        "class": "nav navbar-nav side-nav"
      }, this.panes.map((function(_this) {
        return function(pane) {
          return DOM.li({
            key: pane,
            className: is_selected(pane)
          }, DOM.a({
            href: '#' + pane,
            onClick: function(ev) {
              return _this.changePane(pane);
            }
          }, [
            DOM.span({
              key: 'name'
            }, pane), DOM.span({
              key: 'count',
              className: 'badge',
              style: show_badge(_this.state.counts[pane])
            }, [_this.state.counts[pane]])
          ]));
        };
      })(this)));
    }
  }));

  QueryInput = React.createFactory(React.createClass({
    mixins: [Panoko.SyncState],
    submit: function(ev) {
      var query;
      ev.preventDefault();
      query = this.refs.input.getDOMNode().value;
      return this.publish('query', query);
    },
    render: function() {
      return DOM.form({
        "class": 'navbar-search',
        onSubmit: this.submit
      }, DOM.input({
        type: 'text',
        placeholder: 'Search',
        "class": 'form-control',
        ref: 'input'
      }, []));
    }
  }));

  Test = React.createFactory(React.createClass({
    getInitialState: function() {
      return {
        foo: {}
      };
    },
    render: function() {
      return DOM.div({}, [
        DOM.button({
          onClick: (function(_this) {
            return function() {
              return _this.setState({
                foo: {
                  one: 1
                }
              });
            };
          })(this)
        }, "one"), DOM.button({
          onClick: (function(_this) {
            return function() {
              return _this.setState({
                foo: {
                  two: 2
                }
              });
            };
          })(this)
        }, "two"), DOM.span("state keys are: " + (Object.keys(this.state.foo)))
      ]);
    }
  }));

  Meteor.startup(function() {
    React.render(PaneController(), document.getElementById('panes'));
    React.render(QueryInput(), document.getElementById('search-form'));
    return React.render(SidebarController(), document.getElementById('sidebar'));
  });

}).call(this);

//# sourceMappingURL=ui.js.map
