#version 300 es
precision mediump float;

vec3 rotated(vec3 v, vec3 axis, float angle) {
    float s = sin(angle);
    float c = cos(angle);

    return v*cos(angle) + cross(axis, v)*sin(angle) + axis*(dot(axis, v))*(1. - c);
}
