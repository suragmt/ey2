import axios from "axios";
import { getAuthToken, getRefreshToken } from "./Routes/localstorage";
const fileDownload = require("js-file-download");
const instance = axios.create({
  baseURL: process.env.REACT_APP_API,
});

let isPublic = false;
let isFormData = false;
export const fetch = async (payload) => {
  let requestPayload = {};
  if (payload.api.isQueryString) {
    const query = Object.keys(payload.data)
      .map((key) => `${key}=${payload.data[key]}`)
      .join("$");
    requestPayload.url = `${payload.api.url}?${query}`;
  } else if (payload.api.isFormData) {
    isFormData = true;
    const form = new FormData();
    Object.keys(payload.data).map((key) => {
      form.append(key, payload.data[key]);
    });
    requestPayload = { url: payload.data.url, data: form };
  } else {
    requestPayload = payload.data
      ? { data: payload.data, url: payload.api.url }
      : { url: payload.api.url };
  }

  switch (payload.api.type) {
    case "get":
      return await getRequest(requestPayload);
    case "post":
      return await postRequest(requestPayload);
    case "delete":
      return await deleteRequest(requestPayload);
    default:
      return null;
  }
};

const getRequest = async ({ url, data }) => {
  const response = await instance.get(url, data);
  return response;
};

const postRequest = async ({ url, data }) => {
  const response = await instance.post(url, data);
  return response;
};

const deleteRequest = async ({ url, data }) => {
  const response = await instance.delete(url, data);
  return response;
};

const putRequest = async ({ url, data }) => {
  const response = await instance.put(url, data);
  return response;
};

instance.interceptors.request.use(
  async (config) => {
    const token = getAuthToken();
    if (!isPublic) {
      if (token) {
        config.headers["Authorization"] = "Bearer " + token;
      } else {
        const configData = await Promise.reject({ message: "Access denied" });
        return configData;
      }
    }

    if (isFormData) {
      config.headers = {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      };
    }

    return config;
  },
  async function (error) {
    return Promise.reject({ message: error });
  }
);

instance.interceptors.response.use(
  async (response) => {
    let fileName = "sample";
    let deposition = response.headers["content-disposition"];
    if (deposition && deposition.indexOf("attachment") === -1) {
      let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      let matches = filenameRegex.exec(deposition);
      if (matches != null && matches[1]) {
        fileName = matches[1].replace(/['"]/, "");
      }
    }

    if (response.headers["Content-Type"] === "application/csv;charset=UTF-8") {
      fileDownload(response.data, `${fileName}.csv`);
    } else if (
      response.headers["Content-Type"] === "application/pdf; charset=utf-8"
    ) {
      fileDownload(response.data, `${fileName}.csv`);
    }
  },
  async (error) => {
    try {
      if (error.message) {
        const errorData = await Promise.reject({
          message: "api.errors.noService",
        });
        return errorData;
      } else if (error.response && error.response.status === 401) {
        const refreshToken = getRefreshToken();

        const response = await instance.get("/refreshToken", null, {
          params: { refreshToken },
        });

        if (refreshToken.status === 401) {
          return Promise.reject({ message: "Access denied" });
        } else {
          axios.defaults.headers.common["Authorization"] = response.token;
          const originalRequest = error.config;
          const repeatedRequest = instance.request(originalRequest);
          return repeatedRequest;
        }
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
);
