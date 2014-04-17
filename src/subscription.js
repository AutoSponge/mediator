'use strict';

var part = require( 'part' );

/**
 * @param {Function} callback
 * @param {Object} [receiver]
 * @constructor
 */
function Subscription( callback, receiver ) {
    this.callback = callback;
    this.receiver = receiver;
}

Subscription.prototype = {
    /**
     * @method fire
     * @param {Array|Arguments} args
     * @returns {*}
     */
    fire: function ( args ) {
        return this.callback.apply( this.receiver, args );
    }
};

/**
 * @static fire_
 * @param {Array|Arguments} args
 * @returns {Function} _part which expects a Subscription
 */
Subscription.fire_ = part.create_( Subscription.prototype.fire );

module.exports = Subscription;