<script>
/***********************************************************************************************************************
 * Design Component
 * this section shows the "design" component
 **********************************************************************************************************************/
import ScreenSection from "Game/common/ScreenSection/ScreenSection.vue";
import AvailableShipClasses from "./AvailableShipClasses.vue";
export default {
    components: {
        ScreenSection,
        AvailableShipClasses
    },
    computed: {}
};
</script>

<template>
    <div>
        <available-ship-classes />
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

<style scoped>

</style>
