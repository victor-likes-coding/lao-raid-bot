import { ActionRowBuilder, SelectMenuBuilder } from "discord.js";

const times = [];

for (let i = 0; i < 24; i++) {
    times.push(`${Math.floor(i / 10)}${i}:00`);
}

export class Raid {
    // tag should be a discord tag
    menus = {};
    selectMenus = {};

    constructor(tag) {
        this.host = tag;
        this.setup();
    }

    generateMenu = (list) => {
        return list.reduce((prev, current, index) => {
            return prev.concat({
                label: current,
                value: index.toString(),
            });
        }, []);
    };

    setup = () => {
        // sets up the menus of the raid object

        // we have actual raids menu and a dates menu as well as a time menu
        // raid menu
        this.menus["raid"] = this.generateMenu(["Argos P1", "Argos P2", "Argos P3", "Valtan NM", "Valtan HM", "Vykas NM", "Vykas HM"]);
        this.menus["date"] = this.generateMenu(["Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday"]);
        this.menus["time"] = this.generateMenu(times);

        // selectmenus
        this.selectMenus["raid"] = this.createSelectMenus("raid", "Select Raid");
        this.selectMenus["date"] = this.createSelectMenus("date", "Select Date");
        this.selectMenus["time"] = this.createSelectMenus("time", "Select Time");
    };

    createSelectMenus = (type, placeholder) => {
        return new ActionRowBuilder().addComponents(new SelectMenuBuilder().setCustomId(type).setPlaceholder(placeholder).addOptions(this.menus[type]));
    };
}

export const raid = new Raid();
