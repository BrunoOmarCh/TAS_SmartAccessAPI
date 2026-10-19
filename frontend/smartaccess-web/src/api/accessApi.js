import axios from "axios";

const accessApi = axios.create({
    baseURL: "https://smartaccess-apim-carlos.azure-api.net/access/api"
    // Sin cabeceras estáticas aquí, el APIM se encargará de la pasarela de seguridad
});

export const getAccessRecords = async () => {
    const response = await accessApi.get("/access");
    return response.data;
};

export const getAccessById = async (id) => {
    const response = await accessApi.get(`/access/${id}`);
    return response.data;
};

export const getAccessByResident = async (residentId) => {
    const response = await accessApi.get(`/access/resident/${residentId}`);
    return response.data;
};

export const createAccess = async (access) => {
    const response = await accessApi.post("/access", access);
    return response.data;
};