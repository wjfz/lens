/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./dialog.scss";

import React, { Component } from "react";
import type { IObservableValue } from "mobx";
import { computed, observable, makeObservable } from "mobx";
import { observer } from "mobx-react";
import type { DialogProps } from "../../dialog";
import { Dialog } from "../../dialog";
import { Wizard, WizardStep } from "../../wizard";
import type { Deployment } from "@k8slens/kube-object";
import { Icon } from "@k8slens/icon";
import { Slider } from "../../slider";
import { cssNames } from "@k8slens/utilities";
import { withInjectables } from "@ogre-tools/injectable-react";
import deploymentApiInjectable from "../../../../common/k8s-api/endpoints/deployment.api.injectable";
import deploymentScaleDialogStateInjectable from "./dialog-state.injectable";
import type { ShowCheckedErrorNotification } from "../../notifications/show-checked-error.injectable";
import showCheckedErrorNotificationInjectable from "../../notifications/show-checked-error.injectable";
import type { DeploymentApi } from "@k8slens/kube-api";

export type DeploymentScaleDialogProps = Partial<DialogProps>;

interface Dependencies {
  deploymentApi: DeploymentApi;
  state: IObservableValue<Deployment | undefined>;
  showCheckedErrorNotification: ShowCheckedErrorNotification;
}

@observer
class NonInjectedDeploymentScaleDialog extends Component<DeploymentScaleDialogProps & Dependencies> {
  @observable ready = false;
  @observable currentReplicas = 0;
  @observable desiredReplicas = 0;

  constructor(props: DeploymentScaleDialogProps & Dependencies) {
    super(props);
    makeObservable(this);
  }

  close = () => {
    this.props.state.set(undefined);
  };

  @computed get scaleMax() {
    const { currentReplicas } = this;
    const defaultMax = 50;

    return currentReplicas <= defaultMax
      ? defaultMax * 2
      : currentReplicas * 2;
  }

  onOpen = async (deployment: Deployment) => {
    this.currentReplicas = await this.props.deploymentApi.getReplicas({
      namespace: deployment.getNs(),
      name: deployment.getName(),
    });
    this.desiredReplicas = this.currentReplicas;
    this.ready = true;
  };

  onClose = () => {
    this.ready = false;
  };

  onChange = (evt: React.ChangeEvent, value: number) => {
    this.desiredReplicas = value;
  };

  scale = async (deployment: Deployment) => {
    const { currentReplicas, desiredReplicas, close } = this;

    try {
      if (currentReplicas !== desiredReplicas) {
        await this.props.deploymentApi.scale({
          name: deployment.getName(),
          namespace: deployment.getNs(),
        }, desiredReplicas);
      }
      close();
    } catch (err) {
      this.props.showCheckedErrorNotification(err, "Unknown error occurred while scaling Deployment");
    }
  };

  private readonly scaleMin = 0;

  desiredReplicasUp = () => {
    this.desiredReplicas = Math.min(this.scaleMax, this.desiredReplicas + 1);
  };

  desiredReplicasDown = () => {
    this.desiredReplicas = Math.max(this.scaleMin, this.desiredReplicas - 1);
  };

  renderContents(deployment: Deployment) {
    const { currentReplicas, desiredReplicas, onChange, scaleMax } = this;
    const warning = currentReplicas < 10 && desiredReplicas > 90;

    return (
      <Wizard
        header={(
          <h5>
            {"Scale Deployment "}
            <span>{deployment.getName()}</span>
          </h5>
        )}
        done={this.close}
      >
        <WizardStep
          contentClass="flex gaps column"
          next={() => this.scale(deployment)}
          nextLabel="Scale"
          disabledNext={!this.ready}
        >
          <div className="current-scale" data-testid="current-scale">
            Current replica scale:
            {" "}
            {currentReplicas}
          </div>
          <div className="flex gaps align-center">
            <div className="desired-scale" data-testid="desired-scale">
              Desired number of replicas:
              {" "}
              {desiredReplicas}
            </div>
            <div className="slider-container flex align-center">
              <Slider
                value={desiredReplicas}
                max={scaleMax}
                onChange={onChange}
              />
            </div>
            <div className="plus-minus-container flex gaps">
              <Icon
                material="remove_circle_outline"
                onClick={this.desiredReplicasDown}
                data-testid="desired-replicas-down"
              />
              <Icon
                material="add_circle_outline"
                onClick={this.desiredReplicasUp}
                data-testid="desired-replicas-up"
              />
            </div>
          </div>
          {warning && (
            <div className="warning" data-testid="warning">
              <Icon material="warning"/>
              High number of replicas may cause cluster performance issues
            </div>
          )}
        </WizardStep>
      </Wizard>
    );
  }

  render() {
    const { className, state, ...dialogProps } = this.props;
    const deployment = state.get();

    return (
      <Dialog
        {...dialogProps}
        isOpen={Boolean(deployment)}
        className={cssNames("DeploymentScaleDialog", className)}
        onOpen={deployment && (() => this.onOpen(deployment))}
        onClose={this.onClose}
        close={this.close}
      >
        {deployment && this.renderContents(deployment)}
      </Dialog>
    );
  }
}

export const DeploymentScaleDialog = withInjectables<Dependencies, DeploymentScaleDialogProps>(NonInjectedDeploymentScaleDialog, {
  getProps: (di, props) => ({
    ...props,
    deploymentApi: di.inject(deploymentApiInjectable),
    state: di.inject(deploymentScaleDialogStateInjectable),
    showCheckedErrorNotification: di.inject(showCheckedErrorNotificationInjectable),
  }),
});
