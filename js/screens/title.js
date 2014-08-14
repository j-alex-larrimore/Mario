game.TitleScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
            me.game.world.addChild( new me.SpriteObject (0, 0, me.loader.getImage('title-screen')), -10);
            me.input.bindKey(me.input.KEY.ENTER, "start");
            
            me.game.world.addChild(new (me.Renderable.extend ({
                init: function(){
                    this.parent(new me.Vector2d(270, 100), 510, 30);
                    this.font = new me.Font("Arial", 46, "white");
                },
                
                draw: function(context){
                    this.font.draw(context, "Marioish", 450, 130);
                    this.font.draw(context, "Press ENTER to play!", 250, 530);
                }
            })));
            
            this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {                
                if (action === "start") {
                    me.state.change(me.state.PLAY);
                }
            });
            
	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
            me.input.unbindKey(me.input.KEY.ENTER); // TODO
	}
});
