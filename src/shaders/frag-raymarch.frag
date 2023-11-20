#version 300 es
precision mediump float;

in vec2 UV;
out vec4 fragColor;

const vec2 SCREEN_SIZE = vec2(1920., 1080.);

vec3 light(vec3 p) {
    vec3 LIGHT_SOURCE = normalize(vec3(0.9, 0.9, 0.5));
    return normalize(p - LIGHT_SOURCE);
}

vec3 dirLight(vec3 p) {
    return normalize(vec3(-1., 1., 1.));
}

vec3 ray_march(vec2 uv){
    const int NUMBER_OF_STEPS = 100;
    const float EPS = 0.05;
//    vec3 origin = vec3(vec2(uv * SCREEN_SIZE), 0.);
    vec3 origin = vec3(uv, 0.);
    vec3 dir = normalize(vec3(-0.1, -0.1, 1.));
    dir += vec3((uv - vec2(0.5))*1., 0.);
    dir = normalize(dir);
    float s = 0.;
    for (int i = 0; i < NUMBER_OF_STEPS; i++) {
        vec3 curr = origin + dir * s;
        float d = dist(curr);
//        return vec3(d)/10.;
        if (d < 0.00005) {
            return clamp(vec3(0.1), vec3(dot(light(curr),normal(curr))), vec3(1.));
        } else {
         s += d;
        }
    }
    return vec3(0.);
}


void main() {
        fragColor = vec4(ray_march(UV) , 1.);
    }
