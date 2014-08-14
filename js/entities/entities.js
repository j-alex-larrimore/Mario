game.PlayerEntity = me.ObjectEntity.extend({
   init: function(x, y, settings){
       settings.image = "player1";
       settings.spritewidth = "128";
       settings.spriteheight = "128";
       settings.width = 128;
       settings.height = 128;
       this.parent(x, y, settings);
       
       this.collidable = true;
       
       this.renderable.addAnimation("idle", [3]);
       this.renderable.setCurrentAnimation("idle");
       
       this.setVelocity(5, 20);
       me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
   }, 
   
   update: function(){
        
       var collision = me.game.world.collide(this);
       
       if (me.input.isKeyPressed("right")){
           this.vel.x += this.accel.x * me.timer.tick;
          
       }else if(me.input.isKeyPressed("left")){
           this.vel.x -= this.accel.x * me.timer.tick;
       }else{
           this.vel.x = 0;
       }
       
       if(me.input.isKeyPressed("jump") && !this.jumping && !this.falling){
           this.vel.y -= this.accel.y * me.timer.tick;
           this.jumping = true;
       }
       
       this.updateMovement();
       return true;
       
   }
});

game.LevelTrigger = me.ObjectEntity.extend({
   init: function(x, y, settings){
       this.parent(x, y, settings);
       this.collidable = true;
       this.level = settings.level;
       this.xSpawn = settings.xSpawn;
       this.ySpawn = settings.ySpawn;
   },
           
   onCollision: function(){
        this.collidable = false;
        me.levelDirector.loadLevel(this.level);
        me.state.current().resetPlayer(this.xSpawn, this.ySpawn);
   }
});