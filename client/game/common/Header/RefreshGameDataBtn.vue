<template>
    <button @click="fetchGameData">
        {{$txt.common.header.refresh}}
    </button>
</template>

<script>
    export default {
        methods: {
            fetchGameData: function() {
                this.$store.dispatch("FETCH_GAMEDATA_FROM_API");
            }
        }
    };
</script>

<style lang="scss" scoped>
    button {
        border: 0;
        flex: 0 0 auto;

        padding: 0;
        margin: 1.6rem;
        background: orange;
    }
</style>
