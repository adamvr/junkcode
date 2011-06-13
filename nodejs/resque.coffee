resque = require 'coffee-resque'
util = require 'util'

conn = resque.connect
    host: 'localhost'
    port: 6379
    callbacks: 
        add: (a, b, cb) ->
            setTimeout () ->
                #cb a+b
                util.log 'lol'
            , 2000
        success: (arg, cb) -> cb()
        failure: (arg, cb) -> cb new Error 'fail'

worker = conn.worker '*'

worker.on 'poll', () -> util.log 'polling'
worker.on 'job', (worker, queue, job) ->
    util.log "Queue: #{util.log util.inspect queue}, Job: #{util.log util.inspect job}"
worker.on 'error', (err, worker, queue, job) ->
    util.log "Error: #{util.log util.inspect err} Queue: #{util.log util.inspect queue}, Job: #{util.log util.inspect job}"
worker.on 'success', (worker, queue, job, result) ->
    util.log "Result: #{util.log result} Queue: #{util.log queue}, Job: #{util.log job}"

worker.start()

setInterval () ->
    conn.enqueue 'math', 'add', [1,2]
, 1000
