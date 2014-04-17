'use strict';

var Router = require( 'accu-router' );
var Topic = require( './topic' );

function Mediator() {
    this.topics = new Router();
}

Mediator.prototype = {
    publish: function ( path/*, ...args */ ) {
        var match = this.topics.match( path );
        var topic = match && match.fn;
        return topic && topic.fire( arguments );
    },
    subscribe: function ( path, callback, receiver ) {
        var match = this.topics.match( path );
        if ( match && match.route === path ) {
            return match.fn.add( callback, receiver );
        }
        return this.topics.addRoute( path, new Topic( callback, receiver ) );
    },
    unsubscribe: function ( path, subscription ) {
        var match = this.topics.match( path );
        if ( match ) {
            if ( !match.fn.remove( subscription ) ) {
                this.topics.removeRoute( match.route );
            }
        }
    }
};

Mediator.create = function () {
    return new Mediator();
};

Mediator.instance = new Mediator();

module.exports = Mediator;