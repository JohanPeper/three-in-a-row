import { HealthPoint } from "./healthPoint.js";
import { DamageEffect } from "./damageEffect.js";

export class Player {
    lastMoveCount = 0;
    constructor(){
        this.healthPointPlayer = new HealthPoint ('Player');
        this.playerShape = document.createElement('div');
        this.playerShape.classList.add('playerShape');
        document.querySelector('.container').append(this.playerShape);
        this.playerMagicAttack = document.createElement('div');
        this.playerMagicAttack.classList.add('playerMagicAttack');
        document.querySelector('.playerShape').append(this.playerMagicAttack);
        this.damageEffect = new DamageEffect('Player');
        document.querySelector(`.playerMagicAttack`).getAnimations()[0].finish();
    }

    reloadAttackAnimation(amount){
        if(this.lastMoveCount != amount){
            this.lastMoveCount = amount;
            document.querySelector(`.playerMagicAttack`).getAnimations()[0].finish();
            document.querySelector(`.playerMagicAttack`).getAnimations()[0].play();
        }
    }
}