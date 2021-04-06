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
        if (rolls.length > 1 || this.getFrameScore(this.frameIndex) === 10) {
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

    isPrevStrike(frameIndex) {
        const frame = this.history[frameIndex - 1];
        return frame && frame.rolls.length === 1 && this.getFrameScore(frameIndex - 1) === 10
    }

    getScore() {
        return this.history.reduce((accumulator, currentValue, index) => {
            if (!currentValue.rolls.length) return accumulator
            let current = this.getFrameScore(index)

            if (this.isPrevSpare(index)) { // spare
                current += currentValue.rolls[0];
            }

            if (this.isPrevStrike(index)) { // strike
                current += this.getFrameScore(index);
            }

            return accumulator + current;
        }, 0);
    }
}

describe("Game", () => {
    let game;

    beforeEach(() => {
        game = new Game();
    })

    it("should have zero score before any rolls", () => {
        game.getScore().should.be.eq(0);
    });

    it("should have simple score after one roll", () => {
        game.roll(10);
        game.getScore().should.be.eq(10);
    });

    it("После двух простых бросков на 2 и 5 сумма очков 7", () => {
        game.roll(2);
        game.roll(5);
        game.getScore().should.be.eq(7);
    });

    it("spare", () => {
        makeSpare();
        game.roll(3);
        game.getScore().should.be.eq(16);
    });

    it("2 spare подряд", () => {
        makeSpare();
        const [a,] = makeSpare()
        game.getScore().should.be.eq(20 + a);
    });

    it("2 spare подряд и затем простые броски", () => {
        makeSpare()
        const [a,] = makeSpare()
        game.roll(4);
        game.roll(5);
        game.getScore().should.be.eq(33 + a);
    });

    it("2 spare среди простых бросков", () => {
        game.roll(2);
        game.roll(4);
        makeSpare()
        game.roll(4);
        game.roll(5);
        makeSpare()
        game.roll(4);
        game.roll(5);
        game.getScore().should.be.eq(52);
    });

    it("strike", () => {
        makeStrike()
        game.roll(1);
        game.roll(3);
        game.getScore().should.be.eq(18);
    });

    it("2 strike подряд", () => {
        makeStrike()
        makeStrike()
        game.getScore().should.be.eq(30);
    });

    it("2 strike среди простых бросков", () => {
        game.roll(2);
        game.roll(4);
        makeStrike()
        game.roll(4);
        game.roll(5);
        makeStrike()
        game.roll(4);
        game.roll(5);
        game.getScore().should.be.eq(62);
    });

    function makeSpare() {
        game.roll(4)
        game.roll(6)
        return [4, 6]
    }

    function makeStrike() {
        game.roll(10)
    }

    beginAndEndWithReporting();
});
