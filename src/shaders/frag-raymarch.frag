#version 300 es
precision mediump float;

in vec2 UV;
out vec4 fragColor;

uniform float time;

const vec2 SCREEN_SIZE = vec2(1920., 1080.);

float sphereDist(vec3 p, vec3 center, float radius){
    return distance(p, vec3(center)) - radius;
}

float floorDist(vec3 p, float height){
    return p.y - height;
}

float dist(vec3 p){
    return min(
        sphereDist(p, vec3(0.1, 0.5, 0.5), 0.1),
        min(
        sphereDist(p, vec3(0.5, 0.5, 0.5), 0.1),
        sphereDist(p, vec3(0.9, 0.5, 0.5), 0.1)
        )
    );
}

vec3 normal(vec3 p){
    if (
    sphereDist(p, vec3(0.5), 0.1) < sphereDist(p, vec3(0.1, 0.5, 0.5), 0.1)
    && sphereDist(p, vec3(0.5), 0.1) < sphereDist(p, vec3(0.9, 0.5, 0.5), 0.1)
    ){
        return (vec3(0.5) - p)/distance(p, vec3(0.5));
    } else if (sphereDist(p, vec3(0.1, 0.5, 0.5), 0.1) < sphereDist(p, vec3(0.9, 0.5, 0.5), 0.1)) {
        return (vec3(0.1, 0.5, 0.5) - p)/distance(p, vec3(0.1, 0.5, 0.5));
    } else {
        return (vec3(0.9, 0.5, 0.5) - p)/distance(p, vec3(0.9, 0.5, 0.5));
    }
}

vec3 light(vec3 p) {
    vec3 LIGHT_SOURCE = normalize(vec3(5., 10., 1. + sin(time / 200.)*10.));
    return normalize(p - LIGHT_SOURCE);
}

vec3 ray_march(vec2 uv){
    const int NUMBER_OF_STEPS = 100;
    const float EPS = 0.05;
//    vec3 origin = vec3(vec2(uv * SCREEN_SIZE), 0.);
    vec3 origin = vec3(uv, 0.);
    vec3 dir = vec3(0., -0.1, 1.);
    float s = 0.;
    for (int i = 0; i < NUMBER_OF_STEPS; i++) {
        vec3 curr = origin + dir * s;
        float d = dist(curr);
//        return vec3(d)/10.;
        if (d < 0.00005) {
            return vec3(dot(light(curr),normal(curr)));
        } else {
         s += d;
        }
    }
    return vec3(0.);
}


void main() {
        fragColor = vec4(ray_march(UV) , 1.);
    }
