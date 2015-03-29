
window.Panoko = {} unless Panoko?




Panoko.SearchQueryView = React.createFactory React.createClass
  mixins: [Panoko.QueryMixin, Panoko.SyncState, Panoko.PaneView]
  getInitialState: ->
    {
      facts: []
    }

  getQuery: (query) ->
    num = parseInt(query)
    qrx = RegExp(query)
    $and: [
      {kind: 'query'},
      {query: qrx}
      ]
      
  render: ->
    unless @props.shown
      return DOM.div()
    DOM.div {class: 'query-pane'}, [
      DOM.table {class:'table'}, [
        @thead(['engine','query', 'path']),
        DOM.tbody @state.facts.map (fact) =>
            DOM.tr key: fact._id, [
              Panoko.TimeField(fact: fact),
              Panoko.IPField(fact: fact),
              DOM.td(key: 'kind', "#{fact.provider}"),
              DOM.td(key: 'query', "#{fact.query}"),
              DOM.td(key: 'path', "#{fact.path}"),
              ]
        ]]
    

Panoko.CredView = React.createFactory React.createClass
  mixins: [Panoko.QueryMixin, Panoko.SyncState, Panoko.PaneView]
  getInitialState: ->
    {
      facts: []
    }
  getQuery: (query) ->
    qrx = RegExp query
    $and: [
      kind: 'cred',
      $or: [
        {id: qrx},
        {email: qrx},
        {password: qrx}
        ]]
        
  render: ->
    unless @props.shown
      return DOM.div()
    DOM.div {class: 'cred-pane'}, [
      DOM.table {class:'table'}, [
        @thead(['provider','username','email','password']),
        DOM.tbody @state.facts.map (fact) =>
            DOM.tr key: fact._id, [
              Panoko.TimeField(fact: fact),
              Panoko.IPField(fact: fact),
              DOM.td(key: 'provider', "#{fact.provider}"),
              DOM.td(key: 'username', (fact.id or '(no data)')),
              DOM.td(key: 'email', (fact.email or '(no data)')),
              DOM.td(key: 'password', (fact.password or '(no data)')),
              ]
        ]]
    


Panoko.FacebookMessageView = React.createFactory React.createClass
  mixins: [Panoko.QueryMixin, Panoko.SyncState, Panoko.PaneView]
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
        {kind: 'message'},
        {$or: or_stmt}
      ]

  na: (s) ->
    return 'N/A' if s == undefined
    return '(empty)' if s == []
    return s

  just_recipients: (frm, frm_name, to, to_name) ->
    to = _.reject to, ((x) -> x==frm)
    Panoko.FacebookUsers
      names: to_name
      fbids: to
  
  render: ->
    unless @props.shown
      return DOM.div()

    DOM.div class: 'facebook-messages-pane',
      DOM.table {class:'table'}, [
        @thead(['from', 'to', 'content']),
        DOM.tbody
          key:'tbody',
          @state.facts.map (fact) =>
            DOM.tr key: fact._id, [
              Panoko.TimeField(fact: fact),
              Panoko.IPField(fact: fact),
              Panoko.FacebookUsers(fbids:[fact.frm], names:fact.frm_name),
              @just_recipients(fact.frm, fact.frm_name, fact.to, fact.to_name),
              DOM.td(key: 'content', "#{fact.content}")
              ]
        ]


Panoko.UploadView = React.createFactory React.createClass
  mixins: [Panoko.QueryMixin, Panoko.SyncState, Panoko.PaneView]
  getInitialState: ->
    {
      facts: []
    }
  getQuery: (query) ->
    qrx = RegExp query
    $and:
      [
        {kind: 'upload'},
        {filename: qrx}
      ]

  render: ->
    unless @props.shown
      return DOM.div()
    DOM.div class: 'upload-pane',
      DOM.table {class:'table'}, [
        @thead(['provider', 'filename', 'content']),
        DOM.tbody
          key:'tbody',
          @state.facts.map (fact) =>
            DOM.tr key: fact._id, [
              Panoko.TimeField(fact: fact),
              Panoko.IPField(fact: fact),
              DOM.td({key: 'provider'}, fact.provider),
              DOM.td({key: 'filename'}, fact.filename),
              DOM.td({key: 'type'}, fact.mime),
              DOM.td({key: 'content'}, fact.content),
              ]]


Panoko.EmailView = React.createFactory React.createClass
  mixins: [Panoko.QueryMixin, Panoko.SyncState, Panoko.PaneView, Panoko.RunSearch]
  getInitialState: ->
    {
      facts: []
    }
    
  getQuery: (query) ->
    qrx = RegExp query

    or_stmt = []
    or_stmt = or_stmt.concat [
      {id: query},
      {reply: query},
      {content: qrx},
      {subject: qrx},
      {to: qrx},
      {frm: qrx},
      {frm_name: qrx},
      {to_name: qrx},
      ]
      
    q = $and:
      [
        {kind: 'mail'},
        {$or: or_stmt}
      ]
    console.log "Query:", q
    q


  render: ->
    unless @props.shown
      return DOM.div()
    
    DOM.div class: 'mail-pane',
      DOM.table {class:'table'}, [
        @thead(['provider', 'reply' , 'from', 'to', 'subject', 'content']),
        DOM.tbody
          key:'tbody',
          @state.facts.map (fact) =>
            to_emails = (fact.to or []).join(',')
            DOM.tr key: fact._id, [
              Panoko.TimeField(fact: fact),
              Panoko.IPField(fact: fact),
              DOM.td(key:'provider', (fact.provider)),
              DOM.td({key:'reply'}, @searchableData(fact.reply)),
              DOM.td(key:'frm', "#{fact.frm_name or '?'} <#{fact.frm}>"),
              DOM.td({
                key:'to',
                dangerouslySetInnerHTML: @raw_html("#{fact.to_name or '?'} #{to_emails}")}, null),
              DOM.td(key:'subject', (fact.subject or '(none)')),
              DOM.td({key:'content', dangerouslySetInnerHTML: @raw_html(fact.content)}, null)
              ]
          ]
