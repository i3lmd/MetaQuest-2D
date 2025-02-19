class Sprite {
    constructor({ position, image, velocity, frames = { max: 1 }, Sprite }) {
        this.position = position;
        this.image = image;
        this.frames = {...frames, val: 0, elapsed: 0 };
        this.velocity = velocity;
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
            console.log(this.width)
            console.log(this.height)
        }
        this.moving = false
        this.Sprite = Sprite
    }

    draw() {
        context.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        );
        if (!this.moving) { return (this.frames.val = 0) }
        if (this.frames.max > 1) this.frames.elapsed++;
        if (this.frames.elapsed % 20 === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++;
            else this.frames.val = 0
        }


    }
}

class Boundary { //TODO: changeable (num of pixels * number of zoom of tile(bottom right))
    static width = 54
    static height = 54
    constructor({ position }) {
        this.position = position
        this.width = 54
        this.height = 54
    }

    draw() {
        context.fillStyle = 'rgba(255,0,0,0)'
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}