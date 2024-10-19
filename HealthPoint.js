export class HealthPoint {
    currentHP = 100;

    constructor(params) {
        this.healthPointBG = document.createElement('div');
        this.healthPointBG.classList.add('healthPointBG');
        document.body.append(this.healthPointBG);
        this.healthPoint = document.createElement('div');
        this.healthPoint.classList.add('healthPoint');
        document.querySelector('.healthPointBG').append(this.healthPoint);

    }

    healthPointDamage(amount) {
        this.currentHP -= amount;
        if (this.currentHP < 0) { this.currentHP = 0 };
        this.healthPoint.style.setProperty('--amount', `${this.currentHP}%`);
    }

    healthPointHeal(amount) {
        this.currentHP += amount;
        if (this.currentHP > 100) { this.currentHP = 100 };
        this.healthPoint.style.setProperty('--amount', `${this.currentHP}%`);
    }
}