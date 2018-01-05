<template>
    <header :class="area">
        <h1>{{areaTitle}}</h1>
        <refresh-btn />
    </header>
</template>

<script>
    import RefreshGameDataBtn from "./RefreshGameDataBtn.vue";
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
            "refresh-btn": RefreshGameDataBtn
        }
    };
</script>

<style lang="scss" scoped>
    header {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: space-between;

        min-height: 16rem;

        background: palette("grey", "bunker") none 50% 50% no-repeat;
        background-size: cover;
        &.empire { background-image: url("bg/empire.jpg"); }
        &.fleets { background-image: url("bg/fleets.jpg"); }
        &.shipyards { background-image: url("bg/shipyards.jpg"); }
        &.research { background-image: url("bg/research.jpg"); }
        &.starmap { background-image: url("bg/starmap.jpg"); }
        &.galnet { background-image: url("bg/galnet.jpg"); }
    }
    h1 {
        align-self: flex-end;

        margin: 0;
        padding: 1.6rem;

        font-size: 4rem;
        color: palette("grey", "mystic");
        line-height: 1;
        letter-spacing: 0.2rem;
        font-weight: 400;
        text-shadow: 2px 2px 0 palette("grey", "bunker"),
            -2px 2px 0 palette("grey", "bunker"),
            -2px -2px 0 palette("grey", "bunker"),
            2px -2px 0 palette("grey", "bunker");
        text-transform: uppercase;
    }

</style>
