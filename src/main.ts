import * as core from '@actions/core';
import * as yaml from 'js-yaml';

function getVariables(rawVariables: string, whiteList: string[]): {} {
  core.debug(`Parsing raw variables '${rawVariables}'...`);
  let variables: {};
  try {
    // Try JSON first
    variables = JSON.parse(rawVariables);
    core.debug(`Loaded variables: ${rawVariables}`);
  } catch (err) {
    // Might be in YAML format
    try {
      variables = yaml.safeLoad(rawVariables);
    } catch (err) {
      throw new Error(`Unable to parse variables. Found content: ${rawVariables}`);
    }
  }
  if (whiteList.length > 0) {
    const filteredVariables = {};
    whiteList.forEach(whiteVar => filteredVariables[whiteVar] = variables[whiteVar]);
    return filteredVariables;
  }
  return variables;
}

const formatEnvName = (rawName: string) => {
  const groups = rawName.match(/(.+?)([A-Z])/) || [];
  return groups.join('_').toUpperCase();
};

async function run() {
  try {
    const rawVariables = core.getInput('variables', { required: true });
    const whiteList = core.getInput('whiteList', { required: false }) || '';

    const variables = getVariables(rawVariables, whiteList.split(','));

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
