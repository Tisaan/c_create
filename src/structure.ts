export interface file {
	name: string,
	from: string // from where to copy them
}

export interface folder {
	name:string
	path: string,
	file ?: file[]
	from ?: string, // the imported files as susceptible to be overwrite by "file"
}

export interface rule{
	target: string[],
	before: string
    after: string
    replace: string
}

export interface _rule{
	before: string
    after: string
    replace: string
}

export interface config {
	folder : folder[],
	rules ?: rule[], // si tu croise la key tu exec la value dans un term,
	// overwrite toutes les autres file/folder
}