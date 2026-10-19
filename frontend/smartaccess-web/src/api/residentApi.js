import axios from "axios";

const residentApi = axios.create({
    baseURL: "https://smartaccess-apim-carlos.azure-api.net/residents/api"
    // Sin cabeceras estáticas aquí tampoco
});

export const getResidents = async () => {
    const response = await residentApi.get("/residents");
    return response.data;
};

export const getResidentById = async (id) => {
    const response = await residentApi.get(`/residents/${id}`);
    return response.data;
};

export const createResident = async (resident) => {
    const response = await residentApi.post("/residents", resident);
    return response.data;
};

export const updateResident = async (id, resident) => {
    const response = await residentApi.put(`/residents/${id}`, resident);
    return response.data;
};

export const deleteResident = async (id) => {
    await residentApi.delete(`/residents/${id}`);
};