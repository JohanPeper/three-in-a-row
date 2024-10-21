import { HealthPoint } from "./healthPoint.js";

export class MonsterOne {
    constructor (player) {
        this.player = player;
        this.healthPoint = new HealthPoint ('MonsterOne');     
        this.damagePlayer(5, this.player);
    }

    damagePlayer(amount, player){
       let monsterOneDamageInterval = setInterval(() => {
        console.log(player);

            player.healthPointDamage(amount);
        }, 5000);
    }
}