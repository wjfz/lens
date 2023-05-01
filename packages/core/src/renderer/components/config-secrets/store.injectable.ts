/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import assert from "assert";
import { getKubeStoreInjectable } from "../../../common/k8s-api/api-manager/kube-object-store-token";
import secretApiInjectable from "../../../common/k8s-api/endpoints/secret.api.injectable";
import { loggerInjectionToken } from "@k8slens/logger";
import clusterFrameContextForNamespacedResourcesInjectable from "../../cluster-frame-context/for-namespaced-resources.injectable";
import storesAndApisCanBeCreatedInjectable from "../../stores-apis-can-be-created.injectable";
import { SecretStore } from "./store";

const secretStoreInjectable = getKubeStoreInjectable({
  id: "secret-store",
  instantiate: (di) => {
    assert(di.inject(storesAndApisCanBeCreatedInjectable), "secretStore is only available in certain environments");

    const api = di.inject(secretApiInjectable);

    return new SecretStore({
      context: di.inject(clusterFrameContextForNamespacedResourcesInjectable),
      logger: di.inject(loggerInjectionToken),
    }, api);
  },
});

export default secretStoreInjectable;
