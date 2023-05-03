/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { navigateToRouteInjectionToken } from "../../../navigate-to-route-injection-token";
import customResourcesRouteInjectable from "./custom-resources-route.injectable";

export type NavigateToCustomResources = NavigateToSpecificRoute<typeof customResourcesRouteInjectable>;

const navigateToCustomResourcesInjectable = getInjectable({
  id: "navigate-to-custom-resources",

  instantiate: (di): NavigateToCustomResources => {
    const navigateToRoute = di.inject(navigateToRouteInjectionToken);
    const route = di.inject(customResourcesRouteInjectable);

    return (parameters) => navigateToRoute(route, { parameters });
  },
});

export default navigateToCustomResourcesInjectable;
