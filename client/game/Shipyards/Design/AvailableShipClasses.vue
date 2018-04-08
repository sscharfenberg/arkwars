<script>
/***********************************************************************************************************************
 * Available Ship Classes
 * this component lists the available ship classes
 **********************************************************************************************************************/
import ScreenSection from "Game/common/ScreenSection/ScreenSection.vue";
import Button from "Game/common/Button/Button.vue";
export default {
    components: {
        ScreenSection,
        btn: Button
    },
    computed: {
        shipClasses () { return this.$store.getters.shipClasses; }
    },
    methods: {
        showDetails () { alert("doh"); }
    }
};
</script>

<template>
    <screen-section class="available">
        <h3>{{ $t("design.available.title") }}</h3>
        <btn
            :on-click="showDetails"
            icon-name="lightbulb"
            :text-string="$t('design.new.title')"
            :label="$t('design.new.label')" />
        <ul>
            <li
                v-for="sc in shipClasses"
                :key="sc.id">
                {{ sc.name }} {{ sc.hullType }}
            </li>
        </ul>
    </screen-section>
</template>

<style lang="scss" scoped>
    .available {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;

        padding: 1rem;

        background: palette("grey", "sunken");

        > h3 {
            margin: 0;

            color: palette("brand", "viking");

            font-size: 2.4rem;
            font-weight: 300;
        }

        > ul {
            padding: 0;
            margin: 1rem 0 0 0;
            flex-basis: 100%;

            list-style: none;
        }
    }
</style>
