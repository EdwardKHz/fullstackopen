import axios from "axios";

const baseUrl = '/api/persons';

export const addPerson = person => {
    return axios.post(baseUrl, person).then(res => ({
        name: res.data.name,
        number: res.data.number,
        id: res.data._id
    }))
}

export const getAll = () => {
    return axios.get(baseUrl).then(res =>
        res.data.map(p => ({
            name: p.name,
            number: p.number,
            id: p._id
        }))
    )
}

export const deletePerson = id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(request =>
        request.data
    )
}

export const updatePerson = (id, newPerson) => {
    const request = axios.put(`${baseUrl}/${id}`, newPerson);
    return request.then(request =>
        request.data
    )
}


export default {addPerson, getAll, deletePerson, updatePerson};