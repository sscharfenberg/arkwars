<script>
    /*******************************************************************************************************************
     * Empire (entry) Component
     ******************************************************************************************************************/
    import Header from "Game/common/Header/Header.vue";
    import Stars from "./Stars/Stars.vue";
    export default {
        data: function() {
            return {
                greeting: "Hello"
            };
        },
        components: {
            "app-header": Header,
            "stars": Stars
        }
    };
</script>

<template>
    <div>
        <app-header :areaTitle="$t('title')" area="empire" />
        <stars />
        <vue-snotify></vue-snotify>
        TODO: reports? statistics? show citadel?
    </div>
</template>

<style lang="scss" scoped>
    p {
        margin: 0;

        font-size: 40px;
        text-align: right;

        &:hover {
            background: palette("brand", "christine");
        }
    }
</style>

<style lang="scss">
    @import "~vue-snotify/styles/dark";
</style>
