import {rule, config, _rule} from "./structure.ts"

const _VERSION = "0.1.5";

async function exec_command(cmd:string) {
	let command;
	if (!cmd)
		return ;
	if (Deno.build.os === "windows") {
		command = new Deno.Command("cmd.exe", {
			args: ["/c", cmd],
			stdout: "piped",
			stderr: "piped",
		});
	} else {
		command = new Deno.Command("sh", {
			args: ["-c", cmd],
			stdout: "piped",
			stderr: "piped",
		});
	}

	const { stdout, stderr, success } = await command.output();
	const decoder = new TextDecoder();
	console.log(decoder.decode(stdout));

	if (!success) {
		console.error(decoder.decode(stderr));
	}
}

async function open_file()
{
	let text;
	if (Deno.args.length > 0)
	{
		text = await Deno.readTextFile(Deno.args[0]);
	} else {
		text = await Deno.readTextFile("./src/scheme.json");
	}
	return (text);
}

function build_rule(rules?: rule[]): Map<string, _rule[]>{
	const map: Map<string, _rule[]> = new Map();
	let list: _rule[]|undefined;
	if (rules){
		for (const rule of rules){
			for (const target of rule.target){
				list = map.get(target);
				if (list){
					list?.push({
						after: rule.after,
						replace: rule.replace,
						before: rule.before,
					} as _rule)
					map.set(target, list);
				} else {
					list = [{
						after: rule.after,
						replace: rule.replace,
						before: rule.before,
					} as _rule]
					map.set(target, list);
				}
			}
		}
		return map;
	}
	return map;
}

async function main () {
	const text = await open_file()	
	const json: config = JSON.parse(text);
	const rules = build_rule(json.rules)
	for (const folder of json.folder){
		const name = folder.name;
		let targetrules = rules.get(name);
		//exec folder.rule.before
		if (targetrules)
		{
			for (const rule of targetrules){
				if (rule.before)
					await exec_command(rule.before);
			}
		}
		const folderpath = `${folder.path}/${name}`
		//copy/create folder
		if (targetrules){
			for (const rule of targetrules){
				if (rule.replace)
					await exec_command(rule.replace);
			}
		} else if (folder.from){
			const fpath = `${folder.from}/${name}`;
			try {
				await Deno.copyFile(fpath, folderpath);
				console.log(`File "${fpath}" copied to "${folderpath}" successfully.`);
			} catch (error) {
				console.error(`Error copying file "${fpath}" to "${folderpath}":`, error);
			}   
		} else { 
			try {
				await Deno.mkdir(folderpath);
				console.log(`Directory "${folderpath}" created successfully.`);
			} catch (error) {
				if (error instanceof Deno.errors.AlreadyExists) {
					console.log(`Directory "${folderpath}" already exists.`);
				} else {
					console.error(`Error creating directory "${folderpath}":`, error);
				}
			}
		}
		//exec folder.rule.after
		if (targetrules)
		{
			for (const rule of targetrules){
				if (rule.after)
					await exec_command(rule.after);
			}
		}

		if (folder.file)
		{
			for (const file of folder.file)
			{
				const path = `${name}/${file.name}`;
				targetrules = rules.get(path);
				//exec file.rule.before
				if (targetrules)
				{
					for (const rule of targetrules){
						if (rule.before)
							await exec_command(rule.before);
					}
				}
				//replace cmd/create/copy file
				if (targetrules)
				{
					for (const rule of targetrules){
						if (rule.replace)
							await exec_command(rule.replace);
					}
				} else if (file.from){
					const fpath = `${file.from}/${file.name}`;
					try {
						await Deno.copyFile(fpath, path);
						console.log(`File "${file.from}" copied to "${path}" successfully.`);
					} catch (error) {
						console.error(`Error copying file "${fpath}" to "${path}":`, error);
					}   
				} else { 
					try {
						await Deno.writeTextFile(path, "");
						console.log(`File "${path}" created successfully.`);
					} catch (error) {
						console.error(`Error creating file "${name}":`, error);
					}
				}
				//exec file.rule.after
				if (targetrules){
					for (const rule of targetrules){
						if (rule.after)
							await exec_command(rule.after);
					}
				}
			}
		}
	}
}

main()