/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import assert from "assert";
import { storesAndApisCanBeCreatedInjectionToken } from "../stores-apis-can-be-created.token";
import { ClusterRoleBindingApi } from "@k8slens/kube-api";
import { getKubeApiInjectable } from "@k8slens/kube-api-specifics";
import { loggerInjectionToken } from "@k8slens/logger";
import maybeKubeApiInjectable from "../maybe-kube-api.injectable";

const clusterRoleBindingApiInjectable = getKubeApiInjectable({
  id: "cluster-role-binding-api",
  instantiate: (di) => {
    assert(di.inject(storesAndApisCanBeCreatedInjectionToken), "clusterRoleBindingApi is only accessible in certain environments");

    return new ClusterRoleBindingApi({
      logger: di.inject(loggerInjectionToken),
      maybeKubeApi: di.inject(maybeKubeApiInjectable),
    });
  },
});

export default clusterRoleBindingApiInjectable;
