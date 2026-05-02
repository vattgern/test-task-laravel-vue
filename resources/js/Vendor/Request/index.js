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
        return axios.post(route, data, configs)
            .then(r => r.data);
    },
    /**
     * GET запрос
     * @param {*} route url запроса
     * @param {*} config объект с настройками для axios
     * @returns Promise
     */
    get(route = '', config = {}) {
        return axios.get(route, config)
            .then(r => r.data)
    },
    /**
     * PATCH запрос
     * @param {String} route url запроса
     * @param {Object} data объект с данными
     * @param {Object} configs объект с конфигом для axios
     * @returns Promise
     */
    patch(route = '', data = {}, configs = {}) {
        return axios.patch(route, data, configs)
            .then(r => r.data)
    },
    /**
     * DELETE запрос
     * @param {*} route url запроса
     * @param {*} config объекта с настройками axios
     * @returns Promise
     */
    delete(route = '', config = {}) {
        return axios.delete(route, config)
            .then(r => r.data)
    }
}
