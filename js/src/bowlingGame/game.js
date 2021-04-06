import "chai/register-should";
import {beginAndEndWithReporting} from "./infrastructure/reportingTest";

// cd js
// npm install
// npm run bowling

class Game {
    constructor() {
        this.frameIndex = 0;
        this.history = [{
            rolls: []
        }];
    }

    roll(pins) {
        const {rolls} = this.history[this.frameIndex];
        rolls.push(pins);
        if (rolls.length > 1) {
            this.frameUp();
        }
    }

    frameUp() {
        this.frameIndex++;
        this.history[this.frameIndex] = {rolls: []};
    }

    getFrameScore(frameIndex) {
        return this.history[frameIndex].rolls.reduce((a, b) => a + b, 0)
    }

    isPrevSpare(frameIndex) {
        const frame = this.history[frameIndex - 1];
        return frame && frame.rolls.length === 2 && this.getFrameScore(frameIndex - 1) === 10
    }

    getScore() {
        return this.history.reduce((accumulator, currentValue, index) => {
            if (!currentValue.rolls.length) return accumulator
            let current = this.getFrameScore(index)

            if (this.isPrevSpare(index)) { // spare
                current += currentValue.rolls[0];
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

    it("2 spare подряд", () => {
        const game = new Game();
        game.roll(2);
        game.roll(8);
        game.roll(3);
        game.roll(7);
        game.getScore().should.be.eq(23);
    });

    it("2 spare подряд и затем простые броски", () => {
        const game = new Game();
        game.roll(2);
        game.roll(8);
        game.roll(3);
        game.roll(7);
        game.roll(4);
        game.roll(5);
        game.getScore().should.be.eq(36);
    });

    beginAndEndWithReporting();
});
