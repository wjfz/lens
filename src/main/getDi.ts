/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { createContainer } from "@ogre-tools/injectable";
import { autoRegister } from "@ogre-tools/injectable-extension-for-auto-registration";
import { registerMobX } from "@ogre-tools/injectable-extension-for-mobx";
import { runInAction } from "mobx";
import { Environments, setLegacyGlobalDiForExtensionApi } from "../extensions/as-legacy-globals-for-extension-api/legacy-global-di-for-extension-api";

export const getDi = () => {
  const di = createContainer("main");

  setLegacyGlobalDiForExtensionApi(di, Environments.main);

  runInAction(() => {
    registerMobX(di);

    autoRegister({
      di,

      targetModule: module,

      getRequireContexts: () => [
        require.context("./", true, /\.injectable\.(ts|tsx)$/),
        require.context("../extensions", true, /\.injectable\.(ts|tsx)$/),
        require.context("../common", true, /\.injectable\.(ts|tsx)$/),
        require.context("../features", true, /.*\/(main|common)\/.*\.injectable\.(ts|tsx)$/),
      ],
    });
  });

  return di;
};
