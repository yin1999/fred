import express from "express";
import fs from "node:fs";
import { createRsbuild, loadConfig, logger } from "@rsbuild/core";

/**
 * @import { Request, Response } from "express";
 * @import { RsbuildDevServer, ManifestData } from "@rsbuild/core";
 */

const templateHtml = fs.readFileSync("./template.html", "utf-8");

/** @type {string} */
let ssrManifest;
/** @type {string} */
let clientManifest;

/**
 * @param {string} manifest
 * @param {string} entry
 */
function tagsFromManifest(manifest, entry = "index") {
  /** @type {ManifestData} */
  const { entries } = JSON.parse(manifest);

  const { js = [], css = [] } = entries[entry]?.initial || {};

  const scriptTags = js
    .map((url) => `<script src="${url}" defer></script>`)
    .join("\n");
  const styleTags = css
    .map((file) => `<link rel="stylesheet" href="${file}">`)
    .join("\n");
  return { scriptTags, styleTags };
}

/**
 * @param {RsbuildDevServer} serverAPI 
 */
const serverRender = (serverAPI) => 
  /**
   * @param {Request} req
   * @param {Response} res
   */
  async (req, res) => {
    /** @type {import("./entry.ssr") | undefined} */
    const indexModule = await serverAPI.environments.ssr?.loadBundle("index");
    const markup = await indexModule?.render(req.path);

    const { scriptTags: ssrScriptTags, styleTags: ssrStyleTags } =
      tagsFromManifest(ssrManifest);
    const { scriptTags: clientScriptTags, styleTags: clientStyleTags } =
      tagsFromManifest(clientManifest);
    const { scriptTags: legacyScriptTags, styleTags: legacyStyleTags } =
      tagsFromManifest(clientManifest, "legacy");

    const legacyTags = req?.path?.endsWith("settings")
      ? [legacyScriptTags, legacyStyleTags]
      : [];

    const tags = [
      //ssrScriptTags,
      ssrStyleTags,
      clientScriptTags,
      clientStyleTags,
      ...legacyTags,
    ].join("\n");
    console.log(tags);
    const html = templateHtml
      .replace("<!--app-content-->", markup || "")
      .replace("<!--app-head-->", tags);

    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    res.end(html);
  };

export async function startDevServer() {
  const { content } = await loadConfig({});

  // Init Rsbuild
  const rsbuild = await createRsbuild({
    rsbuildConfig: content,
  });

  const app = express();

  // Create Rsbuild DevServer instance
  const rsbuildServer = await rsbuild.createDevServer();

  rsbuild.onDevCompileDone(async () => {
    // update manifest info when rebuild
    ssrManifest = await fs.promises.readFile(
      "./dist/ssr/manifest.json",
      "utf-8",
    );
    clientManifest = await fs.promises.readFile(
      "./dist/client/manifest.json",
      "utf-8",
    );
    rsbuildServer.printUrls();
  });

  const serverRenderMiddleware = serverRender(rsbuildServer);

  app.get("/*mdnUrl", async (req, res, next) => {
    try {
      await serverRenderMiddleware(req, res);
    } catch (err) {
      logger.error("SSR render error, downgrade to CSR...");
      next();
    }
  });

  // Apply Rsbuild’s built-in middlewares
  app.use(rsbuildServer.middlewares);

  const httpServer = app.listen(rsbuildServer.port, () => {
    // Notify Rsbuild that the custom server has started
    rsbuildServer.afterListen();

    console.log(`Server started at http://localhost:${rsbuildServer.port}`);
  });

  rsbuildServer.connectWebSocket({ server: httpServer });

  return {
    close: async () => {
      await rsbuildServer.close();
      httpServer.close();
    },
  };
}

startDevServer();
