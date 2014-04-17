var test = require( 'tape' );
var Mediator = require( '../' );

test( 'Mediator', function ( t ) {
    t.plan( 3 );

    t.ok( (new Mediator()) instanceof Mediator, 'Mediator should instantiate' );
    t.ok( Mediator.instance instanceof Mediator, 'Mediator should instantiate' );
    t.ok( Mediator.create() instanceof Mediator, 'Mediator should instantiate' );

} );

test( 'Mediator interface', function ( t ) {
    t.plan( 2 );

    var mediator = new Mediator();
    t.ok( typeof mediator.publish === 'function', 'publish should be a method' );
    t.ok( typeof mediator.subscribe === 'function', 'subscribe should be a method' );

} );

test( 'Mediator subscribe', function ( t ) {
    t.plan( 4 );

    var mediator = new Mediator();
    var handled = false;

    t.ok( handled === false, 'log/test should not be handled' );
    mediator.publish( 'log/test' );
    t.ok( handled === false, 'log/test should not be handled' );
    mediator.subscribe( 'log/test', function () {
        handled = true;
    } );
    t.ok( handled === false, 'log/test should not be handled' );
    mediator.publish( 'log/test' );
    t.ok( handled === true, 'log/test should be handled' );

} );

test( 'Mediator callback receives path and args', function ( t ) {
    t.plan( 4 );

    var mediator = new Mediator();
    var path, a, b, c;
    mediator.subscribe( 'test', function ( _path, _a, _b, _c ) {
        path = _path;
        a = _a;
        b = _b;
        c = _c;
    } );
    mediator.publish( 'test', 1, '2', true );
    t.equal( path, 'test', 'path should be test' );
    t.equal( a, 1,'a should be 1' );
    t.equal( b, '2', 'b should be 2' );
    t.equal( c, true, 'c should be true' );

} );

test( 'Mediator publish returns a promise or false', function ( t ) {
    t.plan( 4 );

    var mediator = new Mediator();

    t.equal( mediator.publish( 'test' ), false );
    mediator.subscribe( 'test', function () {
        return 'val';
    } );

    var p = mediator.publish( 'test' );
    t.equal( typeof p.then, 'function' );

    p.then( function ( value ) {
        t.ok( value instanceof Array, 'resolves to an array of callback values' );
        t.equal( value[0], 'val' );
    } );

} );

test( 'Mediator unsubscribe', function ( t ) {
    t.plan( 11 );

    var mediator = new Mediator();
    var a = 0;
    var b = 0;
    var obj = {};
    var callbackA = function ( _, _a ) { a = _a; };
    var callbackB = function ( _, _b ) { b = _b; };
    t.equal( a, 0 );
    t.equal( b, 0 );
    mediator.subscribe( 'test', callbackA );
    mediator.publish( 'test', 1 );
    t.equal( a, 1 );
    t.equal( b, 0 );
    mediator.unsubscribe( 'test', callbackA );
    t.equal( mediator.publish( 'test', 'bad' ), false );
    t.equal( a, 1 );
    t.equal( b, 0 );
    mediator.subscribe( 'test', callbackA, obj );
    mediator.subscribe( 'test', callbackB );
    mediator.publish( 'test', 2 );
    t.equal( a, 2 );
    t.equal( b, 2 );
    mediator.unsubscribe( 'test', callbackA, obj );
    mediator.publish( 'test', 3 );
    t.equal( a, 2 );
    t.equal( b, 3 );

} );

test( 'Mediator uses router specificity', function ( t ) {
    t.plan( 2 );

    var mediator = new Mediator();
    var path;
    var getPath = function ( p ) {
        path = p;
    };
    mediator.subscribe( 'test/:id', getPath );
    mediator.publish( 'test/1' );
    t.equal( path, 'test/1' );

    mediator.unsubscribe( 'test/:id', getPath );
    mediator.publish( 'test/2' );
    t.equal( path, 'test/1' );
} );