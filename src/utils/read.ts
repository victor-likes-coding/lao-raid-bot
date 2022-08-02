import fs from "fs";
export const read = (path: string) => {
    if (fs.existsSync(path)) {
        return fs.readdirSync(path).filter((file) => file.endsWith(".ts"));
    }
    console.log(`${path} doesn't exist??`);
    return [];
};
