/*jshint -W079 */

if ( typeof Promise === 'undefined' ) {
    var Promise = require( 'es6-promise' ).Promise;
}
var Subscription = require( './subscription' );

function Topic( callback, receiver ) {
    'use strict';
    this.subscriptions = [];
    if ( callback ) {
        this.add( callback, receiver );
    }
}

Topic.prototype = {
    fire: function ( data ) {
        'use strict';
        return Promise.all( this.subscriptions.map( Subscription.fire_( data ) ) );
    },
    add: function ( callback, receiver ) {
        'use strict';
        var sub = new Subscription( callback, receiver );
        this.subscriptions.push( sub );
        return sub;
    },
    remove: function ( callback, receiver ) {
        'use strict';
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