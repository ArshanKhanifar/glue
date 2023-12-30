# Forknet Glue

This is a CLI app that listens to all the forks that it's registered with. If a
LayerZero message has been sent, it'll deliver it to the destination.

### Running in Development

```
pnpm run dev
```

should just do it. Make sure you have a `glueConfig.json` file configured,
and that you are running those forks with the ports specified in your
configuration file.

### Input

The input to this app is `glueConfig.json`:
Refer to [glueConfig.example.json](./glueConfig.example.json) to see what the format is:

```
{
  "chains": [
    {
      "id": 1,
      "rpc": "http://127.0.0.1:6969"
    },
    {
      "id": 137,
      "rpc": "http://127.0.0.1:6976"
    },
}
```

- `id` is the chainId.
- `rpc` is the http path to where that fork is running.

### Installing and Running in a NodeJS project

Install the package:

```
pnpm i @decent.xyz/forknet-glue
```

Then add the following task to `package.json`:

```
  "scripts": {
    "run-glue": "forknet-glue",
  },
```

then running

```
pnpm run run-glue
```

will start the glue service.

### An Existing Project Using This:

This is installed in
[houndry toolkit](https://github.com/decentxyz/houndry-toolkit/blob/37fc1e84f7cc3c14b3098f7fed835e6238739af7/package.json#L30C6-L30C6)
and is used in the
[start-glue](https://github.com/decentxyz/houndry-toolkit/blob/main/src/tasks/forks.ts#L182)
hardhat task. Which itself is installed as a hardhat plugin in
[decent-bridge](https://github.com/decentxyz/decent-bridge/blob/main/package.json#L25C23-L25C23).
That's why the `start-glue` hardhat task is available in any of those projects.

### Publishing to NPM

```
pnpm publish:package
```
