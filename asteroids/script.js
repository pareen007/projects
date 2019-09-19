let ship;
let asteroids = [];
let lasers = [];
function setup() {
  createCanvas(windowWidth, windowHeight);
  ship = new Ship();
  for (let i = 0; i < 5; i++) asteroids.push(new Asteroid());
}
function draw() {
  background(0);
  for (let i = 0; i < asteroids.length; i++) {
    if(ship.hits(asteroids[i])){
        // Game Over
    }
    asteroids[i].render();
    asteroids[i].update();
    asteroids[i].edges();
  }
  for (let i = lasers.length - 1; i >= 0; i--) {
    lasers[i].render();
    lasers[i].update();
    for (let j = asteroids.length - 1 ; j >= 0; j--) {
      if (lasers[i].hits(asteroids[j])) {
        if(asteroids[j].r > 10){
            let newAsteroids = asteroids[j].breakup();
       asteroids = asteroids.concat(newAsteroids)
        } 
        asteroids.splice(j, 1)
        lasers.splice(i, 1)
        break
      }
    }
  }
  ship.render();
  ship.turn();
  ship.update();
  ship.edges();
}

function keyReleased() {
  ship.setRotation(0);
  ship.boosting(false);
}

function keyPressed() {
  if (key === " ") {
    lasers.push(new Laser(ship.pos, ship.heading));
  }
  if (keyCode === RIGHT_ARROW) {
    ship.setRotation(0.1);
  } else if (keyCode === LEFT_ARROW) {
    ship.setRotation(-0.1);
  } else if (keyCode === UP_ARROW) {
    ship.boosting(true);
  }
}

// Ship
class Ship {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.r = 30;
    this.heading = 0;
    this.rotation = 0;
    this.vel = createVector(0, 0);
    this.isBoosting = false;
  }
  hits(asteroid){
      let d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y)
      if(d < this.r + asteroid.r){
          return true
      } else {
          return false
      }
  }
  boosting(b) {
    this.isBoosting = b;
  }
  boost() {
    let force = p5.Vector.fromAngle(this.heading);
    force.mult(0.1);
    this.vel.add(force);
  }
  update() {
    this.pos.add(this.vel);
    if (this.isBoosting) {
      this.boost();
    }
    this.vel.mult(0.99);
  }
  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
  render() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);
    fill(0);
    stroke(255);
    triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
    pop();
  }
  setRotation(a) {
    this.rotation = a;
  }
  turn() {
    this.heading += this.rotation;
  }
}

// Astroids

class Asteroid {
  constructor(pos, r) {
    if(pos){
        this.pos = pos.copy()
    } else{
        this.pos = createVector(random(width), random(height));
    }
    if(r){
        this.r = r * 0.5
    } else{
        this.r = random(5, 25);
    }
   
    this.total = floor(random(5, 15));
    this.offset = [];
    this.vel = p5.Vector.random2D();
    for (let i = 0; i < this.total; i++) {
      this.offset[i] = random(-this.r*0.5, this.r);
    }
  }
  update() {
    this.pos.add(this.vel);
  }
  render() {
    push();
    stroke(255);
    noFill();
    translate(this.pos.x, this.pos.y);
    //ellipse(0,0,this.r * 2 )
    beginShape();
    for (let i = 0; i < this.total; i++) {
      let angle = map(i, 0, this.total, 0, TWO_PI);
      let r = this.r + this.offset[i];
      let x = r * cos(angle);
      let y = r * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
  breakup(){
      let newA = []
      newA[0] = new Asteroid(this.pos, this.r)
      newA[1] = new Asteroid(this.pos, this.r)
      return newA
  }
}

// Laser

class Laser {
  constructor(spos, angle) {
    this.pos = createVector(spos.x, spos.y);
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(10);
  }

  update() {
    this.pos.add(this.vel);
  }
  render() {
    push();
    stroke(255);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
    pop();
  }
  hits(asteroid) {
    let d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < asteroid.r) {
      return true;
    } else {
      return false;
    }
  }
}
