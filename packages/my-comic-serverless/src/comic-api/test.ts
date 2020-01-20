import { main } from "./index";

let test = async function() {
  let result = await main(
    {
      api: "pica",
      method: "comics",
      params: {
        s: "dd",
        t: undefined,
        c: "禁書目錄",
        k: undefined
      }
    },
    {}
  );
  console.info(result);
};

test();
