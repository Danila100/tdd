import "chai/register-should";
import {beginAndEndWithReporting} from "./infrastructure/reportingTest";

// cd js
// npm install
// npm run bowling

class Game {
    constructor() {
        this.frameIndex = 0;
        this.history = [{rolls: []}];
    }

    roll(pins) {
        const {rolls} = this.history[this.frameIndex];
        rolls.push(pins);
        if (rolls.length > 2) {
            this.frameUp();
        }
    }

    frameUp() {
        this.frameIndex++;
        this.history[this.frameIndex] = {rolls: []};
    }

    getFrameScore(rolls) {
        return rolls.reduce((a, b) => a + b, 0)
    }

    getScore() {
        return this.history.reduce((accumulator, currentValue) => {
            let current = this.getFrameScore(currentValue.rolls)

            if (currentValue.rolls.length === 2 && current === 10) { // spare
                current ++;
            }
            return accumulator + current;
        }, 0);
    }
}

describe("Game", () => {
    it("should have zero score before any rolls", () => {
        const game = new Game();
        game.getScore().should.be.eq(0);
    });

    it("should have simple score after one roll", () => {
        const game = new Game();
        game.roll(10);
        game.getScore().should.be.eq(10);
    });

    it("После двух простых бросков на 2 и 5 сумма очков 7", () => {
        const game = new Game();
        game.roll(2);
        game.roll(5);
        game.getScore().should.be.eq(7);
    });

    it("spare", () => {
        const game = new Game();
        game.roll(2);
        game.roll(8);
        game.roll(3);
        game.getScore().should.be.eq(16);
    });

    beginAndEndWithReporting();
});
