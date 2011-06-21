resque = require 'coffee-resque'
util = require 'util'

conn = resque.connect 
    host: 'localhost'
    port: 6379
    callbacks:
        hello: (args, cb) ->
            util.log 'starting hello'
            setTimeout () ->
                util.log 'finishing badhello'
                cb hello: true
            , 10000
        badhello: (args, cb) ->
            util.log 'starting badhello'
            setTimeout () ->
                util.log 'finishing badhello'
                cb hello: false
            , 10000

w = conn.worker('*')
w.on 'poll', (worker, queue) ->
    util.log util.inspect worker
w.on 'job', (worker, queue, job) ->
    util.log util.inspect worker

w.start()

conn.enqueue 'work', 'hello', [{lol: true}]
conn.enqueue 'work', 'badhello', [{lol: false}]
