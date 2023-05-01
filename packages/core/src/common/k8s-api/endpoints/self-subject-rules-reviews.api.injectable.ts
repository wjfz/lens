/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import assert from "assert";
import { storesAndApisCanBeCreatedInjectionToken } from "../stores-apis-can-be-created.token";
import { SelfSubjectRulesReviewApi } from "@k8slens/kube-api";
import { getKubeApiInjectable } from "@k8slens/kube-api-specifics";
import { loggerInjectionToken } from "@k8slens/logger";
import maybeKubeApiInjectable from "../maybe-kube-api.injectable";

const selfSubjectRulesReviewApiInjectable = getKubeApiInjectable({
  id: "self-subject-rules-review-api",
  instantiate: (di) => {
    assert(di.inject(storesAndApisCanBeCreatedInjectionToken), "selfSubjectRulesReviewApi is only available in certain environments");

    return new SelfSubjectRulesReviewApi({
      logger: di.inject(loggerInjectionToken),
      maybeKubeApi: di.inject(maybeKubeApiInjectable),
    });
  },
});

export default selfSubjectRulesReviewApiInjectable;
