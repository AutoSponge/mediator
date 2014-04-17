'use strict';

var part = require( 'part' );

function Subscription( callback, receiver ) {
    this.callback = callback;
    this.receiver = receiver;
}

Subscription.prototype = {
    fire: function ( args ) {
        return this.callback.apply( this.receiver, args );
    }
};

Subscription.fire_ = part.create_( Subscription.prototype.fire );

module.exports = Subscription;