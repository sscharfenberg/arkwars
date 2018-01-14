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
    .v--modal-overlay {
        background: rgba(palette("grey", "black"), 0.5);
    }

    .v--modal {
        border: 3px solid palette("grey", "charcoal");

        background: palette("grey", "sunken");
        color: palette("text");
        border-radius: 0;
        box-shadow: 0 0 60px rgba(palette("grey", "mystic"), 0.15);
    }
</style>
