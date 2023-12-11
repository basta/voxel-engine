#version 300 es
#define M_PI 3.1415926535897932384626433832795
precision mediump float;

in vec2 UV;
out vec4 fragColor;

uniform vec3 pos;
uniform vec2 rot;

const vec2 SCREEN_SIZE = vec2(1920., 1080.);

vec3 light(vec3 p) {
    vec3 LIGHT_SOURCE = normalize(vec3(0.5, 1., 0.));
    return normalize(p - LIGHT_SOURCE);
}

vec3 dirLight(vec3 p) {
    return normalize(vec3(-1., 1., 1.));
}

vec3 dirPerspective(vec2 uv, vec2 rot, vec2 fov){
    vec3 dir = normalize(vec3(0., 0., 1.));
    vec2 offset = uv - vec2(0.5);
    dir = rotated(dir, vec3(0., 1., 0.), rot.x);
    dir = rotated(dir,
                  rotated(vec3(1., 0., 0.), vec3(0., 1., 0.), rot.x),
                  rot.y);

    float x_rot, y_rot;
    x_rot = atan(offset.x/(tan(M_PI/2. - fov.x/2.)*0.5));
    y_rot = atan(offset.y/(tan(M_PI/2. - fov.y/2.)*0.5));

    dir = rotated(dir,
                  rotated(vec3(0., 1., 0.), vec3(1., 0., 0.), rot.y),
                  x_rot);
    dir = rotated(dir,
                  rotated(vec3(1., 0., 0.), vec3(0., 1., 0.), rot.x),
                  y_rot);
    return normalize(dir);
}

vec3 fakePerspective(vec2 uv, vec2 rot){
    vec3 dir = normalize(vec3(0., 0., 1.));
    vec2 offset = uv - vec2(0.5);
    dir = rotated(dir, vec3(0., 1., 0.), rot.x);
    dir = rotated(dir, vec3(1., 0., 0.), rot.y);

    dir += + vec3(cos(offset), 0.)/2.;
    return normalize(dir );
}

vec3 ray_march(vec2 uv){
    const int NUMBER_OF_STEPS = 100;
    const float EPS = 0.05;
//    vec3 origin = vec3(vec2(uv * SCREEN_SIZE), 0.);
    vec3 origin_offset = vec3(uv, 0.);
    vec3 origin = pos;

    vec3 dir = dirPerspective(uv, rot, vec2(1.2217, 1.2217));

    float s = 0.;
    for (int i = 0; i < NUMBER_OF_STEPS; i++) {
        vec3 curr = origin + dir * s;
        float d = dist(curr);
//        return vec3(d)/10.;
        if (d < 0.00005) {
            vec3 l = clamp(vec3(0.1), vec3(dot(light(curr),normal(curr))), vec3(1.));
            return l;
        } else {
         s += d;
        }
    }
    return vec3(0.);
}


void main() {
    //TODO NEFUNGUJE TYP
        fragColor = vec4(ray_march(UV) , 1.) + vec4(vec3(u_shapes[0].pos), 1.);
}
