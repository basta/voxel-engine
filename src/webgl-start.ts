import {Shader} from "./utils/shader.ts";
import {Program, createUBOBuffer, writeUBOData} from "./utils/program.ts";
import {initBuffers} from "./utils/initBuffer.ts";
import {drawScene} from "./utils/drawScene.ts";
import {Sphere} from "./utils/shapes.ts";
import {handleInput, register} from "./utils/input.ts";

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
      ["/src/shaders/math.glsl","/src/shaders/distances.glsl"]
  )


  let shaderProgram = new Program(gl, [vertexShader, fragShader])
  const buffers = initBuffers(gl);
  let uboBuffer = createUBOBuffer(gl, shaderProgram);

  let sphere = new Sphere([1, 2, 3], 4)
  let shapesBuffer = sphere.asShapeStructData()

  let movement: number[] = [0, 0, 0]
  register("wasd", (key: string) => {
    const speed = 0.05;
    switch (key) {
      case "w":
        movement[2] = 1 * speed;
        break;
      case "a":
        movement[0] = -1 * speed;
        break;
      case "s":
        movement[2] = -1 * speed;
        break;
      case "d":
        movement[0] = 1 * speed;
        break;
    }
  })

  let angle_changes: number[] = [0, 0]
  register("jikl", (key: string) => {
    const speed = 0.01;
    switch (key) {
        case "j":
            angle_changes[0] = -1 * speed;
            break;
        case "i":
            angle_changes[1] = -1 * speed;
            break;
        case "k":
            angle_changes[1] = 1 * speed;
            break;
        case "l":
            angle_changes[0] = 1 * speed;
            break;
        }
  })

  // Draw the scene
  const render = () => {
    movement = [0,0,0]
    angle_changes = [0,0,0]
    handleInput(0.05)
    gl.clearColor(0., 0., 0., 1.)
    gl.clear(gl.COLOR_BUFFER_BIT)
    drawScene(gl, shaderProgram, buffers)

    let posLocation = gl.getUniformLocation(
        shaderProgram.program, 'pos')!;
    let pos = gl.getUniform(shaderProgram.program, posLocation);

    let rotLocation = gl.getUniformLocation(
        shaderProgram.program, 'rot')!;
    let rot = gl.getUniform(shaderProgram.program, rotLocation);

    let newPos = pos.map((value, index) => value + movement[index]);
    let newRot = rot.map((value, index) => value + angle_changes[index]);

    gl.uniform3fv(posLocation, newPos);
    gl.uniform2fv(rotLocation, newRot);

    writeUBOData(gl, shaderProgram, uboBuffer, shapesBuffer)
    window.requestAnimationFrame(render)
  }
  gl.useProgram(shaderProgram.program);
  render()
}

