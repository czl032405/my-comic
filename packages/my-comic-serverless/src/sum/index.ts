const main = async function(event, context) {
  console.log(event);
  return { sum: 3 };
};

export { main };
