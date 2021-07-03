import { Definition, ApplicationCommand } from "./discord_type_extensions";
import { Client, Snowflake } from "discord.js";
import fetch from "node-fetch";
import { SlashCommand } from ".";

async function delay(millis: number) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(0), millis);
    });
}

export async function postGuildCommand(
    client: Client,
    definition: Definition,
    guild_id: string
) {
    var url = `https://discord.com/api/v8/applications/${client.user!.id
        }/guilds/${guild_id}/commands`;
    while (true) {
        var res = await fetch(url, {
            headers: {
                Authorization: `Bot ${client.token}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(definition),
        });
        var json = await res.json();
        console.log(
            `Posting new command definition to guild with id ${guild_id}\nGot status ${res.status
            } ${res.statusText}\nResponse:\n${JSON.stringify(json)}\n`
        );
        if (res.status == 429) {
            console.log("Got status code 429 waiting for rate limit to finish.");
            var time: number = json.retry_after;
            await delay(time * 1000);
            console.log("Retrying...");
            continue;
        }
        break;
    }
}
export async function postGlobalCommand(
    client: Client,
    definition: Definition
) {
    var url = `https://discord.com/api/v8/applications/${client.user!.id
        }/commands`;
    while (true) {
        var res = await fetch(url, {
            headers: {
                Authorization: `Bot ${client.token}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(definition),
        });
        var json = await res.json();
        console.log(
            `Posting new global command definition\nGot status ${res.status} ${res.statusText
            }\nResponse:\n${JSON.stringify(json)}\n`
        );
        if (res.status == 429) {
            console.log("Got status code 429 waiting for rate limit to finish.");
            var time: number = json.retry_after;
            await delay(time * 1000);
            console.log("Retrying...");
            continue;
        }
        break;
    }
}

export async function patchGuildCommand(
    client: Client,
    definition: Definition,
    command_id: Snowflake,
    guild_id: string
) {
    var url = `https://discord.com/api/v8/applications/${client.user!.id
        }/guilds/${guild_id}/commands/${command_id}`;
    while (true) {
        var res = await fetch(url, {
            headers: {
                Authorization: `Bot ${client.token}`,
                "Content-Type": "application/json",
            },
            method: "PATCH",
            body: JSON.stringify(definition),
        });
        var json = await res.json();
        console.log(
            `Patched an existing command definition in guild with id ${guild_id}\nGot status ${res.status
            } ${res.statusText}\nResponse:\n${JSON.stringify(json)}\n`
        );
        if (res.status == 429) {
            console.log("Got status code 429 waiting for rate limit to finish.");
            var time: number = json.retry_after;
            await delay(time * 1000);
            console.log("Retrying...");
            continue;
        }
        break;
    }
}

export async function patchGlobalCommand(
    client: Client,
    definition: Definition,
    command_id: Snowflake
) {
    var url = `https://discord.com/api/v8/applications/${client.user!.id
        }/commands/${command_id}`;
    while (true) {
        var res = await fetch(url, {
            headers: {
                Authorization: `Bot ${client.token}`,
                "Content-Type": "application/json",
            },
            method: "PATCH",
            body: JSON.stringify(definition),
        });
        var json = await res.json();
        console.log(
            `Patched an existing global command definition\nGot status ${res.status
            } ${res.statusText}\nResponse:\n${JSON.stringify(json)}\n`
        );
        if (res.status == 429) {
            console.log("Got status code 429 waiting for rate limit to finish.");
            var time: number = json.retry_after;
            await delay(time * 1000);
            console.log("Retrying...");
            continue;
        }
        break;
    }
}

export async function deleteGuildCommand(
    client: Client,
    command_id: Snowflake,
    guild_id: string
) {
    var url = `https://discord.com/api/v8/applications/${client.user!.id
        }/guilds/${guild_id}/commands/${command_id}`;
    var res = await fetch(url, {
        headers: {
            Authorization: `Bot ${client.token}`,
            "Content-Type": "application/json",
        },
        method: "DELETE",
        body: "false",
    });
    await res.text();
    console.log(
        `Deleted a definition in guild with id ${guild_id}\nGot status ${res.status} ${res.statusText}\n`
    );
}

export async function deleteGlobalCommand(
    client: Client,
    command_id: Snowflake
) {
    var url = `https://discord.com/api/v8/applications/${client.user!.id
        }/commands/${command_id}`;
    var res = await fetch(url, {
        headers: {
            Authorization: `Bot ${client.token}`,
            "Content-Type": "application/json",
        },
        method: "DELETE",
        body: "false",
    });
    await res.text();
    console.log(
        `Deleted a global command definition\nGot status ${res.status} ${res.statusText}\n`
    );
}
export async function getGuildCommands(client: Client, guild_id: string) {
    var url = `https://discord.com/api/v8/applications/${client.user!.id
        }/guilds/${guild_id}/commands`;
    var res = await fetch(url, {
        headers: {
            Authorization: `Bot ${client.token}`,
            method: "GET",
        },
    });
    var json = await res.json();
    console.log(
        `Getting commands for guild with id ${guild_id}\nGot status ${res.status} ${res.statusText}\n`
    );
    return json as ApplicationCommand[];
}

export async function getGlobalCommands(client: Client) {
    var url = `https://discord.com/api/v8/applications/${client.user!.id
        }/commands`;
    var res = await fetch(url, {
        headers: {
            Authorization: `Bot ${client.token}`,
            method: "GET",
        },
    });
    var json = await res.json();
    console.log(
        `Getting global commands\nGot status ${res.status} ${res.statusText}\n`
    );
    return json as ApplicationCommand[];
}

export async function registerGuildCommands(
    client: Client,
    slashCommands: Iterable<SlashCommand>,
    guild_id: string
) {
    var commands = [...slashCommands];
    var postCmds = new Set<SlashCommand>(commands);
    for (var prevCmd of await getGuildCommands(client, guild_id)) {
        var foundCmd = commands.find((cmd) => cmd.definition.name == prevCmd.name);
        if (foundCmd) {
            await patchGuildCommand(
                client,
                foundCmd.definition,
                prevCmd.id,
                guild_id
            );
            postCmds.delete(foundCmd);
        } else {
            await deleteGuildCommand(client, prevCmd.id, guild_id);
        }
    }
    for (var postCmd of postCmds) {
        await postGuildCommand(client, postCmd.definition, guild_id);
    }
}

export async function registerGlobalCommands(
    client: Client,
    slashCommands: Iterable<SlashCommand>
) {
    var commands = [...slashCommands];
    var postCmds = new Set<SlashCommand>(commands);
    for (var prevCmd of await getGlobalCommands(client)) {
        var foundCmd = commands.find((cmd) => cmd.definition.name == prevCmd.name);
        if (foundCmd) {
            await patchGlobalCommand(client, foundCmd.definition, prevCmd.id);
            postCmds.delete(foundCmd);
        } else {
            await deleteGlobalCommand(client, prevCmd.id);
        }
    }
    for (var postCmd of postCmds) {
        await postGlobalCommand(client, postCmd.definition);
    }
}
