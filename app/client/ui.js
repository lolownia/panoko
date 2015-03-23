// Generated by CoffeeScript 1.4.0
(function() {
  var DOM, El, FactList, Test;

  DOM = React.DOM;

  El = React.createElement;

  Test = React.createClass({
    render: function() {
      return DOM.div({
        "class": 'hl'
      }, "oh me! " + this.props.name);
    }
  });

  window.UI = {};

  FactList = React.createClass({
    getInitialState: function() {
      return {
        kind: null,
        facts: []
      };
    },
    row: function(fact) {
      return DOM.tr({
        key: fact._id
      }, _.map(this.props.fields, function(f) {
        return DOM.td({
          key: f
        }, fact[f]);
      }));
    },
    select_fields: function() {
      return _.object(this.props.fields.map(function(f) {
        return [f, 1];
      }));
    },
    all_facts: function() {
      return Facts.find({}, {
        fields: this.select_fields()
      });
    },
    componentDidMount: function() {
      this.setState({
        facts: this.all_facts()
      });
      return console.log("new facts: ", this.state.facts.length, this.state.facts);
    },
    render: function() {
      var _this = this;
      return DOM.table({
        className: "table"
      }, [
        DOM.thead(null, [
          DOM.tr(null, _.map(this.props.fields, function(f) {
            return DOM.th(null, f);
          }))
        ], DOM.tbody(null, this.state.facts.map(function(d) {
          return _this.row(d);
        })))
      ]);
    }
  });

  Meteor.startup(function() {
    var facts;
    facts = document.getElementById('facts');
    return React.render(El(FactList, {
      fields: ["timestamp_start", "host"]
    }), facts);
  });

}).call(this);
