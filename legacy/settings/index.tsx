import React from "react";

import "./index.css";
import { Manage } from "./manage";
import { ManageAIHelp } from "./ai-help";

export function Settings() {
  const pageTitle = "Settings";
  return (
    <>
      <article className="settings">
        <h1 className="slab-highlight _ify">{pageTitle} </h1>
        <Manage />
        <ManageAIHelp />
      </article>
    </>
  );
}
