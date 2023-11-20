#version 300 es


in vec4 VertexPosition, VertexColor;
out vec2 UV;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;


void main() {
    gl_Position =  VertexPosition;
    UV = vec2(VertexPosition.xy)/2. + vec2(0.5);
}
