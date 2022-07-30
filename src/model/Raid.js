import { ActionRowBuilder, SelectMenuBuilder } from "discord.js";

const times = [];

for (let i = 0; i < 24; i++) {
    times.push(`${Math.floor(i / 10)}${i % 10}:00`);
}

export class Raid {
    // tag should be a discord tag
    static menus = {};
    static selectMenus = {};
    static __currentUpdater = "";
    static __updaterId = null;
    static __raid = "";
    static __date = "";
    static __time = "";

    static generateMenu = (list) => {
        return list.reduce((prev, current, index) => {
            return prev.concat({
                label: current,
                value: index.toString(),
            });
        }, []);
    };

    static setup = () => {
        // sets up the menus of the raid object

        // we have actual raids menu and a dates menu as well as a time menu
        // raid menu
        this.menus["raid"] = Raid.generateMenu(["Argos P1", "Argos P2", "Argos P3", "Valtan NM", "Valtan HM", "Vykas NM", "Vykas HM"]);
        this.menus["date"] = Raid.generateMenu(["Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday"]);
        this.menus["time"] = Raid.generateMenu(times);

        // selectmenus
        this.selectMenus["raid"] = Raid.createSelectMenus("raid", "Select Raid");
        this.selectMenus["date"] = Raid.createSelectMenus("date", "Select Date");
        this.selectMenus["time"] = Raid.createSelectMenus("time", "Select Time");
    };

    static createSelectMenus = (type, placeholder) => {
        return new ActionRowBuilder().addComponents(new SelectMenuBuilder().setCustomId(type).setPlaceholder(placeholder).addOptions(this.menus[type]));
    };

    static getUpdater = () => {
        return this.__currentUpdater;
    };

    static addUpdater = (tag) => {
        this.__currentUpdater = tag;
        return this;
    };

    static getUpdaterId = () => {
        return this.__updaterId;
    };

    static addUpdaterId = (id) => {
        this.__updaterId = id;
        return this;
    };
}
