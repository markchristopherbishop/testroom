# Testroom CLI

A CLI utility to host web applications for functional testing.

## Main features

- Works with any test runner
- Temporary host or proxy of site while tests run
- Automatic shut down of host or proxy when tests are complete
- Automatic port allocation
- Inject test scripts and mock data

## Commands

### `testroom run [test command] [options]`

Temporarily host or proxy a website and execute a `[test command]`. It runs the following sequence:

1. Starts host or proxy
2. Shell executes the given `[test command]`
3. Stops host or proxy
4. Returns the result of `[test command]` to the terminal

#### [test command]

The test command is a standard shell command that will execute your test(s). This can be anything you like. Most testing tools will work with `testroom` (e.g. `wdio`, `nightwatch`, `cypress`, `testcafe`, etc). The result of this command will be returned to the terminal so that it can be used in a CI environment.

#### [options]

- **--host**, **-h**: A directoy to host for the test. For example, if you specify `./dist`, the directory `./dist` will be temporarily hosted on `http://localhost:<TEST_PORT>` for the duration of the `[test command]` execution. As soon as the `[test command]`has completed the host will be removed. Please note this cannot be used in conjunction with the `--proxy, -p` option.

- **--proxy**, **-x**: A website to temporarily proxy for the test. For example, if you specify `www.google.co.uk` the test will proxy all requests to `http://localhost:<TEST_PORT>` to `www.google.co.uk` for the duration of the `[test command]` execution. As soon as the `[test command]` has completed the proxy will be removed. Please note this cannot be used in conjunction with the `--host, -h` option.

- **--port**, **-p**: The port to host or proxy the test website. If omitted (recommended) a random port will be used. The port number will also be automatically assigned to environment variable `TEST_PORT`. This means `TEST_PORT` is available for use in the `[test command]`.

- **--inject**, **-i**: A comma delimited list of JavaScript filenames to be injected into the target website. All scripts will inserted into the HTML of the target website via `<script>` tags. Each will be served as if they originated from the same domain. Files will be injected into the `<head>` tag before any other scripts on the page.

## Examples

### Host local directory and execute tests against it

`testroom run "wdio ./conf.js" -h ./dist`

The above example will temporarily host the `./dist` directory on a random port and execute `[test command]` `wdio ./conf.js`. Once `wdio ./conf.js` has completed, either successfully or unsuccessfully, the host will be stopped. The `[test command]` result will be returned to the terminal.

### Proxy a website and execute tests against the proxy

`testroom run "wdio ./conf.js" -p www.mywebsite.com`

The above example will temporarily proxy `www.mywebsite.com` on a random port and execute `[test command]` `wdio ./conf.js`. Once `wdio ./conf.js` has completed, either successfully or unsuccessfully, the proxy will be stopped. The `[test command]` result will be returned to the terminal.

### Getting the port number in your tests

`testroom` writes the port number it is using to the `TEST_PORT` environment variable. This means the port is always available to the executing `[test command]`. This can be useful to find out where the test site is hosted during the test. For example the, `[test command]` can be obtained like so: `http://localhost:${process.env.TEST_PORT}`.

### Inject JavaScript to bootstrap test mocks etc

`testroom run "wdio ./conf.js" -h ./dist -i ./myBootstrapTestMocks.js`

The above example will insert `./myBootstrapTestMocks.js` in a new HTML script tag, within the `index.html`, `<head>` tag. The script will be inserted before any other scripts in the page.
