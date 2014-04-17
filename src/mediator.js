'use strict';

var Router = require( 'accu-router' );
var Topic = require( './topic' );

/**
 * @constructor
 */
function Mediator() {
    this.topics = new Router();
}

Mediator.prototype = {
    /**
     * @method publish
     * @param {String} path
     * @param {...*} [args]
     * @returns {false|Promise}
     */
    publish: function ( path/*, ...args */ ) {
        var match = this.topics.match( path );
        var topic = match && match.fn;
        return topic && topic.fire( arguments );
    },
    /**
     * @method subscribe
     * @param {String} path
     * @param {Function} callback
     * @param {Object} [receiver]
     */
    subscribe: function ( path, callback, receiver ) {
        var match;
        if ( callback ) {
            match = this.topics.match( path );
            if ( match && match.route === path ) {
                match.fn.add( callback, receiver );
            }
            this.topics.addRoute( path, new Topic( callback, receiver ) );
        }
    },
    /**
     * @method unsubscribe
     * @param {String} path
     * @param {Function} callback
     * @param {Object} [receiver]
     */
    unsubscribe: function ( path, callback, receiver ) {
        var match = this.topics.match( path );
        if ( match ) {
            if ( !match.fn.remove( callback, receiver ) ) {
                this.topics.removeRoute( match.route );
            }
        }
    }
};

/**
 * @static create
 * @returns {Mediator}
 */
Mediator.create = function () {
    return new Mediator();
};

/**
 * @property {Mediator} instance
 */
Mediator.instance = new Mediator();

module.exports = Mediator;