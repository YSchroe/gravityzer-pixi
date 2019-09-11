import Vector2D from './Vector2D';

const G = 6.674; // gravity constant
const A = 25; // dampening factor for close distances of two objects

class GravitySystem {
	constructor() {
		this.members = [];
	}

	add(o) {
		this.members.push(o);
	}

	update(frmCnt) {
		this.members.forEach(a => {
			this.members.forEach(a1 => {
				if (a !== a1 && !a1.isStatic) {
					const r = a.pos.dist(a1.pos);
					const acc = (G * a.m * r) / (r * r + A * A) ** (3 / 2);
					const accVec = Vector2D.sub(a.pos, a1.pos)
						.normalize()
						.mult(acc);
					a1.accelerate(accVec);
				}
			});
		});

		this.members.forEach(a => {
			a.update(frmCnt);
		});
	}
}

export default GravitySystem;