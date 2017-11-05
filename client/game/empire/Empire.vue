<template>
    <p>{{ greeting }} World from Vue!</p>
</template>

<script>
    module.exports = {
        data: function() {
            return {
                greeting: "Hello"
            };
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../theme/abstracts/config";
    @import "../../theme/abstracts/functions";
    @import "../../theme/abstracts/mixins";
    p {
        font-size: 40px;
        text-align: right;
        &:hover {
            background: palette("brand", "christine");
        }
    }
</style>
