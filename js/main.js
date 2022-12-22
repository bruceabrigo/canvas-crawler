//requirements anad goals
// make a simple crawler game using canvas that we manupulate in js

// we need two entities, a hero and ogre
// the hero should move with WASD or ARROW
// the ogre(for now) will be staionary
// the hero and the ogre should bel able to collide to make something happen
// when the hero collides with the ogre, ogre is removed from the screen, the game stops, and sends s message to the user they have won

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

// const hero = {
//   x: 10,
//   y: 10,
//   color: 'hotpink',
//   width: 20,
//   height: 20,
//   alive: true,
//   render: function() {
//     // use built in canvas mehtods for drawing basic shapes
//     ctx.fillStyle = this.color
//     ctx.fillRect(this.x, this.y, this.width, this.height)
//   }
// }

// const ogre = {
//   x: 200,
//   y: 100,
//   color: '#bada55',
//   width: 60,
//   height: 120,
//   alive: true,
//   render: function () {
//     ctx.fillStyle = this.color
//     //this built in function creates a rectangle
//     //must pass following args in the following order:
//     //x coordinate, y coordinate, width in px, height in px
//     ctx.fillRect(this.x, this.y, this.width, this.height)
//   }
// }

/////////// CRAWLER CLASS ///////////

// since these two objects are basically the same, we can create a class to keep our code DRY
class Crawler { 
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

const player = new Crawler(10, 10, 16, 16, 'lightsteelBlue')
const ogre = new Crawler(200, 50, 32, 48, '#bada55')

// player.render()
ogre.render()

/////////// MOVEMENT  ///////////
// our movement handler function tells ours code how and when to move the player around
// this will be tied to an event listener for key events
const movementHandler = (e) => {
  // here the e is standing for an event: specifcally will be a key down event
  // were going to use key codes to tell it to do different movements for different keys
  // here are some basic key codes
  // w = 87, a = 65, s = 83, d = 68
  // up = 38, left = 37, down = 40, right = 39
  // by linking these key codes to a function or code block we can tell them to change the player x or y values
  console.log('what the heck is e', e.keyCode)
  // condition statement if keycode === something do something if keycode === somethingElse do something Else
  // could build a giant if...else for this 
  // instead we'll use a switch case
  // switch is my condition, and iti opens up for a multitude of cases
  switch (e.keyCode) {
    // move up
    // move left
    // move down
    // move right
    case (87):
    case(38):
      // this moves player up 10px every press
      player.y -= 10
      break 
    // move left
    case (65):
    case(37):
      player.x -= 10
      break
    // move down
    case(83):
    case(40):
      player.y += 10
      break
    // more right
    case(68):
    case(39):
      player.x += 10
      break
  }
}

/////////// Collision Detection ///////////
// here we'll detect a hit between entities
// to accurately do this, we need to account for the entire space tha tone entity takes up.
// this means using player x, y, height, width
// this also means using ogre x, y, height, width
const detectHit = () => {
  // well basically use a big if statement, to be able to tell if any of the sides of our hero interact with any of the sides of our ogre
  if(player.x < ogre.x + ogre.width //if player player coord then mark a hit 
    && player.x + player.width > ogre.x
    && player.y < ogre.y + ogre.height
    && player.y + player.height > ogre.y) {
      // console.log('HIT')
      // console.log('player x-> ', player.x)
      // console.log('player y-> ', player.y)
      // console.log('ogre x -> ', ogre.x)
      // console.log('ogre y-> ', ogre.y)

      status.textContent = 'We have a hit!'
      ogre.alive = false
      status.textContent = 'You Win'
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
  if(ogre.alive) {
    detectHit() //calls back to detect hit function 
  }

  // to resemble movement we should clear the old canvas every loop
  // then instead of drawing a snake, because its maintaining all the old positions of our character
  // well just see our player square moving around 
  ctx.clearRect(0, 0, game.width, game.height)

  player.render()
  movement.textContent = `${player.x}, ${player.y}`

  if(ogre.alive) { 
    ogre.render()
  }
}

/////////// GAME LOOP ///////////

// here we'll add an event listener, when the DOMcontent loads, run the game on an interval
// eventually this even will have more in it
document.addEventListener('DOMContentLoaded', function () {
  // this is where we link up the movementHandler event
  document.addEventListener('keydown', movementHandler) //pass func def to key event
  // here is our game loop interval
  setInterval(gameLoop, 60)
})