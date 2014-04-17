var Router = require( 'accu-router' );
var Topic = require( './topic' );

function Mediator() {
    'use strict';
    this.topics = new Router();
}

Mediator.prototype = {
    publish: function ( path/*, ...args */ ) {
        'use strict';
        var match = this.topics.match( path );
        var topic = match && match.fn;
        return topic && topic.fire( arguments );
    },
    subscribe: function ( path, callback, receiver ) {
        'use strict';
        var match = this.topics.match( path );
        if ( match && match.route === path ) {
            return match.fn.add( callback, receiver );
        }
        return this.topics.addRoute( path, new Topic( callback, receiver ) );
    },
    unsubscribe: function ( path, subscription ) {
        'use strict';
        var match = this.topics.match( path );
        if ( match ) {
            if ( !match.fn.remove( subscription ) ) {
                this.topics.removeRoute( match.route );
            }
        }
    }
};

module.exports = Mediator;