export function getData(key: string, defaultValue?: string | null): string | null {
    if (localStorage.getItem(key) === "") {
        return defaultValue ? defaultValue : null
    }

    return localStorage.getItem(key)
}

export function putData(key: string, data: string) {
    localStorage.setItem(key, data)
}

export function removeData(key: string) {
    localStorage.removeItem(key)
}