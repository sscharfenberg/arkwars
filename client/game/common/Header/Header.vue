<template>
    <header>
        <h1>{{areaTitle}}</h1>
        <button class="refresh" @click="refreshArea">refresh</button>
    </header>
</template>

<script>
    export default {
        props: {
            areaTitle: {
                type: String,
                required: true
            }
        },
        methods: {
            refreshArea: () => {
                console.log("refresh area");
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../../theme/abstracts/config";
    @import "../../../theme/abstracts/functions";
    header {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: space-between;

        min-height: 16rem;

        background: palette("grey", "bunker") url("bg/empire.jpg") 50% 50% no-repeat;
        background-size: cover;
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
    .refresh {
        border: 0;
        flex: 0 0 auto;

        padding: 0;
        margin: 1.6rem;
    }
</style>
