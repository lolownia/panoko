
window.Panoko = {} unless Panoko?




Panoko.SearchQueryView = React.createFactory React.createClass
  mixins: [Panoko.QueryMixin, Panoko.SyncState]
  getInitialState: ->
    {
      facts: []
    }

  getQuery: (query) ->
    num = parseInt(query)
    qrx = RegExp(query)
    $and:
      [
        kind: 'query',
        query: qrx
      ]

  render: ->
    unless @props.shown
      return DOM.div()
    DOM.div {class: 'query-pane'}, [
      DOM.table {class:'table'}, [
        DOM.thead(
          DOM.tr [
            _.map ['engine','query'], (fn)-> DOM.th(key:fn, fn)
            ]),
        DOM.tbody @state.facts.map (fact) =>
            DOM.tr key: fact._id, [
              DOM.td(key: 'kind', "#{fact.kind}"),
              DOM.td(key: 'query', "#{fact.query}"),
              ]
        ]]
    

Panoko.FacebookMessageView = React.createFactory React.createClass
  mixins: [Panoko.QueryMixin, Panoko.SyncState],
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
          key:'thead',
          DOM.tr [
            _.map ['from', 'to', 'content'], (fn)-> DOM.th(key:fn, fn)
            ]),
        DOM.tbody
          key:'tbody',
          @state.facts.map (fact) =>
            DOM.tr key: fact._id, [
              DOM.td(key: 'from', "#{@na(fact.frm)} #{@na(fact.frm_name)}"),
              DOM.td(key: 'to', "#{@na(fact.to)}, #{@na(fact.to_name)}"),
              DOM.td(key: 'content', "#{fact.content}")
              ]
        ]

