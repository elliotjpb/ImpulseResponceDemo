let sound, env, cVerb, fft;
let currentIR = 0;
let rawImpulse;

var leftSide;
var rightSide;

let radio;

function preload() {
  // we have included both MP3 and OGG versions of all the impulses/sounds
  soundFormats('mp3', 'ogg');

  // create a p5.Convolver
  cVerb = createConvolver('assets/bx-spring');
  cVerb.addImpulse('assets/small-plate');
  cVerb.addImpulse('assets/concrete-tunnel');

  // load a sound that will be processed by the p5.ConvultionReverb
  sound = loadSound('assets/main-sound');
}

function setup() {
  //main canvas
  	createCanvas(800, 400);
  
  	radio = createRadio();
  	radio.option('Spring');
  	radio.option('Concrete');
  	radio.option('Plate');
  	radio.position(0, 0);
  	
  //each side of the canvas
  leftSide = createGraphics(400, 400);
  rightSide = createGraphics(400, 400);
  
  rawImpulse = loadSound('assets/' + cVerb.impulses[currentIR].name);

  // disconnect from master output...
  sound.disconnect();
  // ... and process with cVerb
  // so that we only hear the reverb
  cVerb.process(sound);

  fft = new p5.FFT();
}

function draw() {
	
	drawLeft();
	drawRight();
	
	image(leftSide, 400, 0);
	image(rightSide, 0, 0);
	
	chosenImpulse();
	
}

function drawLeft() {
  leftSide.background(30);
  leftSide.fill(0, 255, 40);
  let spectrum = fft.analyze();
  // Draw every value in the frequencySpectrum array as a rectangle
  leftSide.noStroke();
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    leftSide.rect(x, height, width / spectrum.length, h);
  }  
}

function drawRight() {
	rightSide.background(100);
	
	button = createButton('Stop all');
  	button.position(19, 100);
  	
  	button = createButton('Play');
  	button.position(90, 100);
  	
  	button = createButton('Play Spring impulse only');
  	button.position(19, 120);
  	
  	button = createButton('Play Small Plate impulse only');
  	button.position(19, 140);
  	
  	button = createButton('Play Concrete Tunnel impulse only');
  	button.position(19, 160);
  	
  	button = createButton('Play main sound only');
  	button.position(19, 180);
  	
  	
}

function chosenImpulse() {

let val = -10;

switch(radio.value()) {
	
	case 'Spring':
		val = 2;
		break;
	case 'Concrete':
		val = 1;
		break;
	case 'Plate':
		val = 0;
		break;
	default:
		val = -10;
}

if(val >= 0) {
	currentIR = val;
   	cVerb.toggleImpulse(currentIR);
  	// play the sound through the impulse
  	sound.play();
  	
  	}

  // display the current Impulse Response name (the filepath)
  console.log('Convolution Impulse Response: ' + cVerb.impulses[currentIR].name);

  rawImpulse.setPath('assets/' + cVerb.impulses[currentIR].name);
}