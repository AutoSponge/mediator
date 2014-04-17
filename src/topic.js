/*jshint -W079 */
'use strict';

if ( typeof Promise === 'undefined' ) {
    var Promise = require( 'es6-promise' ).Promise;
}
var Subscription = require( './subscription' );

/**
 * @param {Function} [callback]
 * @param {Object} [receiver]
 * @constructor
 */
function Topic( callback, receiver ) {
    this.subscriptions = [];
    if ( callback ) {
        this.add( callback, receiver );
    }
}

Topic.prototype = {
    /**
     * @method fire
     * @param {Array|Arguments} data
     * @returns {Promise}
     */
    fire: function ( data ) {
        return Promise.all( this.subscriptions.map( Subscription.fire_( data ) ) );
    },
    /**
     * @method add
     * @param {Function} callback
     * @param {Object} [receiver]
     */
    add: function ( callback, receiver ) {
        this.subscriptions.push( new Subscription( callback, receiver ) );
    },
    /**
     * @method remove
     * @param {Function} callback
     * @param {Object} [receiver]
     * @returns {Boolean}
     */
    remove: function ( callback, receiver ) {
        this.subscriptions = this.subscriptions.filter( function ( sub ) {
            if ( receiver ) {
                return sub.callback !== callback && sub.receiver !== receiver;
            }
            return sub.callback !== callback;
        } );
        return !!this.subscriptions.length;
    }
};

module.exports = Topic;