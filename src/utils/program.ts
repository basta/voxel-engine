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
