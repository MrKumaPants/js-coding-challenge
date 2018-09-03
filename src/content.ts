/**
 * This script will run on the parent window.
 */

import * as SwaggerParser from "swagger-parser";
import { ISpec } from "./types";

function getTextContent() {
  const childNodes = document.body.childNodes;

  if (childNodes.length >= 1) {
    let childNode;

    for (const index in childNodes) {
      if (childNodes[index].nodeName !== "PRE") continue;

      childNode = childNodes[index];
    }

    if (childNode && childNode.textContent) {
      return childNode.textContent.trim();
    }
  }

  return null;
}

async function getSpec() {
  const text = getTextContent();
  if (!text) return;

  let spec: ISpec;

  try {
    spec = await SwaggerParser.validate(JSON.parse(text));

    chrome.runtime.sendMessage({ spec });
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener("DOMContentLoaded", getSpec, false);
