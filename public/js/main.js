(function($){

    //////////////////////
    //  RICEZIONE DATI
    //////////////////////

    $(function() {
        // inizializza Woolyarn
    	Woolyarn.init();

    	var socket          = Woolyarn.getSocket();

        var previousDataArduino = 'diocan';
        var previousDataHigh = 'tette';

        var $doc  = $(document);
        var $win  = $(window);
        var $html = $('html');
        var $body = $('body');
        var $fabryzWaitingCt    = $body.find('.fabryz-waiting').eq(0); 
        var $fabryzComeCloserCt = $body.find('.fabryz-come_closer').eq(0); 
        var $fabryzThinkingCt   = $body.find('.fabryz-thinking').eq(0); 
        var $fabryzSayingCt     = $body.find('.fabryz-saying').eq(0); 

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
                            $obj[i].addClass('hidden').removeClass('invisible');
                        });
                    }
                } else {
                    $obj.addClass('invisible').transitionEnd(function () {
                        $obj[i].addClass('hidden').removeClass('invisible');
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
            crossDiv($fabryzWaitingCt, [$fabryzComeCloserCt, $fabryzThinkingCt, $fabryzSayingCt]);
        };

        //  mostra fabryz che dice di avvicinarsi
        function showFabryzComeCloser() {
            crossDiv($fabryzComeCloserCt, [$fabryzWaitingCt, $fabryzThinkingCt, $fabryzSayingCt]);
        };

        //  mostra fabryz che pensa
        function showFabryzThinking() {
            crossDiv($fabryzThinkingCt, [$fabryzWaitingCt, $fabryzComeCloserCt, $fabryzSayingCt]);
        };

        //  mostra fabryz che dice la frase
        function showFabryzSaying() {
            crossDiv($fabryzSayingCt, [$fabryzWaitingCt, $fabryzComeCloserCt, $fabryzThinkingCt]);
        };


        //  decide che funzione assegnare a ciascun stato
        function switchState(s) {
            var state = s;
            console.log('Valore interpretato: ', state, ' di tipo: ', (typeof state));

            switch(state) {
                case '0':     //  fabryz è in attesa
                    console.log('Waiting');
                    showFabryzWaiting();
                break;
                case '1':     //  fabryz dice di avvicinarsi
                    console.log('ComeCloser');
                    showFabryzComeCloser();
                break;
                case '2':     //  fabryz pensa
                    console.log('Thinking');
                    showFabryzThinking();
                break;
                default:
                    console.log('default-Waiting');
                    showFabryzWaiting();
            }
        };

        //  quando ricevo un valore in lettura da arduino
    	Woolyarn.socket.on('arduino', function(data) {
            if (!data || data.value == previousDataArduino) {
                previousDataArduino = data.value;
                return false;
            }
            previousDataArduino = data.value;

            console.log('Valore da arduino: ', data.value, ' di tipo: ', (typeof data.value));
            $("#currentValue").html(JSON.stringify(data));
            switchState(JSON.stringify(data.value));
    	});

        //  quando ricevo un valore in lettura dalla barra capacitiva
        Woolyarn.socket.on('capacitiveBar', function(data) {
            if (!data || data.high == previousDataHigh) {
                previousDataHigh = data.high;
                return false;
            }
            previousDataHigh = data.high;

            console.log('Value arrived from capacitiveBar: '+ data.high);
            arduinoValue = data.high;
            riempi(arduinoValue);
        });

        //quando ricevo la frase
        Woolyarn.socket.on('namaste', function(data) {
            console.log('Frase: '+ data.phrase.text);
            console.log('Mood: '+ data.phrase.mood);
            console.log('Max: '+ data.phrase.max); //nullo tranne nella frase di max in cui è valorizzat a "max"
            //$("#currentValue").html(JSON.stringify(data));
        });

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
