import axios from "axios";

export default {
    /**
     * POST запрос
     * @param {String} route url запроса
     * @param {Object} data объект с данными
     * @param {Object} configs объект с конфигом для axios
     * @returns Promise
     */
    post(route = '', data = {}, configs = {}) {
        return new Promise((resolve, reject) => {
            axios.post(route, data, configs)
                .then(r => {
                    resolve(r.data)
                })
                .catch((f) => {
                    reject(f)
                })
        })
    },
    /**
     * GET запрос
     * @param {*} route url запроса
     * @param {*} config объект с настройками для axios
     * @returns Promise
     */
    get(route = '', config = {}) {
        return new Promise((resolve, reject) => {
            axios.get(route, config)
                .then(r => {
                    resolve(r.data)
                })
                .catch((f) => {
                    reject(f)
                })
        })
    },
    /**
     * PATCH запрос
     * @param {String} route url запроса
     * @param {Object} data объект с данными
     * @param {Object} configs объект с конфигом для axios
     * @returns Promise
     */
    patch(route = '', data = {}, configs = {}) {
        return new Promise((resolve, reject) => {
            axios.patch(route, data, configs)
                .then(r => {
                    resolve(r.data)
                })
                .catch((f) => {
                    reject(f)
                })
        })
    },
    /**
     * DELETE запрос
     * @param {*} route url запроса
     * @param {*} config объекта с настройками axios
     * @returns Promise
     */
    delete(route = '', config = {}) {
        return new Promise((resolve, reject) => {
            axios.delete(route, config)
                .then(r => {
                    resolve(r.data)
                })
                .catch((f) => {
                    reject(f)
                })
        })
    }
}
