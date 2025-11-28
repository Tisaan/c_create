# C_Create

## Purpose
C_create is a tool to create a folder hierarchy

## Syntax
The principale structure is `Config`, it contains 2 optional structure
`folder` and `rules` which are respectively *Record<string, folder[]>* and *Record<string, string>*.<br>
`folder` contains:<br>
    - **path**: the path where the folder will be created.<br>
    - **from**: if it exist copy the folder at this location to **path**, and don't create new one<br>
    - **file**: Same to folder appart that it create/copy a file <br>
`rules`:<br>
    bind two string,
    when the first one is encounter in the file:<br>
    execute the second one on the current terminal.<br>
    it could overwrite every rule.
    **It is unprotected beware** 

