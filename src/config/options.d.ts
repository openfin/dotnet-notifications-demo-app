import {Config} from 'openfin-service-tooling/utils/getProjectConfig';

// NOTE: Be careful about introducing dependencies into this file, it is also included by build tools.

declare global {
    /**
     * Configuration data from project.config.json (and optionally, overridden in project.user.json). Will be embedded
     * into the code at build time by webpack.
     */
    const CONFIG: EditorConfig;
}

/**
 * All fields here should be required (though may have a "| undefined" type), and all values where `undefined` isn't
 * allowed should have compatible values defined in project.config.json.
 *
 * Values defined in project.config.json can be selectively overidden by creating a project.user.json file. Both files
 * will be loaded, with the 'user' values taking priority when both files define the same property.
 */
export interface EditorConfig extends Config {
    /**
     * Determines where any API requests are routed to when the project is running locally.
     *
     * The local server includes a proxy that routes all `/api` requests to this location.
     */
    BACKEND: string;

    /**
     * The orgnanization ID that will be attached to API requests proxied through the local development server.
     */
    BACKEND_ORG: string;

    /**
     * Set the host for the application. This is the hostname for the local server that hosts the launcher when
     * debugging locally. This hostname will be attached to API requests proxied through the local development server.
     *
     * Note: Due to the differences between Mac and Windows, if you are developing on a non-Windows environment, ensure
     * that the HOST env is set to the correct value for your platform, typically either `HOST=0.0.0.0` or
     * `HOST=<vmnet1 address here>`.
     */
    HOST: string;

    /**
     * Reroute requests to `/api/launcher.json` to use the locally-built `app.json` instead of the deployed manifest.
     */
    LOCAL_MANIFEST: string;

    /**
     * The webpack mode with which the project was built.
     *
     * This is derived from the `--mode` CLI arg, or the NODE_ENV environment variable.
     */
    MODE: 'development' | 'production' | 'none';
}
