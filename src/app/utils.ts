import * as BABYLON from 'babylonjs'

// Get radiant value from degree
export function Rad(val: number): number {
    return (val == 0) ? 0 : val * Math.PI / 180
}

// Vector for rotation with degree as unit
export function RadRotVect({ x = 0, y = 0, z = 0 }): BABYLON.Vector3 {
    return new BABYLON.Vector3(Rad(x), Rad(y), Rad(z))
}