precision mediump float;
#define SHAPE_SPHERE 1u
#define SHAPE_CUBE 2u
#define SHAPE_ARRAY_SIZE 1

uniform float time;



struct Shape {
    vec3 pos;
    vec3 rot;
    vec3 size;
    uint type; // SHAPE_**** constants
};

layout(std140) uniform ShapesBlock
{
    Shape[SHAPE_ARRAY_SIZE] u_shapes;
};

//const Shape shapes[SHAPE_ARRAY_SIZE] = Shape[SHAPE_ARRAY_SIZE](
//        Shape(vec3(0.1, 0.5, 0.5), vec3(0.), vec3(0.1), SHAPE_SPHERE),
//        Shape(vec3(0.5, 0.5, 0.5), vec3(0.), vec3(0.1), SHAPE_SPHERE),
//        Shape(vec3(0.6, 0.6, 0.7), vec3(0.), vec3(0.1), SHAPE_SPHERE)
//);
//const Shape shapes[SHAPE_ARRAY_SIZE] = Shape[SHAPE_ARRAY_SIZE](
//    Shape(vec3(0.3, 0.3, 1.05), vec3(0.), vec3(0.1), SHAPE_CUBE),
//    Shape(vec3(0.5, 0.3, 1.5), vec3(0.), vec3(0.1), SHAPE_CUBE),
//    Shape(vec3(0.5, 0.3, 2.), vec3(0.), vec3(0.1), SHAPE_CUBE),
//    Shape(vec3(0.5, 0.3, 2.5), vec3(0.), vec3(0.1), SHAPE_CUBE),
//    Shape(vec3(0.5, 0.3, 3.), vec3(0.), vec3(0.1), SHAPE_CUBE),
//    Shape(vec3(0.5, 0.3, 3.5), vec3(0.), vec3(0.1), SHAPE_CUBE),
//    Shape(vec3(0.5, 0.3, 4.), vec3(0.), vec3(0.1), SHAPE_CUBE),
//    Shape(vec3(0.5, 0.3, 5.), vec3(0.), vec3(0.1), SHAPE_CUBE),
//    Shape(vec3(0.7, 0.3, 1.05), vec3(0.), vec3(0.1), SHAPE_CUBE),
//    Shape(vec3(0.9, 0.9, 0.5), vec3(0.), vec3(0.05), SHAPE_SPHERE)
//);
//

float sphereDist(vec3 p, vec3 center, float radius) {
    return distance(p, vec3(center)) - radius;
}

vec3 sphereNormal(vec3 p, vec3 center) {
    return (center - p) / distance(p, center);
}

float cubeDist(vec3 p, vec3 center, vec3 rot, vec3 size) {


    vec3 normalFront = vec3(0., 0., -1.);
    vec3 normalBack = vec3(0., 0., 1.);
    vec3 normalRight = vec3(1., 0., 0.);
    vec3 normalLeft = vec3(-1., 0., 0.);
    vec3 normalDown = vec3(0., -1., 0.);
    vec3 normalUp = vec3(0., 1., 0.);

    vec3 originFront = center + vec3(0., 0., -size.z / 2.);
    vec3 originBack = center + vec3(0., 0., size.z / 2.);
    vec3 originRight = center + vec3(size.x / 2., 0., 0.);
    vec3 originLeft = center + vec3(-size.x / 2., 0., 0.);
    vec3 originDown = center + vec3(0., -size.y / 2., 0.);
    vec3 originUp = center + vec3(0., size.y / 2., 0.);

    vec3 normals[6] = vec3[6](normalFront, normalBack, normalRight, normalLeft, normalDown, normalUp);
    vec3 origins[6] = vec3[6](originFront, originBack, originRight, originLeft, originDown, originUp);

    float maximum = 0.;
    for (int i = 0; i < 6; i++) {
        maximum = max(dot(p - origins[i], normals[i]), maximum);
    }

    return maximum;
}

vec3 cubeNormal(vec3 p, vec3 center, vec3 rot, vec3 size) {
    vec3 normalFront = vec3(0., 0., -1.);
    vec3 normalBack = vec3(0., 0., 1.);
    vec3 normalRight = vec3(1., 0., 0.);
    vec3 normalLeft = vec3(-1., 0., 0.);
    vec3 normalDown = vec3(0., -1., 0.);
    vec3 normalUp = vec3(0., 1., 0.);

    vec3 originFront = center + vec3(0., 0., -size.z / 2.);
    vec3 originBack = center + vec3(0., 0., size.z / 2.);
    vec3 originRight = center + vec3(size.x / 2., 0., 0.);
    vec3 originLeft = center + vec3(-size.x / 2., 0., 0.);
    vec3 originDown = center + vec3(0., -size.y / 2., 0.);
    vec3 originUp = center + vec3(0., size.y / 2., 0.);

    vec3 normals[6] = vec3[6](normalFront, normalBack, normalRight, normalLeft, normalDown, normalUp);
    vec3 origins[6] = vec3[6](originFront, originBack, originRight, originLeft, originDown, originUp);

    float maximum = 0.;
    int normal_i = 0;
    for (int i = 0; i < 6; i++) {
        if (dot(p - origins[i], normals[i]) > maximum) {
            maximum = max(dot(p - origins[i], normals[i]), maximum);
            normal_i = i;
        }
    }

    return -normals[normal_i];
}


float floorDist(vec3 p, float height) {
    return p.y - height;
}

float shapeDist(vec3 p, Shape shape) {
    if (shape.type == SHAPE_SPHERE) {
        return sphereDist(p, shape.pos, shape.size.r);
    } else if (shape.type == SHAPE_CUBE) {
        return cubeDist(p, shape.pos, shape.rot, shape.size);
    }
}

vec3 shapeNormal(vec3 p, Shape shape) {
    if (shape.type == SHAPE_SPHERE) {
        return sphereNormal(p, shape.pos);
    } else if (shape.type == SHAPE_CUBE) {
        return cubeNormal(p, shape.pos, shape.rot, shape.size);
    }
}

float dist(vec3 p, Shape[SHAPE_ARRAY_SIZE] shape) {
    float minimum = 1000000.;
    for (int i = 0; i < SHAPE_ARRAY_SIZE; i++) {
        minimum = min(shapeDist(p, shapes[i]), minimum);
    }
    return minimum;
}

float dist(vec3 p) {
    return dist(p, shapes);
}


vec3 normal(vec3 p, Shape[SHAPE_ARRAY_SIZE] shape) {
    float minimum = 1000000.;
    int mini = 0;
    for (int i = 0; i < SHAPE_ARRAY_SIZE; i++) {
        float d = shapeDist(p, shapes[i]);
        if (d < minimum) {
            minimum = d;
            mini = i;
        }
    }
    return shapeNormal(p, shape[mini]);
}

vec3 normal(vec3 p) {
    return normal(p, shapes);
}

