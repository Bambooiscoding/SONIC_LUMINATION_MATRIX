let d = 16;
let l = 32;
let levSm = 0;
let old;
let sliderOne;

function setup() {
  createCanvas(1440, 1080, WEBGL);
  pixelDensity(1);
  imageMode(CENTER);
  cam = createCapture(VIDEO);
  cam.size(640, 480);
  cam.hide();
  old = createImage(640,480);
  mic = new p5.AudioIn();
  userStartAudio();
  mic.start(); 
  sliderOne = createSlider(2, 30, 16);
  sliderOne.parent("slider-holder");
}


function draw() {
  background(0);
  d = sliderOne.value();
  // orbitControl();
  let t = frameCount*0.02;
  let level = mic.getLevel()
  levSm = lerp(levSm, level, 0.8);
  push();
  if(levSm>0.01){
    scale(map(abs(sin(t)),0,1,1,1.2));
  }
  let rot = map(levSm, 0.001, 0.15, -PI/4, PI/4);

  cam.loadPixels();
  old.loadPixels();
  translate(-cam.width / 2, -cam.height / 2, 0);

  for (let y = 0; y < cam.height; y = y + l) {
      for (let x = 0; x < cam.width; x = x + l) {
          for (let z = 0; z < l * 10; z = z + l) {
            let p = (x + y * cam.width) * 4;
            let r = cam.pixels[p];
            let g = cam.pixels[p + 1];
            let b = cam.pixels[p + 2];
            let br = (r * 2 + g * 3 + b) / 6;
            let a = br * map(z, 0, 360, 2, 0.001) * map(levSm,0.001,0.1,0.001,2);
            let oldR = old.pixels[p];
            let oldG = old.pixels[p + 1];
            let oldB = old.pixels[p + 2];
            let oldBr = (oldR * 2 + oldG * 3 + oldB) / 6;
            sliderOne.value(map(br, 0, 255, 2, 30));
            let motion = abs(oldBr - br);
            push();
            translate(x + l/2, y + l/2, z + l/2)
            rotateX(sin(0.01*(motion + x)));
            rotateY(cos(0.01*(motion + y)));
            cube(r, g, b, a);
            pop();
            }
        }
    }
  cam.updatePixels();
  pop();
}

function cube(r, g, b, a) {  
  noStroke();
  for(let i=0;i<6;i++){
    if(i%2==0){
      rotateX(PI/2);
    }else{
      rotateY(PI/2);
    }
    push();
    fill(r, g, b, a);
    translate(0,0,-d/2);
    plane(d, d);
    pop();
  } 
}
