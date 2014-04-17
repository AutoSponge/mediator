Mediator
========

Mediator (pub/sub) implemented on top of [accu-router](https://www.npmjs.org/package/accu-router).

## Getting started

`npm install accu-mediator --save`

### .instance, new, .create()

Instantiate the mediator:

```js
var Mediator = require( 'accu-mediator' );
var mediator = new Mediator();

//or use the default instance
var mediator = require( 'accu-mediator' ).instance;

//or
var mediator = require( 'accu-mediator' ).create();
```

### .subscribe( topic, callback\[, receiver\] );

Subscribe to topics

```js
//topics are route paths, see accu-router for route examples
mediator.subscribe( 'my/topic/with/:tokens', myCallbackFn );

//add a receiver context for your callback
mediator.subscribe( 'my/topic/without/tokens', myObj.method, myObj );
```

### .publish( topic\[, ...arg\] )

Publish topics.  Data arguments are optional.

```js
mediator.publish( 'my/topic' );
```

The publish method returns `false` if no callbacks were registered or a `Promise`
for the resolution of all callbacks.  The `Promise` will resolve to an array of
all callback values.

```js
mediator.publish( 'call/server' ).then( doSomething );
```

### .unsubscribe( topic, callback\[, receiver\] );

```js
mediator.unsubscribe( 'my/topic', myCallback );
```