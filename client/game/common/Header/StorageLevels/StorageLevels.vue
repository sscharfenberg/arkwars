<script>
/*******************************************************************************************************************
 * StorageUpgrades
 * this componenet displays the storage upgrades for a resource type
 ******************************************************************************************************************/
import {playerRules} from "Config";
export default {
    props: {
        level: {
            type: Number,
            required: true
        },
        area: {
            type: String,
            required: true
        }
    },
    computed: {
        getLabel () { return this.$t("common.header.storageUpgrades.label", {num: this.level}); },
        numStorageUpgrades () {
            return playerRules.resourceTypes[0].storageLevels.length - 1; // -1 because 0 is no upgrade
        }
    },
    methods: {
        installedClass (n) {
            let classList = n <= this.level ? "active" : "";
            const upgrading = this.$store.getters.storageUpgrades
                .find(upgrade => upgrade.area === this.area && upgrade.newLevel === n);
            classList += upgrading ? " building" : "";
            return classList;
        }
    }
};
</script>

<template>
    <ul
        class="storage-upgrades"
        :aria-label="getLabel"
        :title="getLabel">
        <li
            class="upgrade"
            :class="installedClass(n)"
            v-for="n in numStorageUpgrades"
            :key="n">&nbsp;</li>
    </ul>
</template>

<style lang="scss" scoped>
    .storage-upgrades {
        display: flex;
        flex-direction: column;

        padding: 0;
        margin: 0;

        list-style: none;

        > .upgrade {
            width: 0.5rem;
            height: 0.6rem;
            border: 1px solid palette("grey", "sunken");
            border-left-width: 0;
            margin: 0 0 0.1rem 0;

            background: rgba(palette("grey", "charcoal"), 0.7);

            text-indent: -1000em;

            &:first-child { height: 0.7rem; }
            &:last-child { margin-bottom: 0; }

            &.active {
                background:
                    linear-gradient(
                        to top left,
                        palette("state", "success") 0%,
                        palette("brand", "gorse") 100%
                    );
            }

            &.building {
                background-color: rgba(palette("state", "warning"), 0.7);
            }
        }
    }
</style>
