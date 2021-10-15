/**
 * Copyright (c) 2021 OpenLens Authors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import "./resource-metrics.scss";

import React, { createContext, useEffect, useState } from "react";
import { Radio, RadioGroup } from "../radio";
import { useInterval } from "../../hooks";
import type { KubeObject } from "../../../common/k8s-api/kube-object";
import { cssNames, IClassName } from "../../utils";
import { Spinner } from "../spinner";
import type { IMetrics } from "../../../common/k8s-api/endpoints";

interface Props {
  tabs: string[];
  object?: KubeObject;
  loader?: () => void;
  interval?: number;
  className?: IClassName;
  metrics?: Record<string, IMetrics>;
  children?: React.ReactNode;
}

export type IResourceMetricsValue<K extends KubeObject = KubeObject, Metrics extends Record<string, IMetrics> = Record<string, IMetrics>> = {
  object?: K;
  tab: string;
  metrics?: Metrics;
};

export const ResourceMetricsContext = createContext<IResourceMetricsValue>(null);

const defaultProps: Partial<Props> = {
  interval: 60  // 1 min
};

ResourceMetrics.defaultProps = defaultProps;

export function ResourceMetrics({ object, loader, interval, tabs, children, className, metrics }: Props) {
  const [tab, setTab] = useState<string>(tabs[0]);

  useEffect(() => {
    if (loader) loader();
  }, [object]);

  useInterval(() => {
    if (loader) loader();
  }, interval * 1000);

  return (
    <div className={cssNames("ResourceMetrics flex column", className)}>
      <div className="switchers">
        <RadioGroup
          asButtons
          className="flex box grow gaps"
          value={tab}
          onChange={value => setTab(value)}
        >
          {tabs.map((tab, index) => (
            <Radio key={index} className="box grow" label={tab} value={tab} />
          ))}
        </RadioGroup>
      </div>
      <ResourceMetricsContext.Provider value={{ object, tab, metrics }}>
        <div className="graph">
          {children}
        </div>
      </ResourceMetricsContext.Provider>
      <div className="loader">
        <Spinner />
      </div>
    </div>
  );
}
