import { HealthPoint } from "./healthPoint.js";
import { DamageEffect } from "./damageEffect.js";

export class Player {
    constructor(){
        this.healthPointPlayer = new HealthPoint ('Player');
        this.playerShape = document.createElement('div');
        this.playerShape.classList.add('playerShape');
        document.querySelector('.container').append(this.playerShape);
        this.damageEffect = new DamageEffect('Player');
    }
}