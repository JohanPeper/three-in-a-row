import { HealthPoint } from "./healthPoint.js";
import { DamageEffect } from "./damageEffect.js";

export class MonsterOne {
    lastMoveCount = 0;
    constructor(player) {
        this.player = player;
        this.healthPoint = new HealthPoint('MonsterOne');
        this.appearance();
        this.damagePlayer(5, this.player);
    }

    appearance() {
        this.monsterOneContainer = document.createElement('div');
        this.monsterOneContainer.classList.add('monsterOneContainer');
        document.querySelector('.container').append(this.monsterOneContainer);
        this.monsterOneShape = document.createElement('div');
        this.monsterOneShape.classList.add(`monsterOneShape`);
        document.querySelector('.monsterOneContainer').append(this.monsterOneShape);
        this.monsterOneArrow = document.createElement('div');
        this.monsterOneArrow.classList.add('monsterOneArrow');
        document.querySelector('.monsterOneContainer').append(this.monsterOneArrow);
        document.querySelector('.monsterOneArrow').getAnimations()[0].finish();
        this.DamageEffect = new DamageEffect('MonsterOne'); 
    }

    damagePlayer(amount, player) {
        let monsterOneDamageInterval = setInterval(async () => {
            this.shoot();
            this.reload();
            player.damageEffect.reloadAnimation();
            await this.sleep(500);
            player.healthPointPlayer.healthPointDamage(amount);
        }, 5000);

    }

    async takeDamage(amount) {
      await  this.sleep(500);
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

    async reload() {
        document.querySelector('.monsterOneShape').classList.add('monsterOneShoot');
        await this.sleep(500);
        document.querySelector('.monsterOneShape').classList.remove('monsterOneShoot');
        document.querySelector('.monsterOneShape').getAnimations()[0].finish();
        document.querySelector('.monsterOneShape').getAnimations()[0].play();
    }

    sleep(ms) { // задержка для кода
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    shoot() {
        document.querySelector('.monsterOneArrow').getAnimations()[0].finish();
        document.querySelector('.monsterOneArrow').getAnimations()[0].play();
    }


}