abstract class Shape {
    abstract asShapeStructData: () => ArrayBuffer

}

class Cube extends Shape {
    constructor() {
        super();

    }

}

export class Sphere extends Shape {
    SHAPE_TYPE = 1
    BUFFER_SIZE = 48;
    center: [number, number, number]
    radius: number
    constructor(center: [number, number, number], radius: number) {
        super();

        this.center = center
        this.radius = radius
    }

    asShapeStructData = () => {

        const buffer = new ArrayBuffer(this.BUFFER_SIZE);
        let floatView = new Float32Array(buffer);
        floatView.set([
            this.center[0], this.center[1], this.center[2], 0,
            0, 0, 0, 0,
            this.radius, this.radius, this.radius, 0,
        ], 0)

        let u32view = new Uint32Array(buffer);

        u32view.set([this.SHAPE_TYPE], 3*4-1)
        // u32view.set([this.SHAPE_TYPE], 3*4)

        console.log("U8 view is:", u32view)
        console.log("f32 view is:", floatView)

        return buffer;
    }
}

export const getShapesStructData = (shapes: Shape[]) => {
    let views: Uint8Array[] = []
    shapes.forEach((shape) => {
        views.push(new Uint8Array(shape.asShapeStructData()))
    })

    let length = 0
    for (const v of views)
        length += v.byteLength

    console.log("Length is:", length)

    let res_buffer = new ArrayBuffer(length)
    let res_view = new Uint8Array(res_buffer)
    let offset = 0;
    for (const v of views) {
        res_view.set(v, offset)
        offset += v.byteLength
    }
    return res_buffer;
}

const loadShapes = (shapes: Shape[]) => {

}

