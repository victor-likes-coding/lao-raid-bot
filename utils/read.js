import fs from "fs";

export const read = (path) => {
  return fs.readdirSync(path).filter((file) => file.endsWith(".js"));
};
