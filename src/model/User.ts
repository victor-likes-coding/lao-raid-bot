import { addDoc, collection, DocumentData, getDocs, query, QueryDocumentSnapshot, where } from "firebase/firestore";
import { db } from "../utils/client";

type DiscordDataUser = QueryDocumentSnapshot<DocumentData> | null;

export class User {
    static table = "users";

    static async add<C>(options: C) {
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

    static async exists(doc: QueryDocumentSnapshot<DocumentData>, id: string) {
        if (!doc) {
            //     // create user model and update var
            const data: DocumentData = {
                discord_user: id,
                characters: [],
            };
            // make the user/add user to db
            const newDoc = await User.add(data);
            return newDoc;
        }
        return doc;
    }
}
