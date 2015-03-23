DOM = React.DOM
El = React.createElement

Test = React.createClass
  render: ->
    DOM.div {class: 'hl'}, "oh me! " + @props.name

window.UI = {}


FactList = React.createClass
  getInitialState: ->
    {
      kind: null,
      facts: []
    }

  row: (fact) ->
    DOM.tr {key: fact._id},
      _.map @props.fields, (f) -> DOM.td {key: f}, fact[f]

  select_fields: ->
    _.object @props.fields.map (f) -> [f, 1]

  all_facts: ->
    Facts.find({}, {fields: @select_fields()})

  componentDidMount: ->
    @setState({facts: @all_facts()})
    console.log "new facts: ", @state.facts.length, @state.facts

  render: ->
    DOM.table className:"table", [ 
        DOM.thead null, [
          DOM.tr null,
            _.map @props.fields, (f) => DOM.th null, f
          ], 
        DOM.tbody null,
            @state.facts.map (d) => @row(d)
      ]

Meteor.startup ->
  facts = document.getElementById 'facts'
  React.render El(FactList, fields: ["timestamp_start", "host"]), facts
  
