<script>
    /*******************************************************************************************************************
     * Common Header Component
     ******************************************************************************************************************/
    import FetchGameDataButton from "./FetchGameDataButton.vue";
    export default {
        props: {
            areaTitle: {
                type: String,
                required: true
            },
            area: {
                type: String,
                required: true
            }
        },
        components: {
            "fetch-button": FetchGameDataButton
        }
    };
</script>

<template>
    <header :class="area">
        <h1>{{areaTitle}}</h1>
        <fetch-button />
    </header>
</template>

<style lang="scss" scoped>
    header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        flex-direction: column;
        flex-wrap: wrap;

        min-height: 16rem;

        background: palette("grey", "bunker") none 50% 50% no-repeat;
        background-size: cover;

        &.empire { background-image: url("bg/empire.jpg"); }
        &.fleets { background-image: url("bg/fleets.jpg"); }
        &.shipyards { background-image: url("bg/shipyards.jpg"); }
        &.research { background-image: url("bg/research.jpg"); }
        &.starmap { background-image: url("bg/starmap.jpg"); }
        &.galnet { background-image: url("bg/galnet.jpg"); }

        @include respond-to("small") {
            flex-direction: row;
        }
    }

    h1 {
        align-self: flex-start;

        padding: 1.6rem;
        margin: 0;

        color: palette("grey", "mystic");

        font-size: 4rem;

        font-weight: 400;
        line-height: 1;
        text-shadow:
            2px 2px 0 palette("grey", "bunker"),
            -2px 2px 0 palette("grey", "bunker"),
            -2px -2px 0 palette("grey", "bunker"),
            2px -2px 0 palette("grey", "bunker");
        text-transform: uppercase;
        letter-spacing: 0.2rem;

        @include respond-to("small") {
            align-self: flex-end;
        }
    }
</style>

