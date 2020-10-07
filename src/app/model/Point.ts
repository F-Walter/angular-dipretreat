export class Point {
    constructor(public x: Date, public y: number) {

    }

    equals(a: Point) {
        if (this.x === a.x && this.y === a.y)
            return true
        else
            return false
    }

}