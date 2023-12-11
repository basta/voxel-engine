export class Shader {
    static VERSION_TAG = "#version 300 es"

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

    static fromUrl = async (
        gl: WebGL2RenderingContext,
        url: string,
        type: GLenum,
        dependencyURLs: string[] = [],
        defines: Record<string, string> = {}): Promise<Shader> => {
        try {
            const body = await fetch(url);
            let source = await body.text();

            let dependenciesSource = ``
            if (dependencyURLs) {
                let promises = dependencyURLs.map(url => fetch(url))
                let sources = await Promise.all(await Promise.all(promises)
                    .then((bodies) => bodies.map(body => body.text())))
                dependenciesSource += sources.join("\n")
            }

            dependenciesSource = dependenciesSource.replace(this.VERSION_TAG, "")
            source = source.replace(this.VERSION_TAG, "")

            source = dependenciesSource + source

            let definesSource = ""
            for (const key in defines) {
                definesSource += `#define ${key} ${defines[key]}\n`
                let defineRegex = new RegExp(`#define *${key} *.*`, "gm")
                console.log("Replacing", defineRegex)
                source = source.replace(defineRegex, "")
            }

            source = this.VERSION_TAG + "\n" + definesSource + source

            return new Shader(gl, source, type);
        } catch (e) {
            console.error(`Failed to load shader from ${url}, reason: ${e}`);
            throw e;
        }
    }

}
