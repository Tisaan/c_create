# C_Create

# Purpose

C_create is a tool to create a folder hierarchy,
It require [Deno](https://Deno.com/) 

## Syntax
The principale structure is `Config`, it contains 2 optional structure
`folder` and `rules` which are respectively *folder[]* and *Rules[]*, all **path**are for now relative:
`folder` contains:<br>&emsp;
    - **name**|`string`|: name of the folder,<br>&emsp;
    - **path**|`string`|: the path where the folder will be created.<br>&emsp;
    - **from**|`string?`|: if it exist copy the folder at this location to **path**, and don't create new one<br>&emsp;
    - **file**|`file[]?`|: list of `file` that would be the folder <br>
    - **folder**|`folder[]?`|: list of `folder` that would be the folder <br>
`file` contains:<br>&emsp;
    - **name**|`string`|: name of the file<br>&emsp;
    - **from**|`string?`|: if it exist copy the folder at this location to **path**, and don't create new one<br>&emsp;
`rules` contains:<br>&emsp;
    - **init**|`string[]`|: list of command to execute before the creation of folders/files
    - **end**|`string[]`|: list of command to execute after the creation of folders/files
    - **rule**|`rule`|: the list of rule targetting file/folder
`rule` contains:<br>&emsp;
    - **target**|`string[]`|: a list of the name of the folder/file that would be targeted by the rule,<br>&emsp;
	- **before**|`string`|: a command is execute before the creating/copy,<br>&emsp;
	- **after**|`string`|: a command is execute after the creating/copy,<br>&emsp;
	- **replace**|`string`|: a command is execute replace the creating/copy,
## Example
```json
{
    "folder": [
        {
            "name": "utils",
            "path": "."
        },
        {
            "name": "parsing",
            "path": ".",
            "file":[
                {
                    "name": "check.c"
                }
            ]
        },
        {
            "name": "srcs",
            "path": ".",
            "file":[
            {
                "name": "push_swap.c"
            },
            {
                "name": "index.c"
            }

        ]
        } ,
        {
            "name": "includes",
            "path": ".",
            "file":[
                {
                    "name":"push_swap.h"
                }
            ]
        }
    ],

    "rules" : {
        "init": ["git init"],
        "end": ["git add .", "git status"],
        "rule": [
            {
                "target": "chose",
                "before": "echo fait truc"
            }
        ]
    }
}
```
## Patch-Note
### 0.1:
- initial commit
### 0.1.1:
- Change `folder` and `rules` structure and `rules` checking
- Fix a bug where `file` not check for `rules`
### 0.1.2
- add argv[0] to be a custom scheme
### 0.1.3
- BUG: don't match unnamed `rule` with unname `folder`/`file`
- BUG: don't execute unspecified command
- Change rules definion from `record<string, string>` to `rule[]`
### 0.1.4
- `rule.target` is now a `string[]`
- `rule.block` now skip after the rule is apply for each target
### 0.1.5
- move the json type structure to **structure.ts**
- add `_rule` which is use to create a rule Hashtable
- `rule.block` and `rule.cmd` has been removed
- add `rule.before` and `rule.after` to exec before/after the creation/copy
- add `rule.replace` to exec a command that replace the copy/creation
### 0.1.6
- allow for `folder` to be recursive by add `.folder` to the `folder` type
- BUG: `file.from` was always expected in the type structure
### 0.1.7
- Add `rule.init` and `rule.end` which is command before/after the creation of folder/file
- `rule` is move to `rules.rule`
- Change `_rule` to reflect this changes
- Change the [example](#example) to reflect this changes
## Future Changes
- support for TON file format
- better Commandline arguments
- Better output,
- Possible logging
- enhance rules
- Modular/Costumizable structure
- add support for absolute path