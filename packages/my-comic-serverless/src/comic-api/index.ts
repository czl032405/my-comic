import Axios from "axios";
export async function main(event, context) {
  const { api = "", method = "", params = {} } = event;
  // const BASE_URL = `http://api.pingcc.cn/`;
  // let url = `${BASE_URL}${method}`;

  // let result = await Axios({
  //   method: "GET",
  //   url,
  //   params
  // });

  // return result.data;
}
