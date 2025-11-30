interface file {
	name: string,
	from: string // from where to copy them
}

interface folder {
	name:string
	path: string,
	file ?: file[]
	from ?: string, // the imported files as susceptible to be overwrite by "file"
}

interface rule{
	target: string[],
	cmd: string
	block: boolean
}

interface config {
	folder : folder[],
	rules ?: rule[], // si tu croise la key tu exec la value dans un term,
	// overwrite toutes les autres file/folder
}

const _VERSION = "0.1.4";

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

function build_rule(rules?: rule[]): Map<string, rule>{
	const map: Map<string, rule[]> = new Map();
	const list = new Array<rule>;
	if (rules){
		for (const rule of rules){
			for (const target of rule.target){
				map.set(target, )
			}
			if (rule.block)
				continue outerloop;
			break;
			}
		}
}

async function main () {
	const text = await open_file()	
	const json: config = JSON.parse(text);
	const rules = build_rule(json.rules)
	outerloop: for (const folder of json.folder){
		const name = folder.name;
		
		const folderpath = `${folder.path}/${name}`
		if (folder.from){
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
		if (folder.file)
		{
			for (const file of folder.file)
			{
				if (json.rules){
					for (const rule of json.rules){
						for (const target of rule.target){
							if (target == name){
								await exec_command(rule.cmd);
								if (rule.block)
									continue outerloop;
								break;
							}
						}
					}
				}
				const path = `${name}/${file.name}`;
				if (file.from){
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
			}
		}
	}
}

main()