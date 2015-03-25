ELEM = React.createElement

window.UI = {}

QueryMixin =
  componentWillMount: ->
    if @props.query
      @setState facts: @doQuery(@props.query)

  componentWillReceiveProps: (props) ->
    if props.query
      @setState facts: @doQuery(props.query)

  doQuery: (q) ->
    q = @getQuery(q)
    Facts.find q


FacebookMessageView = React.createFactory React.createClass
  mixins: [QueryMixin],
  getInitialState: ->
    {facts: []}
    
  getQuery: (query) ->
    num = parseInt(query)
    qrx = RegExp query

    or_stmt = []
    if num != NaN
      or_stmt = or_stmt.concat [
          {frm: num},
          {to: num},
        ]
    or_stmt = or_stmt.concat [
      {content: qrx},
      {frm_name: qrx},
      {to_name: qrx},
      ]
    $and:
      [
        kind: 'message',
        $or: or_stmt
      ]

  na: (s) ->
    return 'N/A' if s == undefined
    return '(empty)' if s == []
    return s
  
  render: ->
    DOM.div class: 'facebook-messages-pane',
      DOM.table {class:'table'}, [
        DOM.thead(
          DOM.tr [
            _.map ['from', 'to', 'content'], (fn)-> DOM.th(key:fn, fn)
            ]),
        DOM.tbody @state.facts.map (fact) =>
            DOM.tr key: fact._id, [
              DOM.td(key: 'from', "#{@na(fact.frm)} #{@na(fact.frm_name)}"),
              DOM.td(key: 'to', "#{@na(fact.to)}, #{@na(fact.to_name)}"),
              DOM.td(key: 'content', "#{fact.content}")
              ]
        ]


PaneController = React.createFactory React.createClass
  getInitialState: ->
    {
      query: '',
      kind: null
    }

  newQuery: (query) ->
    @setState query: query

  render: ->
    if @state.kind == null
      DOM.div {class: 'row'},
        FacebookMessageView(query: @state.query)



QueryInput = React.createFactory React.createClass
  submit: (ev) ->
    ev.preventDefault()
    query = @refs.input.getDOMNode().value
    console.log "calling searcher with #{query}"
    @props.searcher(query)
    
  render: ->
    DOM.form class: 'navbar-search', onSubmit: @submit, [
      DOM.input {
        type:'text',
        placeholder:'Search',
        class:'form-control',
        ref: 'input'
        },[]
      ]


Meteor.startup ->
  panes = React.render PaneController(), document.getElementById('panes')
  search = QueryInput(searcher: panes.newQuery)
  React.render search, document.getElementById('search-form')

