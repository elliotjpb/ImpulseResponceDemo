let sound, env, cVerb, fft;
let currentIR = 0;
let rawImpulse;
let usingImpulse = false;

function preload() {
  soundFormats('wav');
  
  // create a p5.Convolver
  cVerb = createConvolver('assets/slinky.wav');
  
  //adding impulses 
  cVerb.addImpulse('assets/small-plate.wav');
  cVerb.addImpulse('assets/concrete-tunnel.wav');
  cVerb.addImpulse('assets/turbine-hall.wav');
  cVerb.addImpulse('assets/york-minster.wav');
  
  // Sound that will be processed and a duplicate for comparison.
  sound = loadSound('assets/main-sound.wav');
  soloSound = loadSound('assets/main-sound.wav');
}

function setup() {
  createCanvas(900, 500);
  rawImpulse = loadSound('assets/' + cVerb.impulses[currentIR].name);
  // disconnect from master output...
  sound.disconnect();
  // ... and process with convolution
  // so that we only hear the reverb
  cVerb.process(sound);

  fft = new p5.FFT();
}

function draw() {
  background(30);
  
  	textSize(11);
	text('Press the mouse to get started, and change between the Impulse responses', 400, 60);
	fill(255);
	text('Tap the Space Bar to hear the current Impulse response', 400, 80);
	fill(255);
	text('Tap the \'o\' key to toggle between the original sound and original sound with the convolution.', 400, 100);
	fill(255);
  
  if(usingImpulse){
  	textSize(20);
	text('Current Impulse Response: ' + cVerb.impulses[currentIR].name, 400, 30);
	fill(255);
  } else if(!usingImpulse) {
  	textSize(20);
	text('Original sound playing only', 400, 30);
	fill(255);
  }
  
  let spectrum = fft.analyze();
  // Draw every value in the frequencySpectrum array as a rectangle
  noStroke();
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, (width/2));
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, (width/2) / spectrum.length, h);
  }
}

function mousePressed() {

if(!usingImpulse) {
	
	sound.stop();
	soloSound.stop();
	
	sound.play();
    sound.setVolume(0);
    //Play main sound separately muted for comparison later
    soloSound.play();
    soloSound.setVolume(1);
} else if (usingImpulse){

	sound.stop();
	soloSound.stop();
	// cycle through the array of cVerb.impulses
  currentIR++;
  if (currentIR >= cVerb.impulses.length) {
    currentIR = 0;
  }
  cVerb.toggleImpulse(currentIR);
  // play the sound through the impulse
  sound.play();
  sound.setVolume(1);
  //Play main sound separately muted for comparison later
  soloSound.play();
  soloSound.setVolume(0);

  console.log('Convolution Impulse Response: ' + cVerb.impulses[currentIR].name);
  rawImpulse.setPath('assets/' + cVerb.impulses[currentIR].name);
}
  
}

function keyPressed() {
	
	//tap 'space' to hear just impulse response
	if (keyCode === 32) {
		rawImpulse.play();
	}
	
	//tap 'o' to toggle between original sound and original sound with the convolution.
	if (keyCode === 79) {
		if(usingImpulse) {
			sound.setVolume(0);
			soloSound.setVolume(1);
			usingImpulse = false;
		} else if (!usingImpulse) {
			soloSound.setVolume(0);
			sound.setVolume(1);
			usingImpulse = true;
		}

	}
}
