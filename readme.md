# PWC Code Generator - Command Line Interface

## Introduction

PWC is an agnostic to language/framework code generator, built to provide smart tools for code generation.

With PWC, you can create unlimited source codes for the same project. It is possible because the "Generators", that are separated NPM Modules, can be called separately.

The PWC only cares of reading the *YML Project File*, sort the models by precedence, and convert all the data for a *Smart Project Object*, that can be used inside the generators with a lot of tools and callable methods that facilitates the code generation.

You can see these tools and methods on the [Generator Sample Readme](https://github.com/pwc-code-generator/pwc-generator-sample/blob/master/readme.md).

PWC is a little like [Yeoman](http://yeoman.io/), but more focused on CRUD generation, built with a [Model Driven](https://en.wikipedia.org/wiki/Model-driven_architecture) structure.

## Docs

You can see the documentation on this [repository](https://github.com/pwc-code-generator/docs).

## Requirements

You need these technologies installed on your machine to use PWC:

- [NodeJS](https://nodejs.org)
- [NPM](https://www.npmjs.com/) package manager

## Installation

Install PWC globally on your machine:

```
npm install -g pwc-code-generator
```

## Features

- Calls a custom generator that you can choose to generate the code as you like (and you can create your own generator if you want, following [these steps](https://github.com/pwc-code-generator/pwc-generator-sample/blob/master/readme.md).)
- Converts a PWC Project File (YML) to a readable and useful *Smart Project Object*
- Organize the Models by precedence, based on their relationships
- Provides a useful and practical interface for generators

## How to use

1. First, you need to create a PWC Project File, that is a .yml file representing your complete project. You can see some file samples [here](https://github.com/pwc-code-generator/pwc/tree/master/examples).
2. Install your preferred "Generator" on your machine. You can see a list of generators below.
3. Then you can navigate to the folder in that your project file is through the command line, and run the PWC passing the generator that you prefer:

```
pwc project -f your-project-file.yml -p your-preferred-generator
```
This command will generate the project. By default, it is generated on the current directory, but we recommend that you see your generator documentation for sure.


## Command Structure

The ```pwc``` command has this structure:

```
pwc --generate [project|model] --file [filename.yml] --plug [your-preferred-generator] --name [Project name - Optional]
```

You can use the abreviatted version:

```
pwc -g [project|model] -f [filename.yml] -p [your-preferred-generator] -n [Project name - Optional]
```

The parameter **--generate or -g** can be passed without the words *--generate, -g* because is the default:

```
pwc project | instead of "pwc -g project" or "pwc --generate project"
```

The value *model* for the --generate parameter doesn't generate anything at this moment, but it's here because we are planning to add functionality to generate specific models inside a current existing project.

The parameter **--name or -n** is optional because you can pass the project name on the *Project File*. The precedence is: name on *Project File*, name on the parameter.

Here is an example generating a real simple ERP project with the generator ["Laravel 5.5 - PWC Generator"](https://github.com/pwc-code-generator/pwc-generator-laravel55).

```
pwc project -f simple-erp.yml -p pwc-generator-laravel55
```

## Project File

The *Project File* is a YAML file (*.yml) that describes all the models, fields and relationships of a project. Here you can see a simple example:

```yml
name: Inventory Control
models:
    product:
        fields:
            name:
                type: string,128
                element: text
                validation: required
                searchable: true
            type:
                type: enum
                items: physical,digital|Is digital?,undefined
                default: physical
                validation: required
        belongsTo:
            brand:
                element: select
                validation: required
        hasMany:
            grid:
                element: simple-datagrid
    
    # ...
```

If you want to know more details about creating *Project Files*, please access the [documentation](https://github.com/pwc-code-generator/docs/blob/master/2_Creating_Project_Files.md).

The file is simple and practical. But if you want a *Project File* generator, you can access our [platform](https://appstart.kingofcode.com.br/) (on alpha) and click "Download as YML" after creating the models of your project.

## The *Smart Project Object*

The *Smart Project Object* is a javascript object with methods and tools that can be used by the generator to generate the code with practicality. You can see more details about these methods on the documentation.

## Generators

A *Generator* is an important part of code generation. To generate a new source code, you need the PWC and a specific code generator. They are separated because PWC wants to be agnostic to language/framework. Because of it, developers are free to create your own Generators without restrictions.

Here is a list of the currently available generators:

- [Laravel 5.5 Generator](https://github.com/pwc-code-generator/pwc-generator-laravel55) - @TiagoSilvaPereira

## To Do

If you want to contribute, please see the [issues](https://github.com/pwc-code-generator/pwc/issues) section to help us make PWC best!

## License
MIT