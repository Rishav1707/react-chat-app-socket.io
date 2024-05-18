import axios from "axios";
import { BACKEND_BASE_URL } from "./loadEnv";

const fetchUserProfile = async () => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err.response);
    if (err.response.status === 401) {
      localStorage.removeItem("authtoken");
      window.location.reload();
    }
  }
};

const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/user/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const userById = async (userId) => {
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const addNewMessage = async (payload) => {
  try {
    await axios.post(`${BACKEND_BASE_URL}/chat/addMessages`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const getMessages = async (payload) => {
  try {
    const response = await axios.post(
      `${BACKEND_BASE_URL}/chat/getMessages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const incrementUnreadMsg = async (id) => {
  try {
    const response = await axios.put(
      `${BACKEND_BASE_URL}/user/unreadMessages/increment`,
      { id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
        },
      }
    );
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
};

export {
  fetchUserProfile,
  fetchAllUsers,
  userById,
  addNewMessage,
  getMessages,
  incrementUnreadMsg,
};
