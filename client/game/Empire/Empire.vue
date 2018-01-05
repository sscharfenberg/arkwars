<template>
    <div>
        <app-header :areaTitle="$txt.title" area="empire" />
        <p>{{ greeting }} World from Vue!</p>
        <p>{{ $store.state.gameId }}</p>
    </div>
</template>

<script>
    import Header from "../common/Header/Header.vue";
    export default {
        data: function() {
            return {
                greeting: "Hello"
            };
        },
        components: {
            "app-header": Header
        }
    };
</script>

<style lang="scss" scoped>

    p {
        text-align: right;
        margin: 0;
        font-size: 40px;
        &:hover {
            background: palette("brand", "christine");
        }
    }
</style>
