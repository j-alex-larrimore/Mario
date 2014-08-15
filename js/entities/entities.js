game.PlayerEntity = me.ObjectEntity.extend({
   init: function(x, y, settings){
       settings.image = "player1";
       settings.spritewidth = "128";
       settings.spriteheight = "128";
       settings.width = 128;
       settings.height = 128;
       this.parent(x, y, settings);
       
       this.canBreakTile = true;
       
       this.small = true;
       this.star = false;
       this.flower = false;
       this.flowerTimer = 10000;
       this.starTimer = 10000;
       this.currentStar = new Date().getTime();
       this.currentFlower = new Date().getTime();
       this.lastFire = new Date().getTime();
       
       this.collidable = true;
       this.range = 500;
       this.facing = "right";
       
       this.now = new Date().getTime();
       
       this.renderable.addAnimation("smallIdle", [3]);
       this.renderable.addAnimation("bigIdle", [0]);
       this.renderable.addAnimation("smallWalk", [8, 9, 10, 11, 12, 13], 80);
       this.renderable.addAnimation("bigWalk", [14, 15, 16, 17, 18, 19], 80);
       this.renderable.addAnimation("smallStar", [38, 39, 40, 41, 42, 43], 80);
       this.renderable.addAnimation("smallFlower", [32, 33, 34, 35, 36, 37], 80);
       this.renderable.addAnimation("bigStar", [26, 27, 28, 29, 30, 31], 80);
       this.renderable.addAnimation("bigFlower", [20, 21, 22, 23, 24, 25], 80);
       this.renderable.addAnimation("shrink", [0, 1, 2, 3], 20);
       this.renderable.addAnimation("grow", [4, 5, 6, 7], 20);
       
       this.renderable.setCurrentAnimation("smallIdle");
       
       this.setVelocity(5, 20);
       me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
   }, 
   
   update: function(delta){
       this.now = new Date().getTime(); 
       var collision = me.game.world.collide(this);
       
       if (me.input.isKeyPressed("right")){
           this.vel.x += this.accel.x * me.timer.tick;
           this.flipX(false);
           this.facing = "right";
       }else if(me.input.isKeyPressed("left")){
           this.vel.x -= this.accel.x * me.timer.tick;
           this.flipX(true);
           this.facing = "left";
       }else{
           this.vel.x = 0;
       }
       
       if(me.input.isKeyPressed("attack") && this.now-this.lastFire >= 2000){
           this.lastFire = this.now;
           this.fireball = me.pool.pull("fireball", this.pos.x + 32, this.pos.y + 26, {}, this.range, this.facing);
           me.game.world.addChild(this.fireball, 10);
       }
       
        if(collision){
            console.log(collision.obj.type);
            if(collision.obj.type === "badguy"){
                  var ydif = this.pos.y - collision.obj.pos.y;
                  if(this.star){
                      collision.obj.alive = false;
                  }
                  else if(ydif <= -115){
                      this.vel.y -= this.accel.y * me.timer.tick;
                      this.jumping = true;
                      collision.obj.alive = false;
                  } 
                  else{
                        if(this.flower){
                            this.flower = false;
                            this.vel.y -= this.accel.y * me.timer.tick;
                            this.jumping = true;
                        }
                        else if(!this.small){
                            this.renderable.setCurrentAnimation("shrink", "smallIdle");
                            this.renderable.setAnimationFrame();
                            this.small = true;
                            this.vel.y -= this.accel.y * me.timer.tick;
                            this.jumping = true;
                       }
                       else{
                           me.state.change(me.state.MENU);
                       }
                  }
             }else if(collision.obj.type === "Mushroom"){
                 this.small = false;
                 me.game.world.removeChild(collision.obj);
                 this.renderable.setCurrentAnimation("grow", "bigIdle");
                 this.renderable.setAnimationFrame();
             }else if(collision.obj.type === "Flower"){
                 this.flower = true;
                 this.currentFlower = this.now;
                 me.game.world.removeChild(collision.obj);
             }else if(collision.obj.type === "Star"){
                 this.star = true;
                 this.currentStar = this.now;
                 me.game.world.removeChild(collision.obj);
             }else if(collision.obj.type === "Box"){
                var ydif = this.pos.y - collision.obj.pos.y;
                var xdif = this.pos.x - collision.obj.pos.x;
                if(xdif > 0) {
                    this.vel.x = 0;
                    this.pos.x = this.pos.x + 1;
                }else if(xdif < -65 && xdif > -100){
                    this.vel.x = 0;
                    this.pos.x = this.pos.x - 1;
                }else if(!this.falling && (xdif > -90 && (!this.small && ydif >= 60) || (this.small && ydif <= 20 && ydif >= 10))){
                    this.vel.y = 0;
                    this.falling = true;
                    this.pos.y = this.pos.y + 1;
                    me.game.world.removeChild(collision.obj);
                }else if(ydif < -120){
                    this.falling = false;
                    this.vel.y = 0;
                    this.pos.y = this.pos.y - 1;
                }else{
                    console.log("Huh?" + xdif + " " + ydif + " " + this.small + " " + (!this.small && ydif >= 64) + " " + (ydif >= 64));
                }
          
             }else if(collision.obj.type === "starBox"){
                var ydif = this.pos.y - collision.obj.pos.y;
                var xdif = this.pos.x - collision.obj.pos.x;
                if(xdif > 0) {
                    this.vel.x = 0;
                    this.pos.x = this.pos.x + 1;
                }else if(xdif < -65 && xdif > -100){
                    this.vel.x = 0;
                    this.pos.x = this.pos.x - 1;
                }else if(!this.falling && (xdif > -90 && (!this.small && ydif >= 64) || (this.small && ydif <= 20 && ydif >= 10))){
                    this.vel.y = 0;
                    this.falling = true;
                    this.pos.y = this.pos.y + 1;
                    me.game.world.removeChild(collision.obj);
                    var star = me.pool.pull("star", this.pos.x, this.pos.y, {});
                    me.game.world.addChild(star, 4);
                }else if(ydif < -120){
                    this.falling = false;
                    this.vel.y = 0;
                    this.pos.y = this.pos.y - 1;
                }else{
                    console.log("Huh?" + xdif + " " + ydif);
                }
          
             }else if(collision.obj.type === "flowerBox"){
                var ydif = this.pos.y - collision.obj.pos.y;
                var xdif = this.pos.x - collision.obj.pos.x;
                if(xdif > 0) {
                    this.vel.x = 0;
                    this.pos.x = this.pos.x + 1;
                }else if(xdif < -65 && xdif > -100){
                    this.vel.x = 0;
                    this.pos.x = this.pos.x - 1;
                }else if(!this.falling && (xdif > -90 && (!this.small && ydif >= 64) || (this.small && ydif <= 20 && ydif >= 10))){
                    this.vel.y = 0;
                    this.falling = true;
                    this.pos.y = this.pos.y + 1;
                    me.game.world.removeChild(collision.obj);
                    var flower = me.pool.pull("flower", this.pos.x, this.pos.y, {});
                    me.game.world.addChild(flower, 4);
                }else if(ydif < -120){
                    this.falling = false;
                    this.vel.y = 0;
                    this.pos.y = this.pos.y - 1;
                }else{
                    console.log("Huh?" + xdif + " " + ydif);
                }
          
             }else if(collision.obj.type === "mushroomBox"){
                var ydif = this.pos.y - collision.obj.pos.y;
                var xdif = this.pos.x - collision.obj.pos.x;
                if(xdif > 0) {
                    this.vel.x = 0;
                    this.pos.x = this.pos.x + 1;
                }else if(xdif < -65 && xdif > -100){
                    this.vel.x = 0;
                    this.pos.x = this.pos.x - 1;
                }else if(!this.falling && (xdif > -90 && (!this.small && ydif >= 64) || (this.small && ydif <= 20 && ydif >= 10))){
                    this.vel.y = 0;
                    this.falling = true;
                    this.pos.y = this.pos.y + 1;
                    me.game.world.removeChild(collision.obj);
                    var mushroom = me.pool.pull("mushroom", this.pos.x, this.pos.y, {});
                    me.game.world.addChild(mushroom, 4);
                }else if(ydif < -120){
                    this.falling = false;
                    this.vel.y = 0;
                    this.pos.y = this.pos.y - 1;
                }else{
                    console.log("Huh?" + xdif + " " + ydif);
                }
          
             }
       }
       
       if(this.star && (this.now - this.currentStar) >= this.starTimer){
           this.star = false;
       }
       
       if(this.vel.x !== 0){
           if(this.small){
               if(this.star && !this.renderable.isCurrentAnimation("smallStar") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink")){
                    this.renderable.setCurrentAnimation("smallStar");
                    this.renderable.setAnimationFrame();
               }else if(!this.star && this.flower && !this.renderable.isCurrentAnimation("smallFlower") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink")){
                    this.renderable.setCurrentAnimation("smallFlower");
                    this.renderable.setAnimationFrame();
               }else if(!this.star && !this.flower && !this.renderable.isCurrentAnimation("smallWalk") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink")){
                    this.renderable.setCurrentAnimation("smallWalk");
                    this.renderable.setAnimationFrame();
               }
           }
           else{
               if(this.star && !this.renderable.isCurrentAnimation("bigStar") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink")){
                    this.renderable.setCurrentAnimation("bigStar");
                    this.renderable.setAnimationFrame();
               }else if(!this.star && this.flower && !this.renderable.isCurrentAnimation("bigFlower") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink")){
                    this.renderable.setCurrentAnimation("bigFlower");
                    this.renderable.setAnimationFrame();
               }else if(!this.star && !this.flower && !this.renderable.isCurrentAnimation("bigWalk") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink")){
                    this.renderable.setCurrentAnimation("bigWalk");
                    this.renderable.setAnimationFrame();
               }
           }
       }
       else{
           if(!this.star && !this.flower && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink")){
               if(!this.small){
                    this.renderable.setCurrentAnimation("bigIdle");
               }
               else{
                    this.renderable.setCurrentAnimation("smallIdle");
               }
           }
       }
       
       if(me.input.isKeyPressed("jump") && !this.jumping && !this.falling){
           this.vel.y -= this.accel.y * me.timer.tick;
           this.jumping = true;
       }
       
       
       this.updateMovement();
       this.parent(delta);
       return true;
       
   }
});

game.BadGuy = me.ObjectEntity.extend({
   init: function(x, y, settings){
       var width = settings.width;
       
       settings.image = "slime";
       settings.spritewidth = "60";
       settings.spriteheight = "28";
       settings.width = 60;
       settings.height = 28;
       
       this.parent(x, y, settings);
       
       this.collidable = true;
       
       this.setVelocity(4, 6);
       this.type = "badguy";
       
       this.renderable.addAnimation("idle", [1]);
       this.renderable.addAnimation("run", [0, 1, 2]);
       
       
       x = this.pos.x;
       this.startX = x;
       this.endX = x + width-settings.spritewidth;
       this.pos.x = x + width-settings.spritewidth;
   },
           
   update: function(delta){
       if(!this.inViewport){
           return false;
       }
       
       if(this.alive){
           if (this.walkLeft && this.pos.x <= this.startX){
               this.walkLeft = false;
           }else if(!this.walkLeft && this.pos.x >= this.endX){
               this.walkLeft = true;
           }
           this.flipX(!this.walkLeft);
           this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
       }else{
           me.game.world.removeChild(this);
       }
       
           
       this.updateMovement();
       this.parent(delta);
       return true;
   }
});

game.Star = me.ObjectEntity.extend({
   init: function(x, y, settings){
       settings.image = "star";
       settings.spritewidth = "64";
       settings.spriteheight = "64";
       settings.width = 64;
       settings.height = 64;
       this.parent(x, y, settings);
       
       this.collidable = true;
       this.type = "Star";
       
       this.setVelocity(-3, 15);
   },
           
   update: function(){
        this.updateMovement();
        return true;
   }
});

game.Flower = me.ObjectEntity.extend({
   init: function(x, y, settings){
       settings.image = "flower";
       settings.spritewidth = "64";
       settings.spriteheight = "64";
       settings.width = 64;
       settings.height = 64;
       this.parent(x, y, settings);
       
       this.collidable = true;
       this.type = "Flower";
       this.setVelocity (0, 20);
   },
   
   update: function(){
        this.updateMovement();
        return true;
   }
});

game.Mushroom = me.ObjectEntity.extend({
   init: function(x, y, settings){
       settings.image = "mushroom";
       settings.spritewidth = "64";
       settings.spriteheight = "64";
       settings.width = 64;
       settings.height = 64;
       this.parent(x, y, settings);
       
       this.collidable = true;
       this.type = "Mushroom";
       this.setVelocity(3, 20);
   },
   
   update: function(){
         
   }
});

game.LevelTrigger = me.ObjectEntity.extend({
   init: function(x, y, settings){
       this.parent(x, y, settings);
       this.collidable = true;
       this.level = settings.level;
       this.xSpawn = settings.xSpawn;
       this.ySpawn = settings.ySpawn;
       this.type = "trigger";
   },
           
   onCollision: function(){
        this.collidable = false;
        me.levelDirector.loadLevel(this.level);
        me.state.current().resetPlayer(this.xSpawn, this.ySpawn);
   }
});

game.FireBall = me.ObjectEntity.extend({
   init: function(x, y, settings, rng, face){
       settings.image = "fireball";
       settings.spritewidth = "48";
       settings.spriteheight = "48";
       settings.width = 48;
       settings.height = 48;
       this.parent(x, y, settings);
       this.collidable = true;
       this.range = rng;
       this.facing = face;
       this.startX = x;
       if(this.facing === "right"){
            this.endX = (this.startX + this.range);
        }
        else{
            this.endX = (this.startX - this.range);
        }
       
       this.setVelocity(6, 12);
   },
           
   update: function(delta){
       if(this.facing === "right"){
           this.vel.x += this.accel.x * me.timer.tick;     
       }
       else if(this.facing === "left"){
           this.flipX(true);
           this.vel.x -= this.accel.x * me.timer.tick;
       }
       
       if(!this.jumping && !this.falling){
           this.vel.y -= this.accel.y * me.timer.tick;
           this.jumping = true;
       }
       
       var collision = me.game.world.collide(this);
       
       if(collision){
           if(collision.obj.type === "badguy"){
               me.game.world.removeChild(this);
               me.game.world.removeChild(collision.obj);
           }
       }
       
       console.log(this.facing + " " + this.pos.x + " " + this.endX);
       if((this.pos.x >= this.endX && this.facing ==="right") || (this.pos.x <= this.endX && this.facing ==="left")){ // || (this.pos.x === this.lastPosX && (this.now - this.last > 200) && this.stuck === true)){
            me.game.world.removeChild(this);
       }
       
       this.parent(delta);
       this.updateMovement();
       return true;
   }      
});

game.Box = me.ObjectEntity.extend({
   init: function(x, y, settings){
       settings.image = "box";
       settings.spritewidth = "67";
       settings.spriteheight = "71";
       settings.width = 67;
       settings.height = 76;
       this.parent(x, y, settings);
       
       this.collidable = true;
       this.type = "Box";
   },
   
   
});

game.mushroomBox = me.ObjectEntity.extend({
   init: function(x, y, settings){
       settings.image = "box";
       settings.spritewidth = "67";
       settings.spriteheight = "71";
       settings.width = 67;
       settings.height = 76;
       this.parent(x, y, settings);
       
       this.collidable = true;
       this.type = "mushroomBox";
   },
           
   update: function(){
         this.vel.x += this.accel.x * me.timer.tick; 
   }
});

game.flowerBox = me.ObjectEntity.extend({
   init: function(x, y, settings){
       settings.image = "box";
       settings.spritewidth = "67";
       settings.spriteheight = "71";
       settings.width = 67;
       settings.height = 76;
       this.parent(x, y, settings);
       
       this.collidable = true;
       this.type = "flowerBox";
   }
});

game.starBox = me.ObjectEntity.extend({
   init: function(x, y, settings){
       settings.image = "box";
       settings.spritewidth = "67";
       settings.spriteheight = "71";
       settings.width = 67;
       settings.height = 76;
       this.parent(x, y, settings);
       
       this.collidable = true;
       this.type = "starBox";
   }
});