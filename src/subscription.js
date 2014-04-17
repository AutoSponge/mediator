var part = require( 'part' );

function Subscription( callback, receiver ) {
    'use strict';
    this.callback = callback;
    this.receiver = receiver;
}

Subscription.prototype = {
    fire: function ( args ) {
        'use strict';
        return this.callback.apply( this.receiver, args );
    }
};

Subscription.fire_ = part.create_( Subscription.prototype.fire );

module.exports = Subscription;