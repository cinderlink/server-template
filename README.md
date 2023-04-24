# @cinderlink/server-template

This template provides everything you need to start running a new server project using [Cinderlink Framework](https://github.com/cinderlink/framework).
After you clone this repository, you can install all dependencies and start the server by running the following commands:

```bash
pnpm i
pnpm cinderlink init
pnpm cinderlink start
```

After initializing the server, you can customize your configuration by editing the `cinderlink.config.js` file.
You can create your own plugins in the `src` folder and add them to the `cinderlink.config.js` file.

## Default plugins

By default the template will use the default plugins from the [@cinderlink/server-bin](https://github.com/cinderlink/framework/tree/main/packages/server-bin) package.
You can find more information about the default plugins in the documentation (TODO).

## Custom plugins

You can create your own plugins by creating a new class that extends the [PluginInterface](https://github.com/cinderlink/framework/blob/main/packages/core-types/src/plugin/types.ts#L34) class from the [@cinderlink/core-types](https://github.com/cinderlink/framework/tree/main/packages/core-types) package.
An example plugin can be found in the [example-plugin](./src/plugins/example-plugin/) directory in this repository.
