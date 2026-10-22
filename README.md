[![npm version](https://badge.fury.io/js/%40mat3ra%2Fwode.svg)](https://badge.fury.io/js/%40mat3ra%2Fwode)
[![License: Apache](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

# WoDe

WOrkflow DEfinitions - houses the definitions for:

- `Workflow` - a workflow to be executed
- `Subworkflow` - a logical collection of units of work defined by a unique `Applidation`, and `Model`
- `Units` - one of the following:
  - `AssertionUnit` - assert an expression
  - `AssignmentUnit` - assign a value
  - `ConditionUnit` - evaluate a condition
  - `IOUnit` - Read or write data
  - `ExecutionUnit` - execute an `ADe` `Application`
  - `MapUnit` - create a dynamic number of units based on output of a previous unit
  - `ReduceUnit` - collect the results of a fanned out operation

Workflow configurations are processed at build time using `build_workflows.js` and compiled into
a single JS file so that workflow configurations can be accessed in the browser runtime, not just
in a NodeJS process.

The relevant data parameterizing supported entities is housed in the
[Standata](https://github.com/Exabyte-io/standata) repository.

## Installation

For usage within a JavaScript project:

```bash
npm install @mat3ra/wode
```

For development:

```bash
git clone https://github.com/Exabyte-io/wode.git
```


## Python input rendering

`workflow.render({"material": material})` renders execution-unit inputs from their
STANDATA templates. It does not execute assignment units, loops, or applications.
Rendered text is stored in each input's `rendered` field; template contents and
manually edited inputs are preserved. Raw runtime placeholders remain for the job runner.

The initial Python provider registry supports QE SCF inputs:
`QEPWXInputDataManager`, `KGridFormDataManager`, and `PlanewaveCutoffDataManager`.
Supply `model.method.data.pseudo` entries with `element` and `filename` or `path`,
and execution-unit context entries named `cutoffs` and `kgrid` for positive cutoffs
and explicit grid dimensions (grid-metric calculation is not implemented).
An `input` context entry can override generated input fields. MADE supplies crystal
coordinates and angstrom cell vectors without modifying the caller's material.
For multimaterial workflows, supply `materials` in addition to the primary `material`.
The QE provider builds `input.perMaterial` with the same conversion for each material.
STANDATA's `MATERIAL_INDEX` assignment selects the geometry and grid context for each
subworkflow; the renderer does not create or execute a loop. Common input overrides
apply to each material. Other providers, constrained atoms, labeled species, and
grid-metric calculation remain unsupported.

Rendering uses `mat3ra.utils.extra.jinja.render_jinja_with_error_handling` with a
call-local `sprintf` filter and number formatter. WoDe opts into exceptions so template
errors cannot be stored as executable input. Existing utils callers retain their
default diagnostic-string behavior.

The shared renderer requires `mat3ra-utils[extra]>=2026.10.22.post0`, the published
release containing [utils #56](https://github.com/mat3ra/utils/pull/56).

## Contributions

This repository is an [open-source](LICENSE.md) work-in-progress and we welcome contributions.

We regularly deploy the latest code containing all accepted contributions online as part of the
[Mat3ra.com](https://mat3ra.com) platform, so contributors will see their code in action there.

See [ESSE](https://github.com/Exabyte-io/esse) for additional context regarding the data schemas used here.

Useful commands for development:

```bash
# run linter without persistence
npm run lint

# run linter and save edits
npm run lint:fix

# compile the library
npm run transpile

# run tests
npm run test
```

### Using Linter

Linter setup will prevent committing files that don't adhere to the code standard. It will
attempt to fix what it can automatically prior to the commit in order to reduce diff noise. This can lead to "unexpected" behavior where a
file that is staged for commit is not identical to the file that actually gets committed. This happens
in the `lint-staged` directive of the `package.json` file (by using a `husky` pre-commit hook). For example,
if you add extra whitespace to a file, stage it, and try to commit it, you will see the following:

```bash
➜  repo-js git:(feature/cool-feature) ✗ git commit -m "Awesome feature works great"
✔ Preparing...
✔ Running tasks...
✖ Prevented an empty git commit!
✔ Reverting to original state because of errors...
✔ Cleaning up...

  ⚠ lint-staged prevented an empty git commit.
  Use the --allow-empty option to continue, or check your task configuration

husky - pre-commit hook exited with code 1 (error)
```

The staged change may remain but will not have been committed. Then it will look like you still have a staged
change to commit, but the pre-commit hook will not actually commit it for you, quite frustrating! Styling can
be applied manually and fixed by running:

```bash
npm run lint:fix
```

In which case, you may need to then add the linter edits to your staging, which in the example above, puts the
file back to identical with the base branch, resulting in no staged changes whatsoever.


## Other

### Workflow Spec

Workflows defined as configuration conform to the following specification:

- `Workflow: Object` - The workflow configuration itself
  - `name: String` - a human readable name describing the functionality of the workflow
  - `units: Array` - a list of workflow units where each unit takes the following shape *Not == Unit*
    - `name: String` - the snake_case name of a subworkflow or another workflow that must exist
    - `config: Optional[Object]` - see `Config` defined below
    - `type: String` - one of:
      - `subworkflow|workflow`
        - **Note:** workflow units may specify `mapUnit: true` in their config
    - `units: Optional[Array]` - if `type == workflow` see above (recursively defined)
  - `config: Optional[Object]` - see `Config` defined below
- `Subworkflow: Object` - a logical collection of workflow units
  - `application: Object` - an application specification
    - `name: String` - an application name recognized by ADe
    - `version: Optional[String]` - (often a semver) application version string supported by ADe
    - `build: Optional[String]` - application build string supported by ADe
  - `method: Object` - a method specification
    - `name: String` - a named method class exported from MeDe
    - `config: Optional[Object]` - see `Config` defined below
  - `model: Object` - a model specification 
    - `name: String` - a named model class exported from MeDe
    - `config: Optional[Object]` - see `Config` defined below
  - `config: Optional[Object]` - see `Config` defined below
  - `units: Array` - a list of subworkflow units where each unit is a Unit defined below
- `Unit: Object` - a unit of computational work in a workflow
  - `type: String` - one of:
    - `execution|assignment|condition|io|processing|map|subworkflow|assertion`
      - **Note:** optionally may have `Builder` appended to type to use unit builders instead of units directly
        - `executionBuilder` is the primary use case for this
  - `config: Object` - arguments to pass to constructor based on type
  - `functions: Object` - similar to `Config`.functions defined below
    - in the case of builders, functions are applied before calling build
  - `attributes: Object` - similar to `Config`.attributes defined below
    - in the case of builders, attributes are applied after calling build
- `Config: Object` - custom configuration to apply to an entity
  - **Note:** `functions` and `attributes` may not be supported for all entities, please check the implementation
  - `functions: Object` - collection of functions defined on the entity to run
    - `[key]: {{functionName}}: String` - name of function to run
    - `[value]: {{args}}: Any` - arguments matching the call signature
  - `attributes: Object` - collection of attributes to assign to the entity on creation
    - `[key]: {{attributeName}}: String` - name of function to run
    - `[value]: {{value}}: Any` - value to assign to attribute
  - `[key]: {{constructorArgument}}: String` - parameter passed to constructor
  - `[value]: {{constructorValue}}: Any` - value for a given constructor parameter


### Workflow Creation

The Workflow instances associated with the workflow configurations are built by
the `createWorkflows` function traversing all three levels (workflow, subworkflow, unit):
![Workflow Generation Diagram](https://user-images.githubusercontent.com/10773967/196579112-d249cafb-d775-4834-b146-e3dedc796174.jpg)

## Links

1. Workflows explained in Mat3ra documentation: https://docs.mat3ra.com/workflows/overview/
