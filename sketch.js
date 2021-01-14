let sound, env, cVerb, fft;
let currentIR = 0;
let rawImpulse;
let uImpulse = true;

function preload() {
  // we have included both MP3 and OGG versions of all the impulses/sounds
  soundFormats('mp3', 'ogg');
  // create a p5.Convolver
  cVerb = createConvolver('assets/bx-spring');
  cVerb.addImpulse('assets/small-plate');
  cVerb.addImpulse('assets/concrete-tunnel');
  // load a sound that will be processed by the p5.ConvultionReverb
  sound = loadSound('assets/main-sound');
  soloSound = loadSound('assets/main-sound');
}

function setup() {
  createCanvas(900, 500);
  rawImpulse = loadSound('assets/' + cVerb.impulses[currentIR].name);
  // disconnect from master output...
  sound.disconnect();
  // ... and process with cVerb
  // so that we only hear the reverb
  cVerb.process(sound);

  fft = new p5.FFT();
}

function draw() {
  background(30);
  
  if(uImpulse){
  	textSize(20);
	text('Current Impulse Response: ' + cVerb.impulses[currentIR].name, 400, 30);
	fill(255);
  } else {
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

function keyPressed() {
	
	//tap 'space' to hear just impulse response
	if (keyCode === 32) {
		rawImpulse.play();
	}
	
	//tap 'o' to toggle between original sound and original sound with the convolution.
	if (keyCode === 79) {
		if(uImpulse) {
			uImpulse = false;
			sound.setVolume(0);
			soloSound.setVolume(1);
		} else if (!uImpulse) {
			uImpulse = true;
			soloSound.setVolume(0);
			sound.setVolume(1);
		}

	}
}
