/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import assert from "assert";
import { storesAndApisCanBeCreatedInjectionToken } from "../stores-apis-can-be-created.token";
import { MutatingWebhookConfigurationApi } from "@k8slens/kube-api";
import { getKubeApiInjectable } from "@k8slens/kube-api-specifics";
import { loggerInjectionToken } from "@k8slens/logger";
import maybeKubeApiInjectable from "../maybe-kube-api.injectable";

const mutatingWebhookConfigurationApiInjectable = getKubeApiInjectable({
  id: "mutating-webhook-configuration",
  instantiate: (di) => {
    assert(di.inject(storesAndApisCanBeCreatedInjectionToken), "mutatingWebhookConfigurationApi is only available in certain environments");

    return new MutatingWebhookConfigurationApi({
      logger: di.inject(loggerInjectionToken),
      maybeKubeApi: di.inject(maybeKubeApiInjectable),
    });
  },
});

export default mutatingWebhookConfigurationApiInjectable;
