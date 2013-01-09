power-assert.js - Empower your assertions
================================


DESCRIPTION
---------------------------------------
power-assert.js is a experimental implementation of "Power Assert" in JavaScript, powered by [Esprima](http://esprima.org/) and [Escodegen](https://github.com/Constellation/escodegen).

power-assert.js is in alpha stage, so backward compatibility breaking changes are occurred very often. Pull-requests, issue reports and patches are always welcome.


HOW TO USE
---------------------------------------

First, install power-assert via `npm`.

    $ npm install power-assert

Second, generate empowered code using `empower` command.

    $ empower your_test.js > your_test_empowered.js

Then run your test in your way (just using `node` in this example).

    $ node your_test_empowered.js



OUTPUT EXAMPLE
---------------------------------------

     assert.ok(hoge === fuga);
               ^^^^     ^^^^             
               |        |                
               |        "bar"            
               "foo"                     
 
     assert.ok(fuga === piyo);
               ^^^^     ^^^^  
               |        |     
               |        3     
               "bar"          
 
     assert.ok(longString === anotherLongString);
               ^^^^^^^^^^     ^^^^^^^^^^^^^^^^^  
               |              |                  
               |              "yet another loooooooooooooooooooooooooooooooooooooooooooooooooooong message"
               "very very loooooooooooooooooooooooooooooooooooooooooooooooooooong message"
 
     assert.ok(4 === piyo);
                     ^^^^  
                     |     
                     3     
 
     assert.ok(falsyStr);
               ^^^^^^^^  
               |         
               ""        
 
     assert.ok(falsyNum);
               ^^^^^^^^  
               |         
               0         
 
     assert.ok(ary1.length === ary2.length);
               ^^^^ ^^^^^^     ^^^^ ^^^^^^  
               |    |          |    |       
               |    |          |    3       
               |    |          aaa,bbb,ccc  
               |    2                       
               foo,bar                      
 
     assert.ok(5 < actual && actual < 13);
                   ^^^^^^    ^^^^^^       
                   |         |            
                   |         16           
                   16                     
 
     assert.ok(actual < 5 || 13 < actual);
               ^^^^^^             ^^^^^^  
               |                  |       
               |                  10      
               10                         
 
     assert.ok(foo.bar.baz);
               ^^^ ^^^ ^^^  
               |   |   |    
               |   |   false
               |   [object Object]
               [object Object]
 
     assert.ok(!truth);
                ^^^^^  
                |      
                true   


AUTHOR
---------------------------------------
* [Takuto Wada](http://github.com/twada)


LICENSE
---------------------------------------
Licensed under the [MIT](https://raw.github.com/twada/power-assert.js/master/MIT-LICENSE.txt) license.