function initEnemy(type, value) {
    let database = {
        enemy: {
            w: 50,
            h: 50,
            hp: 1,
        },
        greenAlien: {
            w: 100,
            h: 50,
            hp: 5
        },
        skullAlien: {
            w: 40,
            h: 50,
            hp: 3
        },
        toothAlien: {
            w: 60,
            h: 60,
            hp: 3
        },
        meteorite: {
            w: 50,
            h: 50,
            hp: 10
        }
    };
    return database[type][value];
}

function Enemy(type, x, y, args) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.w = initEnemy(this.type, "w");
    this.h = initEnemy(this.type, "h");
    this.xVel = 5;
    this.yVel = 5;
    this.maxVel = 10;
    this.expended = false;
    this.hp = 1;
    this.stage = "enter";
    this.patrolFrame = 0;
    this.show = () => {
        ctx.drawImage(img[this.type], this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    };
    this.update = () => {
        if (Math.abs(this.x - p1.x) < 20) {
            this.maxVel = mapNums(this.y, 0, height, 12, 2);
        }
        if (this.x > p1.x) {
            if (this.xVel > -this.maxVel) {
                this.xVel -= 1;
            }
        } else if (this.x < p1.x) {
            if (this.xVel < this.maxVel) {
                this.xVel += 1;
            }
        }
        this.y += this.yVel;
        this.x += this.xVel;
        for (let i = 0; i < bullets.length; i++) {
            if (collision(bullets[i], this)) {
                if (Math.random() > 0.8) {
                    items.push(new Item("bowler", this.x, this.y));
                }
                aud.clone(2);
                booms.push(new Boom(this.x, this.y));
                p1.score += 10;
                bullets[i].expended = true;
                this.expended = true;
            }
        }
        if (collision(this, p1)) {
            p1.hp -= 10;
            booms.push(new Boom(this.x, this.y));
            this.expended = true;
        }
    };
}

function GreenAlien(x, y) {
    this.x = x;
    this.y = y;
    this.w = 100;
    this.h = 50;
    this.yVel = 1;
    this.stage = "enter";
    this.patrolFrame = 0;
    this.hp = 5;
    this.expended = false;
    this.dir = Math.round(Math.random());
    this.show = () => {
        ctx.drawImage(img.greenAlien, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    };
    this.update = () => {
        this[this.stage]();
        for (let i = 0; i < bullets.length; i++) {
            if (collision(this, bullets[i])) {
                this.hp--;
                aud.clone(2);
                bullets[i].expended = true;
                if (this.hp <= 0) {
                    if (Math.random() > 0.8) {
                        let options = ["violin", "sax"];
                        items.push(new Item(options[this.dir], this.x, this.y));
                    }
                    booms.push(new Boom(this.x, this.y));
                    p1.score += 50;
                    this.expended = true;
                }
            }
        }
        if (collision(this, p1)) {
            p1.hp -= 20;
            booms.push(new Boom(this.x, this.y));
            this.expended = true;
        }
        if (this.y > height + this.h) {
            this.expended = true;
        }
    };
    this.enter = () => {
        if (this.y < height * 0.2) {
            this.y += 10;
        } else {
            this.stage = "patrol";
        }
    };
    this.patrol = () => {
        if (this.patrolFrame < 40) {
            if (this.dir === 0) {
                this.x = Math.sin(this.patrolFrame) * width / 3 + width / 2;
                this.y = height * 0.2 + Math.sin(this.patrolFrame / 2) * height / 6;
            } else {
                this.x = -Math.sin(this.patrolFrame) * width / 3 + width / 2;
                this.y = height * 0.2 + (-Math.sin(this.patrolFrame / 2)) * height / 6;
            }
            this.patrolFrame+= 0.1;
        } else {
            this.stage = "charge";
        }
    };
    this.charge = () => {
        if (this.x > p1.x) {
            this.x -= (this.x - p1.x) / 5;
        } else if (this.x < p1.x) {
            this.x += (p1.x - this.x) / 5;
        }
        this.y += this.yVel;
        this.yVel++;
    };
}

function SkullAlien(x, y) {
    this.x = x;
    this.y = y;
    this.w = 40;
    this.h = 50;
    this.yVel = 10;
    this.hp = 3;
    this.expended = false;
    this.show = () => {
        ctx.drawImage(img.skullAlien, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    };
    this.update = () => {
        this.y += this.yVel;
        this.yVel *= 0.95;
        if (this.yVel < 1) this.yVel = 5;
        this.expended = this.y > height + this.h;
        if (collision(this, p1)) {
            this.expended = true;
            p1.hp -= 15;
            booms.push(new Boom(this.x, this.y));
        }
        for (let i = 0; i < bullets.length; i++) {
            if (collision(this, bullets[i])) {
                this.hp--;
                aud.clone(2);
                bullets[i].expended = true;
                if (this.hp <= 0) {
                    if (Math.random() > 0.8) {
                        items.push(new Item("bowler", this.x, this.y));
                    }
                    booms.push(new Boom(this.x, this.y));
                    p1.score += 40;
                    this.expended = true;
                }
            }
        }
    };
}

function ToothAlien(x, y) {
    this.x = x;
    this.y = y;
    this.w = 60;
    this.h = 60;
    this.xVel = 10;
    this.hp = 3;
    this.expended = false;
    this.show = () => {
        ctx.drawImage(img.toothAlien, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    };
    this.update = () => {
        this.y += 8;
        for (let i = 0; i < bullets.length; i++) {
            if (collision(this, bullets[i])) {
                this.hp--;
                aud.clone(2);
                bullets[i].expended = true;
                if (this.hp <= 0) {
                    if (Math.random() > 0.8) {
                        items.push(new Item("bowler", this.x, this.y));
                    }
                    booms.push(new Boom(this.x, this.y));
                    p1.score += 50;
                    this.expended = true;
                }
            }
        }
        if (collision(this, p1)) {
            p1.hp -= 15;
            booms.push(new Boom(this.x, this.y));
            this.expended = true;
        }
        if (this.y > height + this.h) {
            this.expended = true;
        }
        // this.x += this.xVel;
        // if (this.x + this.xVel > p1.x) {
        //     this.xVel = -10;
        // }
        // if (this.x + this.xVel < p1.x) {
        //     this.xVel = 10;
        // }
    };
}

function Meteorite(x, y, speed) {
    this.x = x;
    this.y = y;
    this.w = 50;
    this.h = 50;
    this.speed = speed;
    this.hp = 10;
    this.rot = 0;
    this.expended = false;
    this.show = () => {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot * Math.PI / 180);
        ctx.drawImage(img.meteorite, -this.w / 2, -this.h / 2, this.w, this.h);
        ctx.rotate(-this.rot * Math.PI / 180);
        ctx.translate(-this.x, -this.y);
    };
    this.update = () => {
        this.y += this.speed;
        this.rot ++;
        this.expended = this.y > height + this.h;
        for (let i = bullets.length - 1; i >= 0; i--) {
            if (collision(this, bullets[i])) {
                aud.clone(2);
                bullets[i].expended = true;
                this.hp--;
                if (this.hp <= 0) {
                    items.push(new Item("firstAid", this.x, this.y));
                    this.expended = true;
                    booms.push(new Boom(this.x, this.y));
                    p1.score += 80;
                }
            }
        }
        if (collision(this, p1)) {
            this.expended = true;
            p1.hp -= 30;
        }
    };
}