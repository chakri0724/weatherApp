

    export const getList = (key) => {
        return JSON.parse(sessionStorage.getItem(key));
    }
    export const setList = (key, data) => {
        sessionStorage.setItem(key, JSON.stringify(data))
    }
