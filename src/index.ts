import * as core from '@actions/core';
import * as yaml from 'js-yaml';

function getVariables(rawVariables: string, whiteList: string[], format: string): {} {
  core.debug(`Parsing raw variables ${rawVariables}`);
  let variables: {};
  try {
    switch (format) {
      case 'yaml':
        variables = yaml.safeLoad(rawVariables);
        break;

      default:
        variables = JSON.parse(rawVariables);
        break;
    }
    core.debug(`Loaded variables: ${JSON.stringify(variables)}`);
  } catch (err) {
    throw new Error(`Unable to parse variables. Found content: ${rawVariables}`);
  }
  if (whiteList.length > 0) {
    const filteredVariables = {};
    whiteList.forEach((key: string) => {
      filteredVariables[key] = findProperty(variables, key);
    });
    return filteredVariables;
  }
  return variables;
}

/**
 * Find the value of the given key within the object,
 * even if the key is deeply nested in the object tree.
 * @param obj The object to search
 * @param key The key to find
 */
function findProperty(obj: {}, key: string) {
  for (const k in obj) {
    const value = obj[k];
    if (k === key) {
      return value;
    }
    if (typeof obj[k] === 'object') {
      return findProperty(obj[k], key);
    }
  }
}

const formatEnvName = (rawName: string): string => {
  return rawName.replace(/^[a-z]|[A-Z]/g, (value, index) => {
    return index === 0 ? value : `_${value}`;
  }).toUpperCase();
};

async function run() {
  try {
    const rawVariables = core.getInput('variables', { required: true });
    const format = core.getInput('format', { required: false }).toLowerCase();
    const whiteList = core.getInput('whiteList', { required: false }) || '';

    const variables = getVariables(rawVariables, whiteList.split(','), format);

    Object.entries(variables).forEach(([key, value]) => {
      const envName = formatEnvName(key);
      const envValue = typeof value === 'string' ? value : String(value);
      core.exportVariable(envName, envValue);
    });

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
