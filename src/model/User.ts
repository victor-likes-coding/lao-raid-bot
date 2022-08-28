import { addDoc, collection, doc, DocumentData, getDocs, query, QueryDocumentSnapshot, setDoc, where } from "firebase/firestore";
import { db } from "../utils/client";

type DiscordDataUser = QueryDocumentSnapshot<DocumentData> | null;
type UserModel = {
    characters: string[];
    discord_user: string;
};

export class User {
    static table = "users";

    static async add(options: UserModel) {
        try {
            const doc = await addDoc(collection(db, this.table), options);
            return doc;
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    static async getByDiscordId(id: string): Promise<DiscordDataUser> {
        let document = null;
        const usersRef = query(collection(db, this.table), where("discord_user", "==", id));
        const users = await getDocs(usersRef);
        users.forEach((doc) => {
            if (doc.data().discord_user === id) {
                document = doc;
            }
        });
        return document;
    }

    static async getById(id: string) {
        let document: QueryDocumentSnapshot<DocumentData> = null;
        try {
            const ref = await getDocs(collection(db, this.table));
            ref.forEach((doc) => {
                if (doc.id === id) {
                    document = doc;
                }
            });

            return document;
        } catch (e) {
            throw Error("There was an issue getting a user by their id");
        }
    }

    // checks if the doc exists
    // static async exists(doc: QueryDocumentSnapshot<DocumentData>) {
    //     return !!doc;
    // }

    static async addCharacter(data: QueryDocumentSnapshot<DocumentData>, characterId: string, userId: string) {
        const document = data.data();
        document.characters.push(characterId);
        try {
            await setDoc(doc(db, this.table, userId), document);
        } catch (e) {
            return e;
        }
    }
}
