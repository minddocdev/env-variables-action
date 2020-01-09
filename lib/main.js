"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const yaml = __importStar(require("js-yaml"));
function getVariables(rawVariables, whiteList) {
    core.debug(`Parsing raw variables '${rawVariables}'...`);
    let variables;
    try {
        // Try JSON first
        variables = JSON.parse(rawVariables);
        core.debug(`Loaded variables: ${rawVariables}`);
    }
    catch (err) {
        // Might be in YAML format
        try {
            variables = yaml.safeLoad(rawVariables);
        }
        catch (err) {
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
const formatEnvName = (rawName) => {
    const groups = rawName.match(/(.+?)([A-Z])/) || [];
    return groups.join('_').toUpperCase();
};
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rawVariables = core.getInput('variables', { required: true });
            const whiteList = core.getInput('whiteList', { required: false }) || '';
            const variables = getVariables(rawVariables, whiteList.split(','));
            Object.entries(variables).forEach(([key, value]) => {
                const envName = formatEnvName(key);
                const envValue = typeof value === 'string' ? value : String(value);
                core.exportVariable(envName, envValue);
            });
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
