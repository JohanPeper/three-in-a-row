import { HealthPoint } from "./healthPoint.js";

export class MonsterOne {
    lastMoveCount = 0;
    constructor(player) {
        this.player = player;
        this.healthPoint = new HealthPoint('MonsterOne');
        this.damagePlayer(5, this.player);
    }

    damagePlayer(amount, player) {
        let monsterOneDamageInterval = setInterval(() => {
            console.log(player);

            player.healthPointDamage(amount);
        }, 5000);
    }

    takeDamage(amount) {
        if (this.lastMoveCount == 0) {
            this.lastMoveCount += amount;
            amount *= 2;
            this.healthPoint.healthPointDamage(amount); 
            
        }
        else {
        let damage = amount - this.lastMoveCount; 
        damage *= 2;
        this.healthPoint.healthPointDamage(damage);
        this.lastMoveCount = amount;
    }
    }
}