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
      - name: Set env variables
        uses: minddocdev/env-variables-action@master
        with:
          variables: '{ "action": "test", "comment": "integration" }'
          whiteList: 'action,comment'
      - name: Echo env variables
        run: echo $ACTION && echo $COMMENT
```
