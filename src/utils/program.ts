import {Shader} from "./shader.ts";

export class Program {
    program: WebGLProgram

    constructor(gl: WebGLRenderingContext, shaders: Shader[]) {
        this.program = gl.createProgram()!

        for (const shader of shaders) {
            gl.attachShader(this.program, shader.shader)
        }
        gl.linkProgram(this.program)

        let message = gl.getProgramInfoLog(this.program);
        if (message) {
            throw message
        }


    }
}

export class UniformBufferObject {
    createUBO = () => {

    }

    bindUBO = () => {}

    setBufferData = () => {}

    bindBufferBaseToBindingPoint = () => {}

    deleteUBO = () => {}
}

export const createUBOBuffer = (gl: WebGL2RenderingContext, program: Program) => {
    // https://gist.github.com/jialiang/2880d4cc3364df117320e8cb324c2880
    const N_SHAPES = 10;

    const blockIndex = gl.getUniformBlockIndex(
        program.program,
        "ShapesBlock"
    )

    const blockSize = gl.getActiveUniformBlockParameter(program.program, blockIndex, gl.UNIFORM_BLOCK_DATA_SIZE)

    console.log(blockSize)


    let uboBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.UNIFORM_BUFFER, uboBuffer)
    gl.bufferData(gl.UNIFORM_BUFFER, blockSize, gl.DYNAMIC_DRAW)
    gl.bindBuffer(gl.UNIFORM_BUFFER, null) // unbind, good practice to avoid accidentally modifying

    gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, uboBuffer)

    let index = gl.getUniformBlockIndex(program.program, "ShapesBlock")
    gl.uniformBlockBinding(program.program, index, 0)

    console.log(gl.getActiveUniformBlockParameter(program.program, index, gl.UNIFORM_BLOCK_DATA_SIZE))

    return uboBuffer
}

export const writeUBOData = (gl: WebGL2RenderingContext, program: Program, uboBuffer: WebGLBuffer, data: Float32Array ) => {
    gl.bindBuffer(gl.UNIFORM_BUFFER, uboBuffer);
    gl.bufferData(gl.UNIFORM_BUFFER, data, gl.DYNAMIC_DRAW)
}
