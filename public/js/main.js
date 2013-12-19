(function($){

    //////////////////////
    //  RICEZIONE DATI
    //////////////////////

    $(function() {
        // inizializza Woolyarn
        Woolyarn.init();

        var socket          = Woolyarn.getSocket();

        var thatTime = 0;

        var previousDataArduino = 'lol';
        var previousDataHigh = 'asd';

        var $doc  = $(document);
        var $win  = $(window);
        var $html = $('html');
        var $body = $('body');
        var $statementCt = $('.nome').eq(0);
        var $fabryzWaitingCt    = $body.find('.fabryz-waiting').eq(0); 
        var $fabryzComeCloserCt = $body.find('.fabryz-come_closer').eq(0); 
        var $fabryzThinkingCt   = $body.find('.fabryz-thinking').eq(0); 
        var $fabryzAnimationCt  = $body.find('.fabryz-animation').eq(0); 
        var $fabryzSayingOkCt   = $body.find('.fabryz-saying-ok').eq(0);
        var $fabryzSayingNoCt   = $body.find('.fabryz-saying-no').eq(0); 
        var $fabryzSayingMaxCt  = $body.find('.fabryz-saying-max').eq(0); 

        //  inserisce la frase
        function changeStatement(s) {
            var stat = (typeof s === 'string' && s.length) ? s : 'Namaste';
            $statementCt.html('<p>' + stat + '</p>');
        };

        //  setta il mood della risposta
        function changeMood(m) {
            var mood = (typeof m === 'string') ? m.toUpperCase() : 'OK';
            switch (mood) {
                case 'OK':
                    showFabryzOk();
                break;
                case 'NO':
                    showFabryzNo();
                break;
                case 'MAX':
                    showFabryzMax();
                break;
            }
        };

        //  helper per effettuare fadeIn di un div
        function showDiv($obj) {
            if (typeof $obj === 'object') {
                if ($.isArray($obj)) {
                    for (var i = 0; i < $obj.length; i++) {
                        $obj[i].removeClass('hidden invisible');
                    }
                } else {
                    $obj.removeClass('hidden invisible');
                }
                return true;
            }
            return false;
        };

        //  helper per effettuare fadeOut di un div
        function hideDiv($obj) {
            if (typeof $obj === 'object') {
                if ($.isArray($obj)) {
                    for (var i = 0; i < $obj.length; i++) {
                        $obj[i].addClass('invisible').transitionEnd(function () {
                            $($obj[i]).addClass('hidden').removeClass('invisible');
                        });
                    }
                } else {
                    $obj.addClass('invisible').transitionEnd(function () {
                        $($obj[i]).addClass('hidden').removeClass('invisible');
                    });
                }
                return true;
            }
            return false;
        };

        //  helper per effettuare il crossfade tra due div
        function crossDiv($objIn, $objOut) {
            showDiv($objIn);
            hideDiv($objOut);
        };

        //  mostra fabryz che pensa
        function showFabryzWaiting() {
            crossDiv($fabryzWaitingCt, [$fabryzComeCloserCt, $fabryzThinkingCt, $fabryzAnimationCt, $fabryzSayingOkCt, $fabryzSayingNoCt, $fabryzSayingMaxCt]);
        };

        //  mostra fabryz che dice di avvicinarsi
        function showFabryzComeCloser() {
            crossDiv($fabryzComeCloserCt, [$fabryzWaitingCt, $fabryzThinkingCt, $fabryzAnimationCt, $fabryzSayingOkCt, $fabryzSayingNoCt, $fabryzSayingMaxCt]);
        };

        //  mostra fabryz che pensa
        function showFabryzThinking() {
            crossDiv($fabryzThinkingCt, [$fabryzWaitingCt, $fabryzComeCloserCt, $fabryzAnimationCt, $fabryzSayingOkCt, $fabryzSayingNoCt, $fabryzSayingMaxCt]);
        };

        //  mostra fabryz durante l'animazione
        function showFabryzAnimation() {
            crossDiv($fabryzAnimationCt, [$fabryzWaitingCt, $fabryzComeCloserCt, $fabryzThinkingCt, $fabryzSayingOkCt, $fabryzSayingNoCt, $fabryzSayingMaxCt]);
        };

        //  mostra fabryz che dice OK
        function showFabryzOk() {
            crossDiv($fabryzSayingOkCt, [$fabryzWaitingCt, $fabryzComeCloserCt, $fabryzAnimationCt, $fabryzThinkingCt, $fabryzSayingNoCt, $fabryzSayingMaxCt]);
        };

        //  mostra fabryz che dice NO
        function showFabryzNo() {
            crossDiv($fabryzSayingNoCt, [$fabryzWaitingCt, $fabryzComeCloserCt, $fabryzAnimationCt, $fabryzThinkingCt, $fabryzSayingOkCt, $fabryzSayingMaxCt]);
        };

        //  mostra fabryz che dice Max :)
        function showFabryzMax() {
            crossDiv($fabryzSayingMaxCt, [$fabryzWaitingCt, $fabryzComeCloserCt, $fabryzAnimationCt, $fabryzThinkingCt, $fabryzSayingOkCt, $fabryzSayingNoCt]);
        };

        //  inizia la lettura dei valori via socket da arduino
        function startSocketListening() {
            Woolyarn.socket.on('arduino', function(data) {
                var thisTime = new Date();
                if (!data || (thisTime - thatTime) < 15000) {
                    return false;
                } else if (data.value == previousDataArduino) {
                    previousDataArduino = data.value;
                    return false;
                }

                previousDataArduino = data.value;

                $("#currentValue").html(JSON.stringify(data));

                //  decide che funzione assegnare a ciascun stato
                var state = data.value;
                switch(state) {
                    case 0:     //  fabryz è in attesa
                        console.log('Waiting');
                        showFabryzWaiting();
                    break;
                    case 1:     //  fabryz dice di avvicinarsi
                        console.log('ComeCloser');
                        showFabryzComeCloser();
                    break;
                    case 2:     //  fabryz pensa
                        console.log('Thinking');
                        thatTime = new Date();
                        showFabryzThinking();
                    break;
                    default:    //  fabryz è in attesa
                        console.log('default-Waiting');
                        showFabryzWaiting();
                }
            });
        }

        //  quando ricevo un valore in lettura dalla barra capacitiva
        Woolyarn.socket.on('capacitiveBar', function(data) {
            console.log('Value arrived from capacitiveBar: '+ data.high);
            arduinoValue = data.high;
            riempi(arduinoValue);
        });

        //  inizia lettura dalla barra capacitiva
        function startNamasteListening() {
            Woolyarn.socket.on('namaste', function(data) {
                console.log('phrase: '+ data.phrase.text);
                console.log('mood: '+ data.phrase.mood);
                // console.log('max: '+ data.phrase.max);      //  se non è max è undefined o null
                var statement   = data.phrase.text;
                var mood        = data.phrase.mood;
                //  dopo 3 secondi fabryz parla
                window.setTimeout(function() {
                    showFabryzAnimation();
                    window.setTimeout(function(){ 
                        changeMood(mood);
                        changeStatement(statement);
                        window.setTimeout(function() {
                            // fadeout frase e svuota contenitore
                            $statementCt.fadeOut(350, function(){
                                changeStatement('<p></p>');
                            });
                        }, 10000);
                    }, 5000); //questi sono i secondi di durata della gif
                    
                    
                    // fadein frase
                    $statementCt.fadeIn(350);
                }, 2000); // sono i secondi per l'aspetta
            });
        }

        //  quando faccio click sul nome
        $('.click-nome').on('click', function() {
            console.log(this);
            if ($(this).hasClass('.active')) {
                $('.nome').animate ({
                    opacity: 0
                }, 1000);
                $(this).removeClass('.active');
            } else {
                $('.nome').animate ({
                    opacity: 1
                }, 1000);
                $(this).addClass('.active');
            }
        });

        //  quando faccio click su uno dei pulsanti numerati in alto a sinistra
        $('.bottoni p').on('click', function() {
            var numero = $(this).html();
            $('img#codello').attr('src', '/img/'+numero+'.jpg');
        });

        //  Inizia la lettura dei valori
        startSocketListening();
        startNamasteListening();

    });


    //  ???
    $('.stati span').on('click', function() {
        var stato = $(this).attr('valore');
        riempi(stato);
    });

    //  anima la colonna a destra con il valore ricevuto
    function riempi(valore) {
        valore = valore - 100;
        if( valore<0 ) {
            valore == 0;
        }
        $('.colonna').animate({
            height : valore
        }, 100);
    }


    //////////////////
    //  FUMO
    //////////////////

    function initFumo() {
        // When the window has loaded, DOM is ready. Run the draw() function.
        // Create an array to store our particles
        var particles = [];

        // The amount of particles to render
        var particleCount = 30;

        // The maximum velocity in each direction
        var maxVelocity = 2;

        // The target frames per second (how often do we want to update / redraw the scene)
        var targetFPS = 33;

        // Set the dimensions of the canvas as variables so they can be used.
        var canvasWidth = 1200;
        var canvasHeight = 500;

        // Create an image object (only need one instance)
        var imageObj = new Image();

        // Once the image has been downloaded then set the image on all of the particles
        imageObj.onload = function() {
            particles.forEach(function(particle) {
                    particle.setImage(imageObj);
            });
        };

        // Once the callback is arranged then set the source of the image
        imageObj.src = "http://www.blog.jonnycornwell.com/wp-content/uploads/2012/07/Smoke10.png";

        // A function to create a particle object.
        function Particle(context) {

            // Set the initial x and y positions
            this.x = 0;
            this.y = 0;

            // Set the initial velocity
            this.xVelocity = 0;
            this.yVelocity = 0;

            // Set the radius
            this.radius = 5;

            // Store the context which will be used to draw the particle
            this.context = context;

            // The function to draw the particle on the canvas.
            this.draw = function() {
                
                // If an image is set draw it
                if(this.image){
                    this.context.drawImage(this.image, this.x-128, this.y-128);         
                    // If the image is being rendered do not draw the circle so break out of the draw function                
                    //return;
                }
                // Draw the circle as before, with the addition of using the position and the radius from this object.
                // this.context.beginPath();
                // this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
                // this.context.fillStyle = "rgba(0, 255, 255, 1)";
                // this.context.fill();
                // this.context.closePath();
            };

            // Update the particle.
            this.update = function() {
                // Update the position of the particle with the addition of the velocity.
                this.x += this.xVelocity;
                this.y += this.yVelocity;

                // Check if has crossed the right edge
                if (this.x >= canvasWidth) {
                    this.xVelocity = -this.xVelocity;
                    this.x = canvasWidth;
                }
                // Check if has crossed the left edge
                else if (this.x <= 0) {
                    this.xVelocity = -this.xVelocity;
                    this.x = 0;
                }

                // Check if has crossed the bottom edge
                if (this.y >= canvasHeight) {
                    this.yVelocity = -this.yVelocity;
                    this.y = canvasHeight;
                }
                
                // Check if has crossed the top edge
                else if (this.y <= 0) {
                    this.yVelocity = -this.yVelocity;
                    this.y = 0;
                }
            };

            // A function to set the position of the particle.
            this.setPosition = function(x, y) {
                this.x = x;
                this.y = y;
            };

            // Function to set the velocity.
            this.setVelocity = function(x, y) {
                this.xVelocity = x;
                this.yVelocity = y;
            };
            
            this.setImage = function(image){
                this.image = image;
            }
        }

        // A function to generate a random number between 2 values
        function generateRandom(min, max){
            return Math.random() * (max - min) + min;
        }

        // The canvas context if it is defined.
        var context;

        // Initialise the scene and set the context if possible
        function init() {
            var canvas = document.getElementById('myCanvas');
            if (canvas.getContext) {

                // Set the context variable so it can be re-used
                context = canvas.getContext('2d');

                $(canvas).width(window.innerWidth);
                $(canvas).height(window.innerHeight);

                // Create the particles and set their initial positions and velocities
                for(var i=0; i < particleCount; ++i){
                    var particle = new Particle(context);
                    
                    // Set the position to be inside the canvas bounds
                    particle.setPosition(generateRandom(0, canvasWidth), generateRandom(0, canvasHeight));
                    
                    // Set the initial velocity to be either random and either negative or positive
                    particle.setVelocity(generateRandom(-maxVelocity, maxVelocity), generateRandom(-maxVelocity, maxVelocity));
                    particles.push(particle);            
                }
            }
            else {
                alert("Please use a modern browser");
            }
        }

        $(window).resize(function() {
            var canvas = document.getElementById('myCanvas');

            $(canvas).width(window.innerWidth);
            $(canvas).height(window.innerHeight);
        });

        // The function to draw the scene
        function draw() {
            // Clear the drawing surface and fill it with a black background
            context.fillStyle = "rgba(0, 0, 0, 0.5)";
            context.fillRect(0, 0, 1200, 500);

            // Go through all of the particles and draw them.
            particles.forEach(function(particle) {
                particle.draw();
            });
        }

        // Update the scene
        function update() {
            particles.forEach(function(particle) {
                particle.update();
            });
        }

        // function make_base() {
          base_image = new Image();
          // base_image.src = '/img/fabryz.png';
          base_image.onload = function(){
            context.drawImage(base_image, 100, 100);
          }
        // }

        // Initialize the scene
        init();

        // If the context is set then we can draw the scene (if not then the browser does not support canvas)
        if (context) {
            setInterval(function() {
                context.drawImage(base_image, 100, 100, 300, 300);

                // Update the scene befoe drawing
                update();

                // Draw the scene
                draw();
            }, 1000 / targetFPS);
        }
    }

    var timeoutBonzo = null;

    function startBonzo() {
        timeoutBonzo = setTimeout(function() { animaBonzo() }, 4000);
    }

    function animaBonzo() {        
        $('.codello-container').animate({
            top: '-50px'
        }, 2000, 'swing').animate({
            top: '0px'
        }, 1500, 'swing');

        startBonzo();
    }

//    initFumo();
    animaBonzo();

})(jQuery);