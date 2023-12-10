let pressedRegistry: Map<string, boolean> = new Map()
let callbackRegistry: Map<string, ((key: string) => void)> = new Map()
export const register = (keys: string, callback: (key: string) => void) => {
    keys.split('').forEach(key => {
        if (!callbackRegistry.has(key)) {
            callbackRegistry.set(key, callback)
        } else {
            console.warn("Multiple callbacks registered for key:", key, ", only the first one will be called ")
        }
        window.addEventListener("keydown", (e) => {
            if (e.key == key) {
                pressedRegistry.set(key, true)
            }
        })
        window.addEventListener("keyup", (e) => {
            if (e.key == key) {
                pressedRegistry.set(key, false)
            }
        })
    })
}

export const handleInput = (delta: number) => {
    pressedRegistry.forEach((pressed, key) => {
        if (pressed) {
            let cb = callbackRegistry.get(key)
            if (cb) {
                cb(key)
            }


        }
    })
}
