import {folder, rule, _rule, tar_rule, config } from "./structure.ts"

const _VERSION = "0.1.7";

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
		text = await Deno.readTextFile("scheme.json");
	}
	return (text);
}

function build_rule(rules?: rule): _rule{
	const map: _rule = {
		rule: new Map<string, tar_rule[]>()
	};
	if (rules){
		const init: Array<string> = [];
		const end: Array<string> = [];
		if (rules.init){
			for (const rulinit of rules.init){
				init.push(rulinit);
			}
			map.init = init;
		}
		if (rules.end){
			for (const rulend of rules.end){
				end.push(rulend);
			}
			map.end = end;
		}
		if (rules.rule){

			for (const target_rule of rules.rule){
				for (const target of target_rule.target){
					let list = map.rule.get(target);
					if (list){
						list.push({
							after: target_rule.after,
							before: target_rule.before,
							replace: target_rule.replace,
						})
					} else {
						list = [{
							after: target_rule.after,
							before: target_rule.before,
							replace: target_rule.replace,
						}]
					}
					map.rule.set(target, list);
				}

			}
		}
	}
	return map;
}

async function build_file(folder: folder, rules: Map<string, tar_rule[]>){
	for (const file of folder.file!)
	{
		const path = `${folder.name}/${file.name}`;
		const targetrules = rules.get(path);
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

async function build_folder(folder: folder, rules: _rule){
	const name = folder.name;
	const targetrules = rules.rule.get(name);
	//exec folder.rule.before
	if (targetrules){
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
	if (folder.folder){
		for (const fol of folder.folder)
			build_folder(fol, rules);
	}
	if (folder.file)
		build_file(folder, rules.rule)
}

async function main () {
	const text = await open_file()	
	const json: config = JSON.parse(text);
	const rules = build_rule(json.rules)
	if (rules.init)
		for (const cmd of rules.init){
			await exec_command(cmd);
		}
	for (const folder of json.folder){
		build_folder(folder, rules);
	}

	if (rules.end)
		for (const cmd of rules.end){
			await exec_command(cmd);
		}
}

main()