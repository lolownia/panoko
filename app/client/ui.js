// Generated by CoffeeScript 1.4.0
(function() {
  var ELEM, FacebookMessageView, PaneController, QueryInput, QueryMixin;

  ELEM = React.createElement;

  window.UI = {};

  QueryMixin = {
    componentWillMount: function() {
      if (this.props.query) {
        return this.setState({
          facts: this.doQuery(this.props.query)
        });
      }
    },
    componentWillReceiveProps: function(props) {
      if (props.query) {
        return this.setState({
          facts: this.doQuery(props.query)
        });
      }
    },
    doQuery: function(q) {
      q = this.getQuery(q);
      return Facts.find(q);
    }
  };

  FacebookMessageView = React.createFactory(React.createClass({
    mixins: [QueryMixin],
    getInitialState: function() {
      return {
        facts: []
      };
    },
    getQuery: function(query) {
      var num, or_stmt, qrx;
      num = parseInt(query);
      qrx = RegExp(query);
      or_stmt = [];
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
            kind: 'message',
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
    render: function() {
      var _this = this;
      return DOM.div({
        "class": 'facebook-messages-pane'
      }, DOM.table({
        "class": 'table'
      }, [
        DOM.thead(DOM.tr([
          _.map(['from', 'to', 'content'], function(fn) {
            return DOM.th({
              key: fn
            }, fn);
          })
        ])), DOM.tbody(this.state.facts.map(function(fact) {
          return DOM.tr({
            key: fact._id
          }, [
            DOM.td({
              key: 'from'
            }, "" + (_this.na(fact.frm)) + " " + (_this.na(fact.frm_name))), DOM.td({
              key: 'to'
            }, "" + (_this.na(fact.to)) + ", " + (_this.na(fact.to_name))), DOM.td({
              key: 'content'
            }, "" + fact.content)
          ]);
        }))
      ]));
    }
  }));

  PaneController = React.createFactory(React.createClass({
    getInitialState: function() {
      return {
        query: '',
        kind: null
      };
    },
    newQuery: function(query) {
      return this.setState({
        query: query
      });
    },
    render: function() {
      if (this.state.kind === null) {
        return DOM.div({
          "class": 'row'
        }, FacebookMessageView({
          query: this.state.query
        }));
      }
    }
  }));

  QueryInput = React.createFactory(React.createClass({
    submit: function(ev) {
      var query;
      ev.preventDefault();
      query = this.refs.input.getDOMNode().value;
      console.log("calling searcher with " + query);
      return this.props.searcher(query);
    },
    render: function() {
      return DOM.form({
        "class": 'navbar-search',
        onSubmit: this.submit
      }, [
        DOM.input({
          type: 'text',
          placeholder: 'Search',
          "class": 'form-control',
          ref: 'input'
        }, [])
      ]);
    }
  }));

  Meteor.startup(function() {
    var panes, search;
    panes = React.render(PaneController(), document.getElementById('panes'));
    search = QueryInput({
      searcher: panes.newQuery
    });
    return React.render(search, document.getElementById('search-form'));
  });

}).call(this);
