/*jshint -W079 */
'use strict';

if ( typeof Promise === 'undefined' ) {
    var Promise = require( 'es6-promise' ).Promise;
}
var Subscription = require( './subscription' );

function Topic( callback, receiver ) {
    this.subscriptions = [];
    if ( callback ) {
        this.add( callback, receiver );
    }
}

Topic.prototype = {
    fire: function ( data ) {
        return Promise.all( this.subscriptions.map( Subscription.fire_( data ) ) );
    },
    add: function ( callback, receiver ) {
        var sub = new Subscription( callback, receiver );
        this.subscriptions.push( sub );
        return sub;
    },
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