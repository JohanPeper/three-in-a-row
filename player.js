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

    sleep(ms) { // задержка для кода
        return new Promise(resolve => setTimeout(resolve, ms))
    }

   async dead(){
        document.querySelector('.playerShape').classList.add('playerDeath');
        await this.sleep(3000);
        this.deadMessage = document.createElement('div');
        this.deadMessage.classList.add('deadMessage');
        this.deadMessage.textContent = 'You Dead!';
        document.querySelector('.container').append(this.deadMessage);
        this.retryButton = document.createElement('button');
        this.retryButton.classList.add('retryButton');
        this.retryButton.textContent = 'Retry';
        document.querySelector('.deadMessage').append(this.retryButton);
        document.querySelector('.retryButton').addEventListener('click', this.reloadPage)
    }

    reloadPage(){
        location.reload();
    }

}