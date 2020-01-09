import * as process from 'process';
import * as cp from 'child_process';
import * as path from 'path';

describe('run', () => {
  const indexJsPath = path.join(__dirname, '..', 'lib', 'index.js');

  beforeEach(() => {
    process.env['INPUT_VARIABLES'] = '{ "var1": "val1", "var2": "val2", , "camelCase": "val3" }';
    process.env['INPUT_WHITELIST'] = 'var2,camelCase';
  });

  test('with required variables', () => {
    const options: cp.ExecSyncOptions = {
      env: process.env,
    };
    console.log(cp.execSync(`node ${indexJsPath}`, options).toString());
  });
});
