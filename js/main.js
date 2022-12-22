//this version incorportates smoother movement, and a more open ended collision detection 
// this also has a second enemy to face, which creates a new win condition(kill two ogres)

//requirements anad goals
// make a simple crawler game using canvas that we manupulate in js

/////////// Rules for the Game ///////////
// we need two entities, a hero and ogre
// the hero should move with WASD or ARROW
// the ogre(for now) will be staionary
// the hero and the ogre should bel able to collide to make something happen
// when the hero collides with the ogre, ogre 1 is removed from the screen, and ogre 2 appears.
// 


/////////// Initial Setup ///////////
// first grab our HTML elements for easy reference later
const game = document.getElementById('canvas')
const movement = document.getElementById('movement')
const status = document.getElementById('status')

// we need to set the games context to be 2d
// we also need to save that context to a variable to reference later
// this is how we tell the code to work within the context of the canvas 
const ctx = game.getContext('2d') 

console.log('game fore setting width and height', game)
// one thing we need to do is to get the computed size of our canvas
// then we save that attributes to our canvas so we can refer to it later
// once we have the exact size of our canvas, we can use those dimension to simulate our movement in interesting ways. 
// these two lines will set the width and height attributes
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])
game.height = '360'

console.log('this is game after setting the width and height')
console.log(game)

/////////// CRAWLER CLASS ///////////

// since these two objects are basically the same, we can create a class to keep our code DRY
class Ogre { 
  constructor(x, y, width, height, color) {
    this.y = y
    this.x = x
    this.width = width
    this.height = height 
    this.color = color
    this.alive = true;
    this.render = function () {
      ctx.fillStyle = this.color
      ctx.fillRect(this.x, this.y, this.width, this.height)
    }
  }
}

class Hero { 
  constructor(x, y, width, height, color) {
    this.y = y
    this.x = x
    this.width = width
    this.height = height 
    this.color = color
    this.alive = true;
    // we need additional props on our hero class to make movement smoother
    this.speed = 15
    // now well add directions, which will be set with our move handler
    this.direction = {
      up: false,
      down: false,
      left: false,
      right: false
    }
    // two other methods tied to key events
    // one sets the direction, which sends our hero flying in that direction
    this.setDirection = function (key) {
        console.log('this is the key in setDirection', key)
        if (key.toLowerCase() == 'w') { this.direction.up = true }
        if (key.toLowerCase() == 'a') { this.direction.left = true }
        if (key.toLowerCase() == 's') { this.direction.down = true }
        if (key.toLowerCase() == 'd') { this.direction.right = true }
    }
    // the other unsets that direction, which stops our hero from moving in that direction
        this.unsetDirection = function (key) {
      console.log('this is the key in unsetDirection', key)
      if (key.toLowerCase() == 'w') {this.direction.up = false}
      if (key.toLowerCase() == 'a') {this.direction.left = false}
      if (key.toLowerCase() == 's') {this.direction.down = false}
      if (key.toLowerCase() == 'd') {this.direction.right = false}
    }
    // this is our new movementHandler, well get rid of the old one
    // this will allow us to use the direction property on our hero object
    this.movePlayer = function () {
      // send our guy flying in whatever direction is true
      if (this.direction.up ) {
        this.y -= this.speed
        // while were tracking movement, lets wall off the sides of the canvas
        if(this.y <= 0) {
          this.y = 0
        }
      }
      if (this.direction.left ) {
        this.x -= this.speed

        if(this.x <= 0) {
          this.x = 0
        }
      }
      if (this.direction.down ) {
        this.y += this.speed
        // to step down and right direction, we again have to account for the size of our player
        if(this.y + this.height >= game.height) {
          this.y = game.height - this.height
        }
      }
      if (this.direction.right ) {
        this.x += this.speed

        if(this.x + this.width >= game.width) {
          this.x = game.width - this.width
        }
      }

    }

    this.render = function () {
      ctx.fillStyle = this.color
      ctx.fillRect(this.x, this.y, this.width, this.height)
    }
  }
}

const getRandomCoordinates = (max) => {
  //well use math.random to produce a random number
  return Math.floor(Math.random()* max)
}

const player = new Hero(10, 10, 16, 16, 'lightsteelBlue')
const ogre = new Ogre(200, 50, 32, 48, '#bada55')
const ogre2 = new Ogre(getRandomCoordinates(game.width), getRandomCoordinates(game.height), 64, 96, 'red')

// player.render()
ogre.render()



/////////// Collision Detection ///////////
// here we'll detect a hit between entities
// to accurately do this, we need to account for the entire space tha tone entity takes up.
// this means using player x, y, height, width
// this also means using ogre x, y, height, width
const detectHit = (thing) => {
  // well basically use a big if statement, to be able to tell if any of the sides of our hero interact with any of the sides of our ogre
  if(player.x < thing.x + thing.width //if player player coord then mark a hit 
    && player.x + player.width > thing.x
    && player.y < thing.y + thing.height
    && player.y + player.height > thing.y) {

      status.textContent = 'We have a hit!'
      thing.alive = false
      
    }
}

/////////// GAME LOOP ///////////

// were going to setup a game loop function 
// this will be attached to an interval 
// this function will run every interval(amount of milliseconds)
// this is how we will animate our game


const gameLoop = () => {
  // no console.logs in here if you can avoid
  //for testing, its okay to add them but final should not have any

  // putting our hit detection at the top so it takes precedence
  ctx.clearRect(0, 0, game.width, game.height)
  if(ogre.alive) {
    ogre.render()
    detectHit(ogre) //calls back to detect hit function 
  } else if (ogre2.alive) {
    status.textContent = 'Now kill Shrek 2!'
    ogre2.render()
    detectHit(ogre2)
  } else {
    status.textContent = 'You Win!'
    stopGameLoop()
  }

  // to resemble movement we should clear the old canvas every loop
  // then instead of drawing a snake, because its maintaining all the old positions of our character
  // well just see our player square moving around 

  player.render()
  player.movePlayer()
  movement.textContent = `${player.x}, ${player.y}`
}

/////////// EVENT LISTENERS ///////////

// one key event for a key down
// keydown will set a players direction
document.addEventListener('keydown', (e) => {
  // when a key is pressed set the appropriate direction
  player.setDirection(e.key)
})
// one key event for a key up
// keyup, will unset a players direction
document.addEventListener('keyup', (e) => {
  // when a key is released call unsetDirection
  // this needs to be handled in a slightly way
  if (['w', 'a', 's', 'd'].includes(e.key)) {
    player.unsetDirection(e.key)
  }
})

// were going to save our game interavel to a varaible so we can stop it when we want to 
// this interal runs the game loop every 60ms until we tell it to stop
const gameInterval = setInterval(gameLoop, 60)
//fn that stops game loop
const stopGameLoop = () => {clearInterval(gameInterval)}

// here we'll add an event listener, when the DOMcontent loads, run the game on an interval
// eventually this even will have more in it
document.addEventListener('DOMContentLoaded', function () {
  
  // here is our game loop interval

})