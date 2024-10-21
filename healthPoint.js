export class HealthPoint {
    currentHP = 100;

    constructor(name) {
        this.name = name;
        this.healthPointBG = document.createElement('div');
        this.healthPointBG.classList.add(`healthPointBG${name}`);
        document.querySelector('.container').append(this.healthPointBG);
        this.healthPoint = document.createElement('div');
        this.healthPoint.classList.add(`healthPoint${name}`);
        document.querySelector(`.healthPointBG${name}`).append(this.healthPoint);

    }

    healthPointDamage(amount) {
        this.currentHP -= amount;
        if (this.currentHP < 0) { this.currentHP = 0 };
        this.healthPoint.style.setProperty(`--amount`, `${this.currentHP}%`);
    }

    healthPointHeal(amount) {
        this.currentHP += amount;
        if (this.currentHP > 100) { this.currentHP = 100 };
        this.healthPoint.style.setProperty(`--amount`, `${this.currentHP}%`);
    }
}