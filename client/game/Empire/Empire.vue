<script>
    /*******************************************************************************************************************
     * Empire (entry) Component
     ******************************************************************************************************************/
    import Header from "Game/common/Header/Header.vue";
    import StarsList from "./Stars/Stars.vue";
    export default {
        data: function() {
            return {
                greeting: "Hello"
            };
        },
        components: {
            "app-header": Header,
            "stars-list": StarsList
        }
    };
</script>

<template>
    <div>
        <app-header :areaTitle="$t('title')" area="empire" />
        <stars-list />
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
