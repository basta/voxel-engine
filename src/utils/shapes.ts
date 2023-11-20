import {vec3, mat3, mat4} from "gl-matrix";
import {logMat4} from "./logging.ts";
let test = mat4.create()
logMat4(mat4.fromRotation(test, 3.1415/2, vec3.fromValues(1, 0, 0)))
export const cubePositions = (center: vec3, size: number) => {
    let half = size/2
    let [x, y, z] = center
    let positions: number[] = [
        x - half, y + half, z - half, //f u l
        x + half, y + half, z - half, // f u r
        x - half, y - half, z - half, // f d l
        x + half, y - half, z - half, // f d r,
        x + half, y + half, z - half, // r u l
        x + half, y - half, z + half, // r d r
        x + half, y + half, z + half, //
        x + half, y + half, z - half
    ]
    return positions
}

export const squarePositions = (center: vec3, normal: vec3, rot: number, size: number) => {
    let rotMat = mat3.create()
    mat3.rotate()
}
