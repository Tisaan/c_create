export interface file {
	name: string,
	from ?: string // from where to copy them
}

export interface folder {
	name:string
	file ?: file[]
	folder ?: folder[],
	from ?: string, // the imported files as susceptible to be overwrite by "file"
}

export interface rule {
	init ?: string[],
	end ?: string[],
	rule: target_rule[]
}

export interface target_rule{
	target: string[],
	before?: string
    after?: string
    replace?: string
}

export interface tar_rule{
	before?: string
    after?: string
    replace?: string
}

export interface _rule {
	init ?: string[],
	end ?: string[],
	rule: Map<string, tar_rule[]>
}

export interface config {
	folder : folder[],
	rules ?: rule, // si tu croise la key tu exec la value dans un term,
	// overwrite toutes les autres file/folder
}