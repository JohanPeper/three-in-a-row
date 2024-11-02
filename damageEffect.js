export class DamageEffect {
    constructor(name){
        this.name = name;
        this.damageEffect = document.createElement('div');
        this.damageEffect.classList.add(`damageEffect`)
        this.damageEffect.classList.add(`damageEffect${name}`)
        name = name.charAt(0).toLowerCase() + name.slice(1);
        document.querySelector(`.${name}Shape`).append(this.damageEffect);
        document.querySelector(`.damageEffect${this.name}`).getAnimations()[0].finish();
    }
    reloadAnimation(){
        document.querySelector(`.damageEffect${this.name}`).getAnimations()[0].finish();
        document.querySelector(`.damageEffect${this.name}`).getAnimations()[0].play();
    }
}