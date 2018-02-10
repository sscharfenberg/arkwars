<script>
/*******************************************************************************************************************
 * InstallModal
 * this component renders a single install modal (do you want to install, costs x?)
 ******************************************************************************************************************/
import Button from "Game/common/Button/Button.vue";
import Costs from "Game/common/Costs/Costs.vue";
import Icon from "Game/common/Icon/Icon.vue";
import {harvesterRules} from "Config";
export default {
    props: {
        resourceId: {
            type: String,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        resourceType: {
            type: String,
            required: true
        },
        planetName: {
            type: String,
            required: true
        },
        planetid: {
            type: String,
            required: true
        }
    },
    components: {
        "m-button": Button,
        Costs,
        Icon
    },
    computed: {
        playerResources () { return this.$store.getters.playerResources; },
        installModalQuestion () {
            const harvesterName = this.$t("planet.harvesters.names." + this.resourceType);
            return this.$t("planet.harvesters.installModal.question", {typ: harvesterName, planet: this.planetName });
        },
        installCosts () {
            const rules = harvesterRules.types.find(slot => slot.type === this.resourceType);
            let returnObj = [{
                resourceType: "turns",
                amount: rules.duration
            }];
            returnObj = rules.costs.concat(returnObj);
            return returnObj;
        },
        sufficientFunds () {
            let canInstall = true;
            const costs = harvesterRules.types.find(slot => slot.type === this.resourceType).costs;
            costs.forEach( cost => {
                const stockpile = this.playerResources.find(stock => stock.type === cost.resourceType).current;
                if ( cost.amount > stockpile ) canInstall = false;
            });
            return canInstall;
        },
        resGrade () {
            const planetResources = this.$store.getters.planetById(this.planetid).resourceSlots;
            return planetResources.find(res => res.resourceType === this.resourceType).resGrade;
        },
        resGradeClass () {
            if (this.resGrade > 1.2) return "high";
            if (this.resGrade < 0.8) return "low";
            return "";
        },
        resGradeLabel () {
            const resourceName = this.$t("common.resourceTypes." + this.resourceType );
            return this.$t("planet.harvesters.production.resGrade", {type: resourceName});
        }
    },
    methods: {
        installConfirm () {
            const payload = {harvesterType: this.resourceType, planet: this.planetid, resourceId: this.resourceId};
            this.$modal.hide(`installharvester-${this.resourceId}-${this.resourceType}-${this.index}`);
            return this.$store.dispatch("INSTALL_HARVESTER", payload);
        },
        installCancel () {
            this.$modal.hide(`installharvester-${this.resourceId}-${this.resourceType}-${this.index}`);
        }
    }
};
</script>

<template>
    <modal
        :name="`installharvester-${resourceId}-${resourceType}-${index}`"
        :adaptive="true"
        :width="320"
        height="auto"
        :scrollable="true">
        <header class="install__header">{{ $t("planet.harvesters.installModal.title") }}</header>
        <div class="install__content">
            {{ installModalQuestion }}
        </div>
        <div class="install__costs">
            <ul class="grade">
                <li class="label">{{ resGradeLabel }}</li>
                <li
                    class="value"
                    :class="resGradeClass">{{ resGrade }}</li>
            </ul>
            <costs :costs="installCosts" />
        </div>
        <div class="install__actions">
            <m-button
                :on-click="installCancel"
                :text-string="$t('common.buttons.cancel')"
                icon-name="cancel" />
            <m-button
                :on-click="installConfirm"
                :text-string="$t('common.buttons.install')"
                icon-name="done"
                :disable="!sufficientFunds" />
        </div>
        <m-button
            class="close-modal"
            :on-click="installCancel"
            icon-name="cancel" />
    </modal>
</template>

<style lang="scss" scoped>
    .install {
        &__header {
            padding: 1rem;
            border-bottom: 1px solid palette("brand", "viking");

            color: palette("brand", "viking");

            font-size: 1.8rem;
        }

        &__content {
            padding: 2rem 1rem 1rem;
        }

        &__costs {
            padding: 1rem 1rem 2rem;
        }

        &__actions {
            display: flex;
            justify-content: stretch;

            padding: 0.2rem;
            border-top: 1px solid palette("brand", "viking");

            > button {
                justify-content: center;

                margin-right: 0.2rem;
                flex: 1;

                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }

    .grade {
        display: flex;
        justify-content: stretch;

        padding: 0;
        margin: 0 0 1rem 0;

        list-style: none;

        > li {
            padding: 0.5rem 1rem;
            margin: 0 2px 2px 0;

            &:last-child {
                margin-right: 0;
            }
        }

        .label {
            border: 1px solid palette("grey", "abbey");
            flex: 0 0 60%;

            background: palette("grey", "deep");
        }

        .value {
            display: flex;
            align-items: center;
            justify-content: center;

            border: 1px solid palette("grey", "abbey");
            flex-grow: 1;

            background: palette("grey", "deep");

            &.high {
                border-color: palette("state", "online");
            }

            &.low {
                border-color: palette("state", "building");
            }
        }
    }
</style>
