import axios from 'axios'
import { logout, useAuthDispatch, useAuthState } from "../context/authContext";

export function useAxios() {
  const { token } = useAuthState();
  const dispatch = useAuthDispatch();

  axios.interceptors.request.use(request => {
    if (token) {
      request.headers.common['Authorization'] = `Bearer ${token}`
    }

    request.timeout = 20000;

    return request
  })

  axios.interceptors.response.use(response => {
    //backend
    // const { status, statusText, data } = response;
    return Promise.resolve(response);

  }, error => {
    //backend
    // const { status, statusText, data } = error.response
    const { status } = error.response
    if (status === 401) {
      logout(dispatch);
    }

    return Promise.reject(error)
  })
}
