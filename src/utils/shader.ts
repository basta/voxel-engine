export class Shader {
    shader: WebGLShader;
    constructor(gl: WebGL2RenderingContext, source: string, type: GLenum) {
        this.shader = gl.createShader(type)!
        gl.shaderSource(this.shader, source)
        gl.compileShader(this.shader)

        const message = gl.getShaderInfoLog(this.shader)!;

        if (message.length > 0) {
          /* message may be an error or a warning */
          throw message;
        }

    }

    static fromUrl = async (gl: WebGL2RenderingContext, url: string, type: GLenum): Promise<Shader> => {
        const body = await fetch(url);
        const source = await body.text();
        return new Shader(gl, source, type);
    }
}
