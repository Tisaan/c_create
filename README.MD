# C_Create

## Purpose
C_create is a tool to create a folder hierarchy,
It require [Deno](https://Deno.com/) 

## Syntax
The principale structure is `Config`, it contains 2 optional structure
`folder` and `rules` which are respectively *Record<string, folder>* and *Record<string, string>*, all **path** are for now relative<br>
`folder` contains:<br>&emsp;
    - **path**: the path where the folder will be created.<br>&emsp;
    - **from**: if it exist copy the folder at this location to **path**, and don't create new one<br>&emsp;
    - **file**: Same to folder appart that it create/copy a file <br>
`rules`:<br>&emsp;
    Bind two string,
    when the first one is encounter in the file:<br>&emsp;
    execute the second one on the current terminal.<br>&emsp;
    It could overwrite every rule.<br>&emsp;
    **It is unprotected beware**<br>
A simple json file that create to folder `srcs` and `includes` and a `main.c` file in `srcs` copied from somewhereelse: <br>
```json
{
    "folder":
    {
        "srcs" : {
            "path": ".",
            "file": [
                {
                    "name": "main.c",
                    "from": "../somewhereelse"
                }
            ]   
        } ,
        "includes" : {
            "path": "."
        }
    },

    "rules" : {}
}
```
## Patch-Note
### 0.1:
- initial commit
### 0.1.1:
- Change `folder` and `rules` structure and `rules` checking
- Fix a bug where `file` not check for `rules`

## Future Changes
- Commandline arguments
- Better output,
- Possible logging
- enhance rules
- Modular/Costumizable structure
- add support for absolute path