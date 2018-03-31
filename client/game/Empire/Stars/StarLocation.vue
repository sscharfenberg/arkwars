<script>
/*******************************************************************************************************************
 * StarLocation
 * this component displays the location of a star as (x,y)
 ******************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
export default {
    props: {
        coordX: {
            type: Number,
            required: true
        },
        coordY: {
            type: Number,
            required: true
        }
    },
    components: {
        Icon
    }
};
</script>

<template>
    <aside
        class="location"
        :aria-label="$t('star.location')"
        :title="$t('star.location')">
        <div class="location-inner">
            <icon
                class="location-icon"
                name="location" />
            <span>{{ coordX }}/{{ coordY }}</span>
        </div>
    </aside>
</template>



<style lang="scss" scoped>
    .location {
        display: flex;
        align-items: center;

        padding: 0 0 0 0.5rem;

        background-color: palette("grey", "sunken");
        color: palette("text", "subdued");

        @include respond-to("small") {
            padding: 0 1rem;
        }
    }

    .location-inner {
        display: flex;
        align-items: center;

        padding: 0.5rem;

        background-color: palette("grey", "bunker");

        > .location-icon {
            margin-right: 1rem;

            color: darken(palette("text", "subdued"), 25%);
        }

        > span {
            width: 3rem;

            font-size: 0.8em;
            text-align: center;

            @include respond-to("small") {
                width: 4rem;

                font-size: 1em;
            }
        }
    }

</style>
