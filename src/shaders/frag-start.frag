#version 300 es
precision mediump float;

in vec2 UV;
out vec4 fragColor;
void main() {
      fragColor = vec4(UV.r, UV.g, 0., 1.0);
    }
