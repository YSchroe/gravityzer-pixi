import * as PIXI from 'pixi.js';
import Attractor from './Attractor';
import Vector2D from './Vector2D';

import KeyHandler from './KeyHandler';
import { throws } from 'assert';

class Player extends Attractor {
	constructor(engine) {
		// init gravity
		super(new Vector2D(200, 750), new Vector2D(0, 0), 0, {
			isStatic: true,
			polarity: 0,
			hasGravity: true,
			bounceFactor: 0
		});
		this.engine = engine;
		this.moving = 0;
		this.jmpCnt = 0;

		this.radius = new PIXI.Graphics();
		this.radius.beginFill(0xff0000, 0.3);
		this.radius.drawCircle(0, 0, 50);
		this.radius.endFill();
		this.radius.x = this.pos.x;
		this.radius.y = this.pos.y;
		this.radius.pivot.set(0, 5);
		this.radius.visible = false;
		this.engine.addGraphics(this.radius);

		this.pixi = new PIXI.Graphics();
		this.pixi.lineStyle(2, 0xffffff);
		this.pixi.drawRect(0, 0, 10, 10);
		this.pixi.x = this.pos.x;
		this.pixi.y = this.pos.y;
		this.pixi.pivot.set(5, 10);

		this.engine.addGraphics(this.pixi);

		this.initControls();
	}

	initControls() {
		// LEFT RIGHT
		const keyLeft = new KeyHandler('a');
		keyLeft.press = () => {
			this.moving = -5;
		};

		const keyRight = new KeyHandler('d');
		keyRight.press = () => {
			this.moving = 5;
		};

		keyLeft.release = () => {
			if (!keyRight.isDown) this.moving = 0;
		};

		keyRight.release = () => {
			if (!keyLeft.isDown) this.moving = 0;
		};

		// jump
		const keyUp = new KeyHandler(' ');
		keyUp.press = () => {
			if (this.jmpCnt < 2) {
				this.acc.add(new Vector2D(0, -5));
				this.jmpCnt += 1;
			}
		};

		// LEFT RIGHT
		const keyShift = new KeyHandler('Alt');
		keyShift.press = () => {
			const mousePos = this.engine.app.renderer.plugins.interaction.mouse.global.clone();
			this.engine.addParticle(
				this.pos.clone(),
				Vector2D.sub(new Vector2D(mousePos.x, mousePos.y), this.pos).mult(0.05),
				100,
				{
					isStatic: false,
					polarity: 0,
					hasGravity: true,
					bounceFactor: 0.75
				},
				10
			);
		};

		// keyUp.release = () => {
		// 	this.thrust = 0;
		// };

		window.addEventListener(
			'mouseup',
			() => {
				this.radius.visible = false;
				const mousePos = this.engine.app.renderer.plugins.interaction.mouse.global.clone();
				// this.engine.addParticle(
				// 	this.pos.clone(),
				// 	Vector2D.sub(new Vector2D(mousePos.x, mousePos.y), this.pos).mult(
				// 		0.05
				// 	),
				// 	200,
				// 	{
				// 		isStatic: false,
				// 		polarity: 0,
				// 		hasGravity: true,
				// 		bounceFactor: 0.75
				// 	},
				// 	10
				// );
				this.m = 0;
				this.engine.gravSys.members.forEach(m => {
					if (this.pos.dist(m.pos) < 50 && m !== this)
						m.accelerate(
							Vector2D.sub(new Vector2D(mousePos.x, mousePos.y), this.pos)
								.normalize()
								.mult(15)
						);
				});
			},
			false
		);

		window.addEventListener(
			'mousedown',
			() => {
				this.radius.visible = true;
				this.m = 500;
			},
			false
		);
	}

	update(frmCnt) {
		if (this.moving !== 0) {
			this.pos.x += this.moving;
		}

		// update gravity forces
		super.update();
		if (this.pos.y > 799) this.jmpCnt = 0;

		// update graphics
		this.pixi.x = this.pos.x;
		this.pixi.y = this.pos.y;
		this.radius.x = this.pixi.x;
		this.radius.y = this.pixi.y;
	}
}

export default Player;