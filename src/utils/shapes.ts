abstract class Shape {

    asShapeStructData = () => {

    }

}

class Cube extends Shape {
    constructor() {
        super();

    }

}

export class Sphere extends Shape {
    SHAPE_TYPE = 10
    center: [number, number, number]
    radius: number
    constructor(center: [number, number, number], radius: number) {
        super();

        this.center = center
        this.radius = radius
    }

    asShapeStructData = () => {
        const BUFFER_SIZE = 3*4*4 + 4;
        const buffer = new ArrayBuffer(BUFFER_SIZE);
        let floatView = new Float32Array(buffer);
        floatView.set([
            this.center[0], this.center[1], this.center[2], 0,
            0, 0, 0, 0,
            this.radius, this.radius, this.radius, 0,
            0
        ], 0)

        let u32view = new Uint32Array(buffer);

        u32view.set([this.SHAPE_TYPE], 3*4)

        console.log("U8 view is:", u32view)
        console.log("f32 view is:", floatView)

        return buffer;
    }
}


const loadShapes = (shapes: Shape[]) => {

}
