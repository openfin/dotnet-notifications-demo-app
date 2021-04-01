import path = require('path');
import {URL} from 'url';
import * as proxy from 'express-http-proxy';

import {Hook, registerHook} from 'openfin-service-tooling/utils/allowHook';
import {getProjectConfig} from 'openfin-service-tooling/utils/getProjectConfig';
import {getManifest, RewriteContext} from 'openfin-service-tooling/utils/getManifest';

import {EditorConfig} from './src/config/options';

registerHook(Hook.APP_MIDDLEWARE, (server) => {
    // const {
    //     BACKEND,
    //     BACKEND_ORG,
    //     LOCAL_MANIFEST,
    //     HOST,
    //     PORT
    // } = getProjectConfig<EditorConfig>();
    // const startsWithSemVer = /^\/\d+\.\d+\.\d(-[^/+]+)?(\+[^/+]+)?(.*)$/;

    // if (LOCAL_MANIFEST) {
    //     // Reroute requests to `/api/launcher.json` to use the locally-built `app.json` instead of the deployed manifest
    //     server.use('/api/launcher.json', async (req, res, next) => {
    //         const manifest = await getManifest(path.resolve('./res/app.json'), RewriteContext.DEBUG);

    //         res.json(manifest);
    //     });
    // }

    // // Proxy requests to /api to the backend server
    // const backendUrl: URL = new URL(BACKEND);
    // server.use('/api/*', proxy(backendUrl.host, {
    //     https: backendUrl.protocol.startsWith('https'),
    //     proxyReqPathResolver: function (req) {
    //         return req.originalUrl;
    //     },
    //     proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    //         proxyReqOpts.headers = {
    //             ...proxyReqOpts.headers,
    //             'referer': `http://${HOST}:${PORT}`,
    //             'openfin-os-organization': BACKEND_ORG
    //         };
    //         return proxyReqOpts;
    //     }
    // }));
    // // When running locally, there is no semver prefix on URLs
    // // Redirect any versioned paths (eg auth success/failure returns) to the non-versioned equivalent
    // server.use(startsWithSemVer, (req, res, next) => {
    //     const queryStart = req.originalUrl.indexOf('?');
    //     const query = queryStart >= 0 ? req.originalUrl.substr(queryStart) : '';
    //     const path = `${req.params[2]}${query}`;

    //     res.redirect(path);
    // });

    // // Serve same HTML page for all non-file endpoints
    // server.use('*', (req, res, next) => {
    //     if (path.extname(req.originalUrl) === '') {
    //         res.sendFile(path.join(__dirname, './dist/index.html'));
    //     } else {
    //         next();
    //     }
    // });
});
