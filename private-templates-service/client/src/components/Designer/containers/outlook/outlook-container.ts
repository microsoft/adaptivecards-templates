// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Adaptive from "adaptivecards";
import * as Designer from "adaptivecards-designer";

var outlookConfiguration = require("../../../../../../samples/HostConfig/outlook-desktop.json");

export class OutlookContainer extends Designer.HostContainer {
    public renderTo(hostElement: HTMLElement) {
        hostElement.classList.add("outlook-frame");
        hostElement.appendChild(this.cardHost);
    }

    public initialize() {
        super.initialize();

        Adaptive.AdaptiveCard.actionTypeRegistry.unregisterType("Action.Submit");
        Adaptive.AdaptiveCard.actionTypeRegistry.registerType("Action.Http", () => { return new Adaptive.HttpAction(); });

        Adaptive.AdaptiveCard.useMarkdownInRadioButtonAndCheckbox = false;
    }

    private parsePadding(json: any): Adaptive.PaddingDefinition | null {
        if (json) {
            if (typeof json === "string") {
                var uniformPadding = Adaptive.getEnumValue(Adaptive.Spacing, json, Adaptive.Spacing.None);

                return new Adaptive.PaddingDefinition(
                    uniformPadding,
                    uniformPadding,
                    uniformPadding,
                    uniformPadding);
            }
            else if (typeof json === "object") {
                return new Adaptive.PaddingDefinition(
                    Adaptive.getEnumValue(Adaptive.Spacing, json["top"], Adaptive.Spacing.None),
                    Adaptive.getEnumValue(Adaptive.Spacing, json["right"], Adaptive.Spacing.None),
                    Adaptive.getEnumValue(Adaptive.Spacing, json["bottom"], Adaptive.Spacing.None),
                    Adaptive.getEnumValue(Adaptive.Spacing, json["left"], Adaptive.Spacing.None));
            }
        }

        return null;
    }

    public parseElement(element: Adaptive.CardElement, json: any) {
        if (element instanceof Adaptive.AdaptiveCard) {
            var card = <Adaptive.AdaptiveCard>element;
            var actionArray: Array<Adaptive.Action> = [];

            actionArray.forEach((action) => card.addAction(action));

            if (typeof json["resources"] === "object") {
                var actionResources = json["resources"]["actions"] as Array<any>;

                for (var i = 0; i < actionResources.length; i++) {
                    let action = Adaptive.AdaptiveCard.actionTypeRegistry.createInstance(actionResources[i]["type"]);

                    if (action) {
                        action.parse(actionResources[i]);
                        action.setParent(card);

                        actionArray.push(action);
                    }
                }
            }
        }

        if (element instanceof Adaptive.Image) {
            (<Adaptive.Image>element).backgroundColor = json["backgroundColor"];
        }

        if (element instanceof Adaptive.Container) {
            var padding = this.parsePadding(json["padding"]);

            if (padding) {
                (<Adaptive.Container>element).padding = padding;
            }
        }

        if (element instanceof Adaptive.ColumnSet) {
            var padding = this.parsePadding(json["padding"]);

            if (padding) {
                (<Adaptive.ColumnSet>element).padding = padding;
            }
        }
    }

    public anchorClicked(element: Adaptive.CardElement, anchor: HTMLAnchorElement): boolean {
        var regEx = /^action:([a-z0-9]+)$/ig;
        var rootCard = element.getRootElement() as Adaptive.AdaptiveCard;
        var matches = regEx.exec(anchor.href);

        if (matches) {
            var actionId = matches[1];

            if (rootCard) {
                //var actionArray = rootCard["resources"]["actions"] as Array<Adaptive.Action>;
                var actionArray = Array<Adaptive.Action>();
                for (var i = 0; i < rootCard.getActionCount(); i++) {
                    actionArray.push(rootCard.getActionAt(i));
                }
                for (var i = 0; i < actionArray.length; i++) {
                    if (actionArray[i].id == actionId) {
                        actionArray[i].execute();

                        return true;
                    }
                }
            }
        }

        return false;
    }

    public getHostConfig(): Adaptive.HostConfig {
        return new Adaptive.HostConfig(outlookConfiguration);
    }
}
