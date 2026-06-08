"use client";

import { useEffect } from "react";
import { initDataFast } from "datafast";

let initialized = false;

export function DataFastInit() {
  useEffect(() => {
    if (initialized) {
      return;
    }

    initialized = true;

    void initDataFast({
      websiteId: "dfid_FSiAGhIh0Uf5yji54LpRj",
    });
  }, []);

  return null;
}
