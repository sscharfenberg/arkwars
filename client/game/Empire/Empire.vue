<template>
    <div>
        <app-header :areaTitle="$t('title')" area="empire" />
        <p>{{ greeting }} World from Vue!</p>
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
        margin: 0;

        font-size: 40px;
        text-align: right;

        &:hover {
            background: palette("brand", "christine");
        }
    }
</style>
