import * as ProxyAgent from "proxy-agent";
import Axios from "axios";

if (process.env.HTTPS_PROXY) {
  const httpsProxyAgent = new ProxyAgent(process.env.HTTPS_PROXY);
  console.info("HTTPS_PROXY", process.env.HTTPS_PROXY);
  Axios.defaults.httpsAgent = httpsProxyAgent;
  Axios.defaults.proxy = false;
}

if (process.env.HTTP_PROXY) {
  const httpProxyAgent = new ProxyAgent(process.env.HTTP_PROXY);
  console.info("HTTP_PROXY", process.env.HTTP_PROXY);
  Axios.defaults.httpAgent = httpProxyAgent;
  Axios.defaults.proxy = false;
}

// if (process.env.SOCKS_PROXY) {
//   const socksProxyAgent = new ProxyAgent(process.env.SOCKS_PROXY);
//   console.info("SOCKS_PROXY", process.env.SOCKS_PROXY);
//   Axios.defaults.httpsAgent = socksProxyAgent;
//   Axios.defaults.proxy = false;
// }
