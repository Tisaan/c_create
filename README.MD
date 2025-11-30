# C_Create

## Purpose
C_create is a tool to create a folder hierarchy,
It require [Deno](https://Deno.com/) 

## Syntax
The principale structure is `Config`, it contains 2 optional structure
`folder` and `rules` which are respectively *folder[]* and *Rules[]*, all **path** are for now relative<br>
`folder` contains:<br>&emsp;
    - **name**|`string`|: name of the folder,<br>&emsp;
    - **path**|`string`|: the path where the folder will be created.<br>&emsp;
    - **from**|`string`|: if it exist copy the folder at this location to **path**, and don't create new one<br>&emsp;
    - **file**|`file[]`|: list of `file` that would be the folder <br>
`file` contains:<br>&emsp;
    - **name**|`string`|: name of the file<br>&emsp;
    - **from**|`string`|: if it exist copy the folder at this location to **path**, and don't create new one<br>&emsp;
`rules` constains:<br>&emsp;
    - **target**|`string[]`|: a list of the name of the folder/file that would be targeted by the rule,<br>&emsp;
    - **cmd**|`string`|: a command that would be executed on the current terminal<br>&emsp;
    - **block**|`boolean`|: represent if the execution of the command would block the creation/copy of the target<br>&emsp;
## Example
A simple json file that create a folder `srcs` and `includes` and a `main.c` file in `srcs` copied from somewhereelse: <br>
```json
{
    "folder": [
        {
            "name": "srcs",
            "path": ".",
            "file":[
                {
                "name": "main.c",
                "from": "../somewhereelse"
            }
        ]
        } ,
        {
            "name": "includes",
            "path": "."
        }
    ],

    "rules" : [
    ]
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
- 
## Future Changes
- move rule to corresponding folder/file
- add before/after command to exec before/after the creation/copy
- better Commandline arguments
- Better output,
- Possible logging
- enhance rules
- Modular/Costumizable structure
- add support for absolute path