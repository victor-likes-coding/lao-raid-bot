import fs from "fs";
export const read = (path: string) => {
    if (fileExists(path)) {
        return fs.readdirSync(path).filter((file) => file.endsWith(".ts"));
    }
    console.log(`${path} doesn't exist??`);
    return [];
};

export const fileExists = (path: string) => {
    return fs.existsSync(path);
};
