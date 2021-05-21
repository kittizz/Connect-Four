export const Clone = <T extends object>(value: T): T => {
    if (typeof value !== "object" || value === null) {
        return value
    }

    if (value instanceof Set) {
        return new Set(Array.from(value, Clone)) as T
    }

    if (value instanceof Map) {
        return new Map(Array.from(value, ([k, v]) => [k, Clone(v)])) as T
    }

    if (value instanceof Date) {
        return new Date(value) as T
    }

    if (value instanceof RegExp) {
        return new RegExp(value.source, value.flags) as T
    }

    return Object.keys(value).reduce((acc, key) => {
        return Object.assign(acc, { [key]: Clone(value[key]) })
    }, (Array.isArray(value) ? [] : {}) as T)
}
