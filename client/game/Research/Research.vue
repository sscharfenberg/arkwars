<script>
/***********************************************************************************************************************
 * Research (entry) Component
 **********************************************************************************************************************/
import Header from "Game/common/Header/Header.vue";
import TechLevels from "./TechLevels/TechLevels.vue";
import ResearchPriority from "./ResearchPriority/ResearchPriority.vue";
import Queue from "./Queue/Queue.vue";
export default {
    components: {
        "app-header": Header,
        TechLevels,
        Queue,
        ResearchPriority
    }
};
</script>

<template>
    <div>
        <app-header
            :area-title="$t('title')"
            area="research" />
        <research-priority />
        <queue />
        <tech-levels />
        <vue-snotify />
    </div>
</template>

<style lang="scss">
    @import "~vue-snotify/styles/dark";
    @import "~Theme/components/game/input-range";

    // styles for vue-modal
    .v--modal-overlay {
        background: rgba(palette("grey", "black"), 0.7);

        .v--modal-box.v--modal-box {
            position: relative;

            overflow: visible;
            border: 1px solid palette("brand", "viking");

            background: palette("grey", "bunker");
            color: palette("text");
            border-radius: 0;
            box-shadow: 0 0 20px rgba(palette("grey", "mystic"), 0.3);
        }

        .close-modal.close-modal.close-modal {
            position: absolute;
            top: -17px;
            right: -17px;

            background-color: palette("grey", "sunken");
            color: palette("brand", "viking");
            border-color: palette("brand", "viking");

            &:hover {
                color: palette("grey", "white");
                border-color: palette("grey", "white");
            }
        }
    }
</style>
