ELEM = React.createElement


FacebookMessageView = React.createFactory React.createClass
  mixins: [QueryMixin, SyncState],
  getInitialState: ->
    {
      facts: []
    }
    
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
    unless @props.shown
      return DOM.div()
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
  mixins: [SyncState]
  globals: ['pane', 'query']
  
  getInitialState: ->
    {
      query: '',
      pane: 'messages'
    }

  newQuery: (query) ->
    @setState query: query

  show: (pane) ->
    @setState pane:pane

  panes: [
    ['messages', FacebookMessageView]
    ]
    
  render: ->
    children = []
    for [pane, components...] in @panes
      for comp in components
        children.push comp
          query: @state.query
          shown: pane == @state.pane
          sidebar: @props.sidebar
          pane: pane

    DOM.div children

SidebarController = React.createFactory React.createClass
  mixins: [SyncState]
  globals: ['pane', 'counts']
  
  getInitialState: ->
    pane: 'messages'
    counts: {}

  changePane: (pane) ->
    @publish 'pane', pane

  render: ->
    panes = ['messages']
    DOM.ul {id:'active', class: "nav navbar-nav side-nav"},
      panes.map (pane) =>
        DOM.li
          class: (@state.pane == pane and 'selected' or ''),
          [DOM.a
            href: '#'+pane,
            onClick: (ev)=>@changePane(pane),
            [pane,
            DOM.span
              class:'badge'
              style: (not @state.counts[pane]? and {display: 'none'} or {})
              [@state.counts[pane]]]
          ]
      
        


QueryInput = React.createFactory React.createClass
  mixins: [SyncState]
  submit: (ev) ->
    ev.preventDefault()
    query = @refs.input.getDOMNode().value
    console.log "calling searcher with #{query}"
    @publish 'query', query
    
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
  React.render PaneController(),
    document.getElementById('panes')
  React.render QueryInput(),
    document.getElementById('search-form')
  React.render SidebarController(),
    document.getElementById('sidebar')

