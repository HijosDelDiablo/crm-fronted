import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export const getClients = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addClient = async (client) => {
  const res = await axios.post(API_URL, client);
  return { ...client, id: res.data.id || Math.floor(Math.random() * 1000) };
};

export const updateClient = async (id, client) => {
  const res = await axios.put(`${API_URL}/${id}`, client);
  return res.data;
};

export const deleteClient = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
