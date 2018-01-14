<script>
    /*******************************************************************************************************************
     * InstallModal
     * this component renders a single install modal (do you want to install, costs x?)
     ******************************************************************************************************************/
    import Button from "Game/common/Button/Button.vue";
    import Costs from "Game/common/Costs/Costs.vue";
    import Icon from "Game/common/Icon/Icon.vue";
    import cfg from "Config";
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
            "costs": Costs,
            "icon": Icon
        },
        computed: {
            playerResources () { return this.$store.getters.playerResources; },
            installModalQuestion () {
                const harvesterName = this.$t("planet.harvesters.names." + this.resourceType);
                return this.$t("planet.harvesters.installModal.question", {typ: harvesterName, planet: this.planetName });
            },
            installCosts () {
                const rules = cfg.rules.harvesters.build.find(slot => slot.type === this.resourceType);
                let returnObj = [{
                    resourceType: "turns",
                    amount: rules.duration
                }];
                returnObj = rules.costs.concat(returnObj);
                return returnObj;
            },
            sufficientFunds () {
                let canInstall = true;
                const costs = cfg.rules.harvesters.build.find(slot => slot.type === this.resourceType).costs;
                costs.forEach( cost => {
                    const stockpile = this.playerResources.find(stock => stock.type === cost.resourceType).current;
                    if ( cost.amount > stockpile ) canInstall = false;
                });
                return canInstall;
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
    <modal :name="`installharvester-${resourceId}-${resourceType}-${index}`"
           :adaptive="true"
           :width="320"
           height="auto">
        <header class="install__header">{{ $t("planet.harvesters.installModal.title") }}</header>
        <div class="install__content">
            {{ installModalQuestion }}
        </div>
        <div class="install__costs">
            <costs :costs="installCosts" />
        </div>
        <div class="install__actions">
            <m-button :onClick="installCancel"
                      :textString="$t('common.buttons.cancel')"
                      iconName="cancel" />
            <m-button :onClick="installConfirm"
                      :textString="$t('common.buttons.install')"
                      iconName="done"
                      :disable="!sufficientFunds" />
        </div>
    </modal>
</template>

<style lang="scss" scoped>
    .install {
        &__header {
            padding: 1rem;
            border-bottom: 3px solid palette("grey", "charcoal");

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
            border-top: 3px solid palette("grey", "charcoal");

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
</style>
