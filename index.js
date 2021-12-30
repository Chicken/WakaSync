import bent from "bent";
import mariadb from "mariadb";

const yesterday = new Date(Date.now() - 86400000);
const datestr = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;

const { data: [ data ] } = await bent("GET", "json", `https://wakatime.com/api/v1/users/current/summaries?start=${datestr}&end=${datestr}`)("", null, {
    Cookie: `session=${process.env.WAKA_SESSION}`
});

const conn = await mariadb.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATA
});

const date = Math.floor((new Date(data.range.date)).getTime() / 1000);
for (const editor of data.editors) {
    await conn.query(
        `INSERT INTO editors VALUES (?, ?, ?)`,
        [date, editor.name, Math.round(editor.total_seconds)]
    );
}
for (const language of data.languages) {
    await conn.query(
        `INSERT INTO languages VALUES (?, ?, ?)`,
        [date, language.name, Math.round(language.total_seconds)]
    );
}
for (const machine of data.machines) {
    await conn.query(
        `INSERT INTO machines VALUES (?, ?, ?)`,
        [date, machine.name, Math.round(machine.total_seconds)]
    );
}
for (const os of data.operating_systems) {
    await conn.query(
        `INSERT INTO os VALUES (?, ?, ?)`,
        [date, os.name, Math.round(os.total_seconds)]
    );
}
for (const project of data.projects) {
    await conn.query(
        `INSERT INTO projects VALUES (?, ?, ?)`,
        [date, project.name, Math.round(project.total_seconds)]
    );
}

await conn.end()

console.log("Data synced!");
