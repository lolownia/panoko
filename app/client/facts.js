(function() {
  if (typeof Panoko === "undefined" || Panoko === null) {
    window.Panoko = {};
  }

  Panoko.SearchQueryView = React.createFactory(React.createClass({
    mixins: [Panoko.QueryMixin, Panoko.SyncState, Panoko.PaneView],
    getInitialState: function() {
      return {
        facts: []
      };
    },
    getQuery: function(query) {
      var num, qrx;
      num = parseInt(query);
      qrx = RegExp(query);
      return {
        $and: [
          {
            kind: 'query'
          }, {
            query: qrx
          }
        ]
      };
    },
    render: function() {
      var more_button, table;
      if (!this.props.shown) {
        return DOM.div();
      }
      more_button = this.pagination();
      table = DOM.table({
        key: 'facts',
        "class": 'table'
      }, [
        this.thead(['engine', 'query', 'path']), DOM.tbody(this.state.facts.map((function(_this) {
          return function(fact) {
            return DOM.tr({
              key: fact._id
            }, [
              Panoko.TimeField({
                fact: fact
              }), Panoko.IPField({
                fact: fact
              }), DOM.td({
                key: 'kind'
              }, "" + fact.provider), DOM.td({
                key: 'query'
              }, "" + fact.query), DOM.td({
                key: 'path'
              }, "" + fact.path)
            ]);
          };
        })(this)))
      ]);
      return DOM.div({
        "class": 'query-pane'
      }, [table, more_button]);
    }
  }));

  Panoko.BrowseView = React.createFactory(React.createClass({
    mixins: [Panoko.QueryMixin, Panoko.SyncState, Panoko.PaneView],
    getInitialState: function() {
      return {
        facts: []
      };
    },
    getQuery: function(query) {
      var q, qrx;
      qrx = RegExp(query);
      q = {
        $and: [
          {
            kind: 'get'
          }, {
            $or: [
              {
                path: qrx
              }, {
                query_string: qrx
              }, {
                host: qrx
              }, {
                title: qrx
              }
            ]
          }
        ]
      };
      console.log("get query ", q);
      return q;
    },
    query_variables: function(query) {
      return DOM.ul({
        "class": 'query-string'
      }, _.map(query, function(v, k) {
        return DOM.li(k + " = " + (v.join(', ')));
      }));
    },
    render: function() {
      var more_button, table;
      if (!this.props.shown) {
        return DOM.div();
      }
      more_button = this.pagination();
      table = DOM.table({
        key: 'facts',
        "class": 'table'
      }, [
        this.thead(['hostname', 'path', 'title', 'query']), DOM.tbody(this.state.facts.map((function(_this) {
          return function(fact) {
            return DOM.tr({
              key: fact._id
            }, [
              Panoko.TimeField({
                fact: fact
              }), Panoko.IPField({
                fact: fact
              }), DOM.td({
                key: 'host'
              }, "" + fact.host), DOM.td({
                key: 'path'
              }, "" + fact.path), DOM.td({
                key: 'title'
              }, "" + fact.title), DOM.td({
                key: 'query'
              }, _this.query_variables(fact.query))
            ]);
          };
        })(this)))
      ]);
      return DOM.div({
        "class": 'query-pane'
      }, [table, more_button]);
    }
  }));

  Panoko.CredView = React.createFactory(React.createClass({
    mixins: [Panoko.QueryMixin, Panoko.SyncState, Panoko.PaneView],
    getInitialState: function() {
      return {
        facts: []
      };
    },
    getQuery: function(query) {
      var or_stmt, qrx;
      qrx = RegExp(query);
      or_stmt = this.whereabouts(query);
      return {
        $and: [
          {
            kind: 'cred',
            $or: [
              {
                id: qrx
              }, {
                email: qrx
              }, {
                password: qrx
              }
            ].concat(or_stmt)
          }
        ]
      };
    },
    render: function() {
      var more_button, table;
      if (!this.props.shown) {
        return DOM.div();
      }
      more_button = this.pagination();
      table = DOM.table({
        "class": 'table'
      }, [
        this.thead(['provider', 'username', 'email', 'password']), DOM.tbody(this.state.facts.map((function(_this) {
          return function(fact) {
            return DOM.tr({
              key: fact._id
            }, [
              Panoko.TimeField({
                fact: fact
              }), Panoko.IPField({
                fact: fact
              }), DOM.td({
                key: 'provider'
              }, "" + fact.provider), DOM.td({
                key: 'username'
              }, fact.id || '(no data)'), DOM.td({
                key: 'email'
              }, fact.email || '(no data)'), DOM.td({
                key: 'password'
              }, fact.password || '(no data)')
            ]);
          };
        })(this)))
      ]);
      return DOM.div({
        "class": 'cred-pane'
      }, [table, more_button]);
    }
  }));

  Panoko.FacebookMessageView = React.createFactory(React.createClass({
    mixins: [Panoko.QueryMixin, Panoko.SyncState, Panoko.PaneView],
    getInitialState: function() {
      return {
        facts: []
      };
    },
    getQuery: function(query) {
      var num, or_stmt, qrx;
      num = parseInt(query);
      qrx = RegExp(query);
      or_stmt = this.whereabouts(query);
      if (num !== NaN) {
        or_stmt = or_stmt.concat([
          {
            frm: num
          }, {
            to: num
          }
        ]);
      }
      or_stmt = or_stmt.concat([
        {
          content: qrx
        }, {
          frm_name: qrx
        }, {
          to_name: qrx
        }
      ]);
      return {
        $and: [
          {
            kind: 'message'
          }, {
            $or: or_stmt
          }
        ]
      };
    },
    na: function(s) {
      if (s === void 0) {
        return 'N/A';
      }
      if (s === []) {
        return '(empty)';
      }
      return s;
    },
    just_recipients: function(frm, frm_name, to, to_name) {
      to = _.reject(to, (function(x) {
        return x === frm;
      }));
      return Panoko.FacebookUsers({
        names: to_name,
        fbids: to
      });
    },
    render: function() {
      var more_button, table;
      if (!this.props.shown) {
        return DOM.div();
      }
      more_button = this.pagination();
      table = DOM.table({
        "class": 'table'
      }, [
        this.thead(['from', 'to', 'content']), DOM.tbody({
          key: 'tbody'
        }, this.state.facts.map((function(_this) {
          return function(fact) {
            return DOM.tr({
              key: fact._id
            }, [
              Panoko.TimeField({
                fact: fact
              }), Panoko.IPField({
                fact: fact
              }), Panoko.FacebookUsers({
                fbids: [fact.frm],
                names: fact.frm_name
              }), _this.just_recipients(fact.frm, fact.frm_name, fact.to, fact.to_name), DOM.td({
                key: 'content'
              }, "" + fact.content)
            ]);
          };
        })(this)))
      ]);
      return DOM.div({
        "class": 'facebook-messages-pane'
      }, [table, more_button]);
    }
  }));

  Panoko.UploadView = React.createFactory(React.createClass({
    mixins: [Panoko.QueryMixin, Panoko.SyncState, Panoko.PaneView],
    getInitialState: function() {
      return {
        facts: []
      };
    },
    getQuery: function(query) {
      var or_stmt, qrx;
      qrx = RegExp(query);
      or_stmt = this.whereabouts(query);
      return {
        $and: [
          {
            kind: 'upload'
          }, {
            $or: [
              {
                filename: qrx
              }
            ].concat(or_stmt)
          }
        ]
      };
    },
    render: function() {
      if (!this.props.shown) {
        return DOM.div();
      }
      return DOM.div({
        "class": 'upload-pane'
      }, DOM.table({
        "class": 'table'
      }, [
        this.thead(['provider', 'filename', 'content']), DOM.tbody({
          key: 'tbody'
        }, this.state.facts.map((function(_this) {
          return function(fact) {
            return DOM.tr({
              key: fact._id
            }, [
              Panoko.TimeField({
                fact: fact
              }), Panoko.IPField({
                fact: fact
              }), DOM.td({
                key: 'provider'
              }, fact.provider), DOM.td({
                key: 'filename'
              }, fact.filename), DOM.td({
                key: 'type'
              }, fact.mime), DOM.td({
                key: 'content'
              }, fact.content)
            ]);
          };
        })(this)))
      ]));
    }
  }));

  Panoko.EmailView = React.createFactory(React.createClass({
    mixins: [Panoko.QueryMixin, Panoko.SyncState, Panoko.PaneView, Panoko.RunSearch],
    getInitialState: function() {
      return {
        facts: []
      };
    },
    getQuery: function(query) {
      var or_stmt, q, qrx;
      qrx = RegExp(query);
      or_stmt = this.whereabouts(query);
      or_stmt = or_stmt.concat([
        {
          id: query
        }, {
          reply: query
        }, {
          content: qrx
        }, {
          subject: qrx
        }, {
          to: qrx
        }, {
          frm: qrx
        }, {
          frm_name: qrx
        }, {
          to_name: qrx
        }
      ]);
      q = {
        $and: [
          {
            kind: 'mail'
          }, {
            $or: or_stmt
          }
        ]
      };
      return q;
    },
    render: function() {
      var more_button, table;
      if (!this.props.shown) {
        return DOM.div();
      }
      more_button = this.pagination();
      table = DOM.table({
        "class": 'table'
      }, [
        this.thead(['provider', 'reply', 'from', 'to', 'subject', 'content']), DOM.tbody({
          key: 'tbody'
        }, this.state.facts.map((function(_this) {
          return function(fact) {
            var to_emails;
            to_emails = (fact.to || []).join(',');
            return DOM.tr({
              key: fact._id
            }, [
              Panoko.TimeField({
                fact: fact
              }), Panoko.IPField({
                fact: fact
              }), DOM.td({
                key: 'provider'
              }, fact.provider), DOM.td({
                key: 'reply'
              }, _this.searchable(fact.reply, fact.reply)), DOM.td({
                key: 'frm'
              }, (fact.frm_name || '?') + " <" + fact.frm + ">"), DOM.td({
                key: 'to',
                dangerouslySetInnerHTML: _this.raw_html((fact.to_name || '') + " " + to_emails)
              }, null), DOM.td({
                key: 'subject'
              }, fact.subject || '(none)'), DOM.td({
                key: 'content',
                dangerouslySetInnerHTML: _this.raw_html(fact.content)
              }, null)
            ]);
          };
        })(this)))
      ]);
      return DOM.div({
        "class": 'mail-pane'
      }, [table, more_button]);
    }
  }));

}).call(this);

//# sourceMappingURL=facts.js.map
