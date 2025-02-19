const canvas = document.getElementById('Metaverse_canvas');
const context = canvas.getContext('2d');

canvas.width = 1700;
canvas.height = 800;

const collisionMap = [];
for (let i = 0; i < collisions.length; i += 70) { //TODO: changeable (based on the tiles chosen after creating the map) (map > resize map > width)
    collisionMap.push(collisions.slice(i, i + 70)); //TODO: changeable (based on the tiles chosen after creating the map) (map > resize map > width)
}

const boundaries = [];
const offset = { x: -500, y: -120 }; //TODO: changeable (position of the played you want it to spawn (spawn point))

collisionMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) // 1025 is the symbol of collision 
            boundaries.push(
            new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            })
        );
    });
});

//player images //TODO: (add diagonal photos)
const playerDown = new Image();
playerDown.src = './image/Players/playerDown.png';
const playerUp = new Image();
playerUp.src = './image/Players/playerUp.png';
const playerRight = new Image();
playerRight.src = './image/Players/playerRight.png';
const playerLeft = new Image();
playerLeft.src = './image/Players/playerLeft.png';


// map & foreground images
const foregroundImage = new Image();
foregroundImage.src = './image/Maps/Forest-Small-Foreground.png';
const mapImage = new Image();
mapImage.src = './image/Maps/Forest-Small.png';

// player definition
const player = new Sprite({
    position: { //TODO: changeable (based of the width and height of the photo)
        x: canvas.width / 2 - 192 / 4 / 2, // 192 = width of the player png & division by 4 since there is 4 animation 
        y: canvas.height / 2 - 68 / 2 // 68 = height of the player png
    },
    image: playerDown,
    frames: { max: 4 }, //TODO: changeable (based on how many frames does the picture have)
    Sprite: {
        up: playerUp,
        left: playerLeft,
        right: playerRight,
        down: playerDown
    }
});

// map Image definition 
const background = new Sprite({
    position: { x: offset.x, y: offset.y },
    image: mapImage
});

// foreground map Image definition 
const foreground = new Sprite({
    position: { x: offset.x, y: offset.y },
    image: foregroundImage
});

// keys definition 
const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false }
};

// items that should move when key is pressed
const movable = [background, ...boundaries, foreground];

// Check collision between player and boundaries
function rectangularCollision({ rectangle1, rectangle2 }) {
    return ( //TODO: changeable (-10 is a number of pixels that allows the player to walk into the boundaries)
        rectangle1.position.x + rectangle1.width - 10 >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width - 10 &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height - 10 &&
        rectangle1.position.y + rectangle1.height - 10 >= rectangle2.position.y
    );
}

// Main animation loop
function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas to avoid ghosting

    // Draw items
    background.draw();
    boundaries.forEach(boundary => boundary.draw());
    player.draw();
    foreground.draw();

    player.moving = false;
    let speed = 2; //TODO: changeable (speed of the player)
    let moving = true;

    player.image = player.Sprite.down;

    const diagonalMoving = (keys.w.pressed || keys.s.pressed) && (keys.a.pressed || keys.d.pressed);
    if (diagonalMoving) speed = speed / 1.5; // speed for diagonal movement

    // movement based on WASD
    if (keys.w.pressed) {
        player.moving = true; // checks if player is moving (for animation)
        player.image = player.Sprite.up; // set the player image (-up-,down,right,left)
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({ // checking if the player touching the collision (prediction)
                    rectangle1: player,
                    rectangle2: {...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + speed
                        }
                    }
                })) {
                moving = false;
                break;
            }
        }
        if (moving) movable.forEach(movable => { movable.position.y += speed; });
    }

    if (keys.s.pressed) {
        player.moving = true; // checks if player is moving (for animation)
        player.image = player.Sprite.down; // set the player image (-up-,down,right,left)
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({ // checking if the player touching the collision (prediction)
                    rectangle1: player,
                    rectangle2: {...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - speed
                        }
                    }
                })) {
                moving = false;
                break;
            }
        }
        if (moving) movable.forEach(movable => { movable.position.y -= speed; });
    }

    if (keys.d.pressed) {
        player.moving = true; // checks if player is moving (for animation)
        player.image = player.Sprite.right; // set the player image (-up-,down,right,left)
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({ // checking if the player touching the collision (prediction)
                    rectangle1: player,
                    rectangle2: {...boundary,
                        position: {
                            x: boundary.position.x - speed,
                            y: boundary.position.y
                        }
                    }
                })) {
                moving = false;
                break;
            }
        }
        if (moving) movable.forEach(movable => { movable.position.x -= speed; });
    }

    if (keys.a.pressed) {
        player.moving = true; // checks if player is moving (for animation)
        player.image = player.Sprite.left; // set the player image (-up-,down,right,left)
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({ // checking if the player touching the collision (prediction)
                    rectangle1: player,
                    rectangle2: {...boundary,
                        position: {
                            x: boundary.position.x + speed,
                            y: boundary.position.y
                        }
                    }
                })) {
                moving = false;
                break;
            }
        }
        if (moving) movable.forEach(movable => { movable.position.x += speed; });
    }
    window.requestAnimationFrame(animate);

}

animate();


// Event listeners for key press
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true;
            break;
        case 'a':
            keys.a.pressed = true;
            break;
        case 's':
            keys.s.pressed = true;
            break;
        case 'd':
            keys.d.pressed = true;
            break;
    }
});

// Event listeners for key release
window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
});