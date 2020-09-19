const httpError = (res, status, content) => {
  res.status(status);
  if (content instanceof Error) {
    console.log("ERROR\n", content, "\nERROR");
    res.json({ message: "Syntax or Reference Error" });
  } else if (typeof content === "string") {
    res.json({ message: content });
  } else {
    res.json(content);
  }
};

module.exports = httpError;
