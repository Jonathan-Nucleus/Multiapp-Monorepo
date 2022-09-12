#!/usr/bin/env node
const fs = require("fs/promises");
// in production build, dotenv is installed in `standalone` folder via the Dockerfile
const dotenv = require("dotenv");

dotenv.config();
const CONFIG_FILE_PATH = "./next.config.js";
const SERVER_FILE_PATH = "./server.js";

const getMappingFromEnv = (names) => {
  return names.reduce((acc, name) => {
    acc[name] = process.env[name];
    return acc;
  }, {});
};

(async function () {
  try {
    // eslint-disable-next-line no-console
    console.log("Replacing publicRuntimeConfig with env variables...");

    // Get standalone server.js file
    const config = await fs.readFile(CONFIG_FILE_PATH, { encoding: "utf8" });
    const server = await fs.readFile(SERVER_FILE_PATH, { encoding: "utf8" });

    const serverConfig = config.match(/serverRuntimeConfig:\s?{(.*?)}/s);
    const publicConfig = config.match(/publicRuntimeConfig:\s?{(.*?)}/s);

    const serverOnlyConfigEnvVariables = serverConfig
      ? Array.from(
          (serverConfig[1] || "").matchAll(/(\w+?):.*?,*/gs),
          (match) => match[1]
        )
      : [];
    const commonConfigEnvVariables = publicConfig
      ? Array.from(
          (publicConfig[1] || "").matchAll(/(\w+?):.*?,*/gs),
          (match) => match[1]
        )
      : [];

    console.log(
      "Found server runtime config vars:",
      serverOnlyConfigEnvVariables
    );
    console.log("Found public runtime config vars:", commonConfigEnvVariables);

    const serverRuntimeConfig = getMappingFromEnv(serverOnlyConfigEnvVariables);
    const publicRuntimeConfig = getMappingFromEnv(commonConfigEnvVariables);

    console.log("Writing server runtime config vars:", serverRuntimeConfig);
    console.log("Writing public runtime config vars:", publicRuntimeConfig);

    // Replace hardcoded runtimeConfig
    const newServer = server
      .replace(
        /"serverRuntimeConfig":{}/,
        `"serverRuntimeConfig":${JSON.stringify(serverRuntimeConfig)}`
      )
      .replace(
        /"publicRuntimeConfig":{}/,
        `"publicRuntimeConfig":${JSON.stringify(publicRuntimeConfig)}`
      );

    // Write to file
    await fs.writeFile(SERVER_FILE_PATH, newServer, "utf8", function (err) {
      // eslint-disable-next-line no-console
      if (err) return console.log(err);
    });

    // eslint-disable-next-line no-console
    console.log("Done!");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
})();
