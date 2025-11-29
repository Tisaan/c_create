interface file {
	name: string,
	from: string // from where to copy them
}

interface folder {
	path: string,
	file ?: file[]
	from ?: string, // the imported files as susceptible to be overwrite by "file"
}



interface config {
	folder : Record<string, folder>,
	rules ?: Record<string, string>, // si tu croise la key tu exec la value dans un term,
	// overwrite toutes les autres file/folder
}

const _VERSION = "0.1.1";

async function exec_command(cmd:string) {
	let command;
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

async function main () {
	const text = await Deno.readTextFile("./src/scheme.json");
	const json: config = JSON.parse(text);
	outerloop: for (const [name, folder] of Object.entries(json.folder)){
		if (json.rules && json.rules[name]){
				await exec_command(json.rules[name]);
				continue outerloop;
		}
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
				if (json.rules && json.rules[file.name]){
					await exec_command(json.rules[file.name]);
					continue outerloop;
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