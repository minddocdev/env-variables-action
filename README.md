# Env Variables Action

Export env variables for Github actions from a JSON or YAML string.

```bash
yarn install
```

Build the typescript

```bash
yarn build
```

Run the tests

```bash
yarn test
```

## Inputs

### `variables`

- name: variables
- required: true
- description: The object containing the variables in either JSON or YAML format.

### `format`

- name: format
- required: false
- default: json
- description: Tell the action which format your `variables` are using.

### `whiteList`

- name: whiteList
- required: false
- description: Comma separated list of keys that will be loaded, ignoring the rest.

## Usage

Use the action to export and use env variables:

```yaml
name: 'test-integration'
on:
  push:
    branches:
      - master
jobs:
  bump:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout git repository
        uses: actions/checkout@master
      - name: Set env variables using json
        uses: minddocdev/env-variables-action@master
        with:
          variables: '{ "action": "test", "comment": "integration" }'
          format: 'json'
          whiteList: 'action,comment'
      - name: Echo env variables
        run: echo $ACTION && echo $COMMENT
      - name: Set env variables using yaml
        uses: minddocdev/env-variables-action@master
        with:
          variables: |
            'data:
              action: test
              comment: integration
            '
          format: 'yaml'
          whiteList: 'data.action,data.comment'
      - name: Echo env variables
        run: echo $ACTION && echo $COMMENT
```
