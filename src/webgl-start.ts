import {Shader} from "./utils/shader.ts";
import {Program} from "./utils/program.ts";
import {initBuffers} from "./utils/initBuffer.ts";
import {drawScene} from "./utils/drawScene.ts";

startWebGL();

//
// start here
//



async function startWebGL() {
  const canvas: HTMLCanvasElement = document.querySelector("#main-canvas")!;
  // Initialize the GL context
  const gl = canvas.getContext("webgl2");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it.",
    );
    return;
  }

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);

  let vertexShader = await Shader.fromUrl(gl, "/src/shaders/vertex-start.vert", gl.VERTEX_SHADER)
  let fragShader = await Shader.fromUrl(
      gl, "/src/shaders/frag-raymarch.frag", gl.FRAGMENT_SHADER,
      ["/src/shaders/distances.glsl"]
  )

  let shaderProgram = new Program(gl, [vertexShader, fragShader])

  const programInfo = {
    program: shaderProgram.program,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram.program, "aVertexPosition"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram.program, "uProjectionMatrix"),
      modelViewMatrix: gl.getUniformLocation(shaderProgram.program, "uModelViewMatrix"),
    },
  };

  const buffers = initBuffers(gl);

  // Draw the scene
  const render = () => {
    gl.clearColor(0., 0., 0., 1.)
    gl.clear(gl.COLOR_BUFFER_BIT)
    drawScene(gl, programInfo, buffers)


    window.requestAnimationFrame(render)
  }

  render()
}

