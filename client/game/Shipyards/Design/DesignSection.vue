<script>
/***********************************************************************************************************************
 * Design Component
 * this section shows the "design" component
 **********************************************************************************************************************/
import ScreenSection from "Game/common/ScreenSection/ScreenSection.vue";
import AvailableShipClasses from "./AvailableShipClasses.vue";
import Button from "Game/common/Button/Button.vue";
export default {
    components: {
        ScreenSection,
        AvailableShipClasses,
        btn: Button
    },
    computed: {},
    methods: {
        newClass () { alert("doh"); }
    }
};
</script>

<template>
    <div>
        <screen-section class="available">
            <h3>{{ $t("design.available.title") }}</h3>
            <btn
                :on-click="newClass"
                icon-name="lightbulb"
                :text-string="$t('design.new.title')"
                :label="$t('design.new.label')" />
            <available-ship-classes />
        </screen-section>
        <screen-section :hdl="$t('design.new.title')">
            <ul>
                <li>1</li>
                <li>2</li>
                <li>3</li>
                <li>4</li>
                <li>5</li>
            </ul>
        </screen-section>
    </div>

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
    }
</style>
