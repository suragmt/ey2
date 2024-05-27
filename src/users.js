import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API,
});
export async function getUsers() {
  try {
    const data = await instance.get("/users", { params: { pages: 2 } });
    return data.data.data;
  } catch (error) {
    console.log(error);
  }
}

export async function createUser(name){
    try {
        
      const response = await  instance.post('/users', {name, job: 'painter' })
      return response
    } catch (error) {
        console.log(error)
    }
}
