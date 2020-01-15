import Axios from "axios";
export async function main(event, context) {
  const { method, params } = event;
  const BASE_URL = `https://my-comic.herokuapp.com/pica/`;
  let url = `${BASE_URL}${method}`;

  let result = await Axios({
    method: "GET",
    url,
    params
  });

  return result.data;
}
