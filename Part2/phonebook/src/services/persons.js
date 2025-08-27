import axios from "axios";

const baseUrl = 'http://localhost:3001/persons'

export const addPerson = person => {
    const request = axios.post(baseUrl, person);
    return request.then(request =>
        request.data
    )
}

export const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(request =>
        request.data
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